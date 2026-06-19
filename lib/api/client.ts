import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

const DEFAULT_ERROR_MESSAGE = "خطای غیرمنتظره‌ای رخ داد.";
const SUCCESS_MESSAGE_DEFAULT = "عملیات با موفقیت انجام شد.";

const getStatusMessage = (status?: number): string | undefined => {
  if (typeof status !== "number") return undefined;
  if (status === 200) return "عملیات با موفقیت انجام شد.";
  if (status === 201) return "با موفقیت ایجاد شد.";
  if (status === 204) return "با موفقیت حذف شد.";
  if (status >= 200 && status < 300) return SUCCESS_MESSAGE_DEFAULT;
  if (status === 400) return "درخواست نامعتبر است.";
  if (status === 401) return "ابتدا وارد حساب کاربری شوید.";
  if (status === 403) return "دسترسی غیرمجاز.";
  if (status === 404) return "یافت نشد.";
  if (status === 409) return "تداخل در اطلاعات.";
  if (status === 422) return "خطای اعتبارسنجی مقادیر.";
  if (status === 429) return "تعداد درخواست‌ها بیش از حد مجاز است.";
  if (status === 500) return "خطای سرور. کمی بعد تلاش کنید.";
  if (status === 503) return "سرویس موقتاً در دسترس نیست.";
  if (status >= 400 && status < 500) return "درخواست قابل پردازش نیست.";
  if (status >= 500 && status < 600) return "خطای سرور. کمی بعد تلاش کنید.";
  return undefined;
};

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
const SUCCESS_INTERCEPTOR_KEY = "__home_web_axios_success_interceptor__";
type AxiosToastWindow = Window & {
  __home_web_axios_toast_interceptor__?: boolean;
  __home_web_axios_success_interceptor__?: boolean;
};

const showClientErrorToast = (message: string) => {
  if (typeof window === "undefined") {
    return;
  }

  void import("sonner").then(({ toast }) => {
    toast.error(message);
  });
};

const showClientSuccessToast = (message: string) => {
  if (typeof window === "undefined") {
    return;
  }

  void import("sonner").then(({ toast }) => {
    toast.success(message);
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
        if (!originalRequest) {
          return Promise.reject(error);
        }
        if (
          (originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })
            ._retry
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve: resolve as (value: unknown) => void, reject });
          })
            .then(() => instance(originalRequest))
            .catch((queueError) => Promise.reject(queueError));
        }

        (
          originalRequest as InternalAxiosRequestConfig & { _retry?: boolean }
        )._retry = true;
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
        if (isAxiosError(error) && error.response?.status === 401) {
          return Promise.reject(error);
        }

        if (
          isAxiosError(error) &&
          error.config &&
          (error.config as InternalAxiosRequestConfig & { _retry?: boolean })
            ._retry
        ) {
          return Promise.reject(error);
        }

        const message = extractErrorMessage(error);
        showClientErrorToast(message);
        return Promise.reject(error);
      },
    );

    browserWindow[TOAST_INTERCEPTOR_KEY] = true;
  }

  if (!browserWindow[SUCCESS_INTERCEPTOR_KEY]) {
    instance.interceptors.response.use(
      (response) => {
        const method = response.config?.method?.toUpperCase();
        if (["POST", "PUT", "PATCH", "DELETE"].includes(method ?? "")) {
          const data = response.data as Record<string, unknown> | undefined;
          const message =
            (data?.message as string | undefined) ||
            getStatusMessage(response.status) ||
            SUCCESS_MESSAGE_DEFAULT;
          showClientSuccessToast(message);
        }
        return response;
      },
      (error) => Promise.reject(error),
    );

    browserWindow[SUCCESS_INTERCEPTOR_KEY] = true;
  }
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
