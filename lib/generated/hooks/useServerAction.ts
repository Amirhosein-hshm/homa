"use client";

import type { ActionResult } from "@/lib/action/wrapper";
import {
  DEFAULT_ERROR_MESSAGE,
  SUCCESS_MESSAGE_DEFAULT,
  getStatusMessage,
} from "@/lib/constants/message";
import { useState, useTransition } from "react";
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
