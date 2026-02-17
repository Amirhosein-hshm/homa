"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getQueryClient } from "@/lib/query/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="bottom-center" richColors closeButton />
    </QueryClientProvider>
  );
}
