import { headers } from "next/headers";
import { getAuthorizationHeaderValue } from "./session";

const headersInitToRecord = (input?: HeadersInit): Record<string, string> => {
  if (!input) return {};

  if (input instanceof Headers) {
    return Object.fromEntries(input.entries());
  }

  if (Array.isArray(input)) {
    return Object.fromEntries(input);
  }

  return { ...input };
};

export async function createServerRequestOptions(
  init?: RequestInit,
): Promise<RequestInit> {
  const incomingHeaders = await headers();
  const forwardedHeaders: Record<string, string> = {};
  const sessionAuthorization = await getAuthorizationHeaderValue();

  const cookie = incomingHeaders.get("cookie");
  if (cookie) {
    forwardedHeaders.cookie = cookie;
  }

  if (sessionAuthorization) {
    forwardedHeaders.authorization = sessionAuthorization;
  } else {
    const authorization = incomingHeaders.get("authorization");
    if (authorization) {
      forwardedHeaders.authorization = authorization;
    }
  }

  return {
    ...init,
    credentials: "include",
    headers: {
      ...forwardedHeaders,
      ...headersInitToRecord(init?.headers),
    },
  };
}
