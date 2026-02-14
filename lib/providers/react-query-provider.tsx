"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "@/lib/query/get-query-client";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const client = getQueryClient();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
