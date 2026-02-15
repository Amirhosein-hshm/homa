"use client";

import { useCallback } from "react";
import { toast } from "sonner";


type CopyResult = {
  success: boolean;
  error?: unknown;
};

export function useClipboard() {
  const copy = useCallback(async (value: string): Promise<CopyResult> => {
    try {
      if (!navigator?.clipboard) {
        toast.error(`${value} کپی نمی شود`);
        return { success: false };
      }

      await navigator.clipboard.writeText(value);

      toast.success(`‍${value} کپی شد`);
      return { success: true };
    } catch (error) {
      toast.error("کپی نمی شود");
      return { success: false, error };
    }
  }, []);

  return { copy };
}
