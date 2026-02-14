import axios, { AxiosRequestConfig } from "axios";

const normalizeBaseUrl = (value: string) =>
  value
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/docs$/, "");

const resolveApiBaseUrl = () => {
  const rawBaseUrl =
    typeof window === "undefined"
      ? process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error(
      "Missing API base URL. Set API_BASE_URL (server) and NEXT_PUBLIC_API_BASE_URL (client).",
    );
  }

  return normalizeBaseUrl(rawBaseUrl);
};

const instance = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const hasJsonContentType =
    config.headers?.["Content-Type"] === "application/json";
  const isFormDataBody =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  const isEmptyBody =
    config.data === undefined ||
    config.data === null ||
    (typeof config.data === "object" &&
      Object.keys(config.data as Record<string, unknown>).length === 0);

  // Let the browser set multipart boundary automatically and avoid empty JSON bodies.
  if (hasJsonContentType && (isEmptyBody || isFormDataBody)) {
    delete (config.headers as Record<string, unknown>)["Content-Type"];
    delete config.data;
  }

  return config;
});

const normalizeHeaders = (
  input?: HeadersInit,
): Record<string, string> | undefined => {
  if (!input) return undefined;

  if (input instanceof Headers) {
    const headers: Record<string, string> = {};
    input.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  if (Array.isArray(input)) {
    const headers: Record<string, string> = {};
    input.forEach(([key, value]) => {
      headers[key] = value;
    });
    return headers;
  }

  return input as Record<string, string>;
};

const toHeaders = (input: unknown): Headers => {
  const headers = new Headers();

  if (!input || typeof input !== "object") {
    return headers;
  }

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (value === undefined || value === null) {
      continue;
    }

    headers.set(key, Array.isArray(value) ? value.join(", ") : String(value));
  }

  return headers;
};

// Signature expected by Orval mutator with requestOptions: { type: "axios" }
export const axiosInstance = async <T = unknown>(
  url: string,
  options?: RequestInit & {
    type?: string;
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit | null;
  },
): Promise<T> => {
  const method = options?.method || "GET";
  const { body, headers: requestHeaders } = options ?? {};
  const withCredentials =
    options?.credentials === "include"
      ? true
      : options?.credentials === "omit"
        ? false
        : undefined;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: normalizeHeaders(requestHeaders),
    data: body,
    signal: options?.signal ?? undefined,
    withCredentials,
  };

  const response = await instance.request(config);

  return {
    data: response.data,
    status: response.status,
    headers: toHeaders(response.headers),
  } as T;
};
