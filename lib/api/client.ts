import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import { DEFAULT_ERROR_MESSAGE, getStatusMessage } from "@/lib/constants/message";

const normalizeBaseUrl = (value: string) =>
  value
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/docs$/, "");

const DEFAULT_API_BASE_URL_SERVER = "http://127.0.0.1:8000";
const DEFAULT_API_BASE_URL_CLIENT = "/api/proxy";

const resolveApiBaseUrl = () => {
  const rawBaseUrl =
    typeof window === "undefined"
      ? (process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL_SERVER)
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL_CLIENT);

  return normalizeBaseUrl(rawBaseUrl);
};

const instance = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

const TOAST_INTERCEPTOR_KEY = "__home_web_axios_toast_interceptor__";
type AxiosToastWindow = Window & {
  __home_web_axios_toast_interceptor__?: boolean;
};

const showClientErrorToast = (message: string) => {
  if (typeof window === "undefined") {
    return;
  }

  void import("sonner").then(({ toast }) => {
    toast.error(message);
  });
};

type ValidationErrorItem = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

const extractErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error) || !error.response?.data) {
    return DEFAULT_ERROR_MESSAGE;
  }

  const data = error.response.data as Record<string, unknown>;
  const status = error.response.status;
  const detail = data.detail;

  if (detail) {
    if (Array.isArray(detail)) {
      const messages = (detail as ValidationErrorItem[])
        .map((e) => e.msg)
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(" • ");
      }
    }

    if (typeof detail === "string" && detail.length > 0) {
      return detail;
    }
  }

  if (typeof data.message === "string" && data.message.length > 0) {
    return data.message;
  }

  return getStatusMessage(status) || DEFAULT_ERROR_MESSAGE;
};

type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (token: string | null, error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const TOKEN_REFRESH_INTERCEPTOR_KEY = "__home_web_token_refresh_interceptor__";
type TokenRefreshWindow = Window & {
  __home_web_token_refresh_interceptor__?: boolean;
};

if (typeof window !== "undefined") {
  const browserWindow = window as TokenRefreshWindow & AxiosToastWindow;

  if (!browserWindow[TOKEN_REFRESH_INTERCEPTOR_KEY]) {
    instance.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        if (!isAxiosError(error) || error.response?.status !== 401) {
          return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (!originalRequest || (originalRequest as Record<string, unknown>)._retry) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => instance(originalRequest));
        }

        (originalRequest as Record<string, unknown>)._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!refreshResponse.ok) {
            throw new Error("Refresh failed");
          }

          processQueue(null, null);
          return instance(originalRequest);
        } catch {
          processQueue(null, new Error("Refresh failed"));
          window.location.href = "/login";
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      },
    );

    browserWindow[TOKEN_REFRESH_INTERCEPTOR_KEY] = true;
  }

  if (!browserWindow[TOAST_INTERCEPTOR_KEY]) {
    instance.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (isAxiosError(error) && error.config && (error.config as Record<string, unknown>)._retry) {
          return Promise.reject(error);
        }

        const message = extractErrorMessage(error);
        showClientErrorToast(message);
        return Promise.reject(error);
      },
    );

    browserWindow[TOAST_INTERCEPTOR_KEY] = true;
  }
}

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
