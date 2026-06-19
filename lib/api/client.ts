import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

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

const showClientErrorToast = (message: string) => {
  if (typeof window === "undefined") return;
  void import("sonner").then(({ toast }) => {
    toast.error(message);
  });
};

const showClientSuccessToast = (message: string) => {
  if (typeof window === "undefined") return;
  void import("sonner").then(({ toast }) => {
    toast.success(message);
  });
};

const extractError = (error: unknown): string => {
  if (!isAxiosError(error) || !error.response?.data) {
    return "خطای غیرمنتظره‌ای رخ داد.";
  }

  const data = error.response.data as Record<string, unknown>;
  const detail = data.detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((e: Record<string, unknown>) => e.msg)
      .filter(Boolean);
    if (messages.length > 0) return messages.join(" • ");
  }

  if (typeof detail === "string" && detail.length > 0) return detail;
  if (typeof data.message === "string" && data.message.length > 0)
    return data.message;

  return "خطای غیرمنتظره‌ای رخ داد.";
};

// ==========================================
// Token Refresh Queue Logic
// ==========================================
type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
// ==========================================

if (typeof window !== "undefined") {
  instance.interceptors.response.use(
    (response) => {
      const method = response.config?.method?.toUpperCase();
      if (["POST", "PUT", "PATCH", "DELETE"].includes(method ?? "")) {
        const data = response.data as Record<string, unknown> | undefined;
        const message =
          (data?.message as string | undefined) || "عملیات با موفقیت انجام شد.";
        showClientSuccessToast(message);
      }
      return response;
    },
    async (error: unknown) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      if (!isAxiosError(error)) return Promise.reject(error);

      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && originalRequest) {
        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!refreshResponse.ok) {
            throw new Error("Refresh token expired or invalid");
          }

          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          window.location.href = "/login";
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      const message = extractError(error);
      showClientErrorToast(message);
      return Promise.reject(error);
    },
  );
}

const getClientCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqIdx = cookie.indexOf("=");
    if (eqIdx === -1) continue;
    const key = cookie.slice(0, eqIdx).trim();
    if (key === name) {
      return decodeURIComponent(cookie.slice(eqIdx + 1).trim());
    }
  }
  return null;
};

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getClientCookie("access_token");
    if (token) {
      const tokenType = getClientCookie("token_type") ?? "Bearer";
      config.headers.Authorization = `${tokenType} ${token}`;
    }
  }

  return config;
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
    if (value === undefined || value === null) continue;
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
