import {
  refreshTokenUsersRefreshPost,
  type RefreshTokenRequestDTO,
} from "@/lib/generated";
import type { refreshTokenUsersRefreshPostResponse200 } from "@/lib/generated/endpoints/users/users";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const TOKEN_TYPE_COOKIE = "token_type";
const ACCESS_TOKEN_EXPIRES_AT_COOKIE = "access_token_expires_at";
const DEFAULT_EXPIRY_MS = 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";
const MIN_VALID_EXPIRY_BUFFER_MS = 1000;
const REFRESH_BEFORE_EXPIRY_MS = 30 * 1000;

export type SessionTokenInput = {
  token: string;
  type?: string;
  expires_at?: string;
  title?: string;
  refresh_token?: string;
};

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
  payload: Record<string, unknown> | null | undefined,
  authorizationHeader: string | null,
): SessionTokenInput | null => {
  if (!payload) {
    return parseAuthorizationHeader(authorizationHeader);
  }

  const payloadToken =
    isNonEmptyString(payload.token)
      ? (payload.token as string).trim()
      : isNonEmptyString(payload.access_token)
        ? (payload.access_token as string).trim()
        : "";

  if (!payloadToken) {
    return parseAuthorizationHeader(authorizationHeader);
  }

  const expiresAt = isNonEmptyString(payload.expires_at)
    ? (payload.expires_at as string)
    : typeof payload.exp === "number"
      ? new Date((payload.exp as number) * 1000).toISOString()
      : undefined;

  return {
    token: payloadToken,
    type: isNonEmptyString(payload.type)
      ? (payload.type as string)
      : isNonEmptyString(payload.token_type)
        ? (payload.token_type as string)
        : "Bearer",
    title: isNonEmptyString(payload.title)
      ? (payload.title as string)
      : "access-token",
    expires_at: expiresAt,
    refresh_token: isNonEmptyString(payload.refresh_token)
      ? (payload.refresh_token as string).trim()
      : undefined,
  };
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
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires,
  });

  cookieStore.set(TOKEN_TYPE_COOKIE, tokenType, {
    httpOnly: false,
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

  const refreshToken = tokenPayload.refresh_token?.trim();
  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires,
    });
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(TOKEN_TYPE_COOKIE);
  cookieStore.delete(ACCESS_TOKEN_EXPIRES_AT_COOKIE);
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function refreshSessionFromServer(
  options?: { persist?: boolean },
): Promise<SessionTokenInput | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const body: RefreshTokenRequestDTO = { refresh_token: refreshToken };
    const refreshResult = await refreshTokenUsersRefreshPost(body);

    if (refreshResult.status !== 200) {
      return null;
    }

    const successResponse = refreshResult as refreshTokenUsersRefreshPostResponse200;
    const { access_token, refresh_token, token_type } = successResponse.data;
    const sessionToken = extractSessionToken(
      { access_token, refresh_token, token_type },
      null,
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
