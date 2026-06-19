"use client";

import type { ActionResult } from "@/lib/action/wrapper";
import { useState, useTransition } from "react";

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
import { toast } from "sonner";

type ActionFunction<T, P> = (payload: P) => Promise<ActionResult<T>>;

export function useServerAction<T, P>(
  action: ActionFunction<T, P>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    successMessage?: string | null;
  },
) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult<T> | null>(null);

  const execute = (payload: P) => {
    startTransition(() => {
      void (async () => {
        try {
          const res = await action(payload);
          setResult(res);

          if (res.success) {
            if (options?.successMessage !== null) {
              toast.success(options?.successMessage || SUCCESS_MESSAGE_DEFAULT);
            }

            if (res.data) {
              options?.onSuccess?.(res.data);
            }

            return;
          }

          const message =
            getStatusMessage(res.status) ||
            res.error ||
            DEFAULT_ERROR_MESSAGE;

          toast.error(message);
          options?.onError?.(message);
        } catch {
          toast.error(DEFAULT_ERROR_MESSAGE);
          options?.onError?.(DEFAULT_ERROR_MESSAGE);
        }
      })();
    });
  };

  return { execute, isPending, result };
}
