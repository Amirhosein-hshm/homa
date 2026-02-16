import type { Token } from "@/lib/generated/types/model";
import { refreshTokensApiAuthRefreshPost } from "@/lib/generated/endpoints/auth";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

const ACCESS_TOKEN_COOKIE = "access_token";
const TOKEN_TYPE_COOKIE = "token_type";
const ACCESS_TOKEN_EXPIRES_AT_COOKIE = "access_token_expires_at";
const DEFAULT_EXPIRY_MS = 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";
const MIN_VALID_EXPIRY_BUFFER_MS = 1000;
const REFRESH_BEFORE_EXPIRY_MS = 30 * 1000;

export type SessionTokenInput = Pick<Token, "token"> &
  Partial<Pick<Token, "type" | "expires_at" | "title">>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const parseAuthorizationHeader = (
  authorizationHeader: string | null,
): SessionTokenInput | null => {
  if (!isNonEmptyString(authorizationHeader)) {
    return null;
  }

  const [tokenType = "Bearer", ...tokenParts] = authorizationHeader
    .trim()
    .split(/\s+/);
  const token = tokenParts.join(" ").trim();

  if (!token) {
    return null;
  }

  return {
    token,
    type: tokenType,
    title: "authorization-header-token",
  };
};

export const extractSessionToken = (
  payload: Token | null | undefined,
  authorizationHeader: string | null,
): SessionTokenInput | null => {
  const rawPayload = payload as
    | (Partial<Token> & {
        access_token?: string;
        token_type?: string;
        exp?: number;
      })
    | null
    | undefined;

  const payloadToken = isNonEmptyString(rawPayload?.token)
    ? rawPayload.token.trim()
    : isNonEmptyString(rawPayload?.access_token)
      ? rawPayload.access_token.trim()
      : "";

  if (payloadToken) {
    const expiresAt = isNonEmptyString(rawPayload?.expires_at)
      ? rawPayload.expires_at
      : typeof rawPayload?.exp === "number"
        ? new Date(rawPayload.exp * 1000).toISOString()
        : undefined;

    return {
      token: payloadToken,
      type: isNonEmptyString(rawPayload?.type)
        ? rawPayload.type
        : isNonEmptyString(rawPayload?.token_type)
          ? rawPayload.token_type
          : "Bearer",
      title: isNonEmptyString(rawPayload?.title)
        ? rawPayload.title
        : "access-token",
      expires_at: expiresAt,
    };
  }

  return parseAuthorizationHeader(authorizationHeader);
};

const resolveExpiryDate = (expiresAt?: string) => {
  if (!expiresAt) {
    return new Date(Date.now() + DEFAULT_EXPIRY_MS);
  }

  const parsedDate = new Date(expiresAt);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getTime() <= Date.now() + MIN_VALID_EXPIRY_BUFFER_MS
  ) {
    return new Date(Date.now() + DEFAULT_EXPIRY_MS);
  }

  return parsedDate;
};

const parseIsoDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

const isAccessTokenExpired = (expiresAt?: string | null): boolean => {
  const parsedDate = parseIsoDate(expiresAt);
  if (!parsedDate) {
    return false;
  }

  return parsedDate.getTime() <= Date.now() + MIN_VALID_EXPIRY_BUFFER_MS;
};

const isAccessTokenNearExpiry = (expiresAt?: string | null): boolean => {
  const parsedDate = parseIsoDate(expiresAt);
  if (!parsedDate) {
    return false;
  }

  return parsedDate.getTime() <= Date.now() + REFRESH_BEFORE_EXPIRY_MS;
};

export async function setSessionFromToken(
  tokenPayload: SessionTokenInput,
): Promise<void> {
  const token = tokenPayload.token?.trim();
  if (!token) {
    throw new Error("Cannot set session without access token.");
  }

  const tokenType = tokenPayload.type?.trim() || "Bearer";
  const expires = resolveExpiryDate(tokenPayload.expires_at);
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires,
  });

  cookieStore.set(TOKEN_TYPE_COOKIE, tokenType, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires,
  });

  cookieStore.set(ACCESS_TOKEN_EXPIRES_AT_COOKIE, expires.toISOString(), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(TOKEN_TYPE_COOKIE);
  cookieStore.delete(ACCESS_TOKEN_EXPIRES_AT_COOKIE);
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

type RefreshResponse = Awaited<ReturnType<typeof refreshTokensApiAuthRefreshPost>>;
type RefreshSuccessResponse = Extract<RefreshResponse, { status: 200 }>;

const isRefreshSuccessResponse = (
  response: RefreshResponse,
): response is RefreshSuccessResponse =>
  response.status === 200 && response.data.success;

export async function refreshSessionFromServer(
  options?: { persist?: boolean },
): Promise<SessionTokenInput | null> {
  try {
    const incomingHeaders = await headers();
    const forwardedHeaders: Record<string, string> = {};

    const cookie = incomingHeaders.get("cookie");
    if (cookie) {
      forwardedHeaders.cookie = cookie;
    }

    const refreshResult = await refreshTokensApiAuthRefreshPost({
      credentials: "include",
      headers: forwardedHeaders,
    });

    if (!isRefreshSuccessResponse(refreshResult)) {
      return null;
    }

    const sessionToken = extractSessionToken(
      refreshResult.data.payload,
      refreshResult.headers.get("authorization"),
    );

    if (!sessionToken) {
      return null;
    }

    if (options?.persist) {
      await setSessionFromToken(sessionToken);
    }

    return sessionToken;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getAuthorizationHeaderValue());
}

export async function getAuthorizationHeaderValue(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const tokenType = cookieStore.get(TOKEN_TYPE_COOKIE)?.value || "Bearer";
  const tokenExpiresAt = cookieStore.get(ACCESS_TOKEN_EXPIRES_AT_COOKIE)?.value;

  if (token && !isAccessTokenNearExpiry(tokenExpiresAt)) {
    return `${tokenType} ${token}`;
  }

  const refreshedSessionToken = await refreshSessionFromServer();
  if (refreshedSessionToken?.token) {
    return `${refreshedSessionToken.type || "Bearer"} ${refreshedSessionToken.token}`;
  }

  if (token && !isAccessTokenExpired(tokenExpiresAt)) {
    return `${tokenType} ${token}`;
  }

  return null;
}

export async function requireAuthenticated(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }
}

export async function redirectIfAuthenticated(): Promise<void> {
  if (await isAuthenticated()) {
    redirect("/meets");
  }
}
