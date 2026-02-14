import {
  dehydrate,
  type DehydratedState,
  type QueryClient,
} from "@tanstack/react-query";
import { makeQueryClient } from "./query-client";

type Prefetcher = (queryClient: QueryClient) => Promise<unknown>;

export async function prefetchQueries(prefetchers: Prefetcher[]) {
  const queryClient = makeQueryClient();

  await Promise.all(prefetchers.map((prefetch) => prefetch(queryClient)));

  return dehydrate(queryClient);
}

export type { DehydratedState };
