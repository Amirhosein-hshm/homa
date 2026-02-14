import {
  defaultShouldDehydrateQuery,
  QueryClient,
  type QueryClientConfig,
} from "@tanstack/react-query";

const MINUTE_MS = 60_000;

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: MINUTE_MS,
      gcTime: 5 * MINUTE_MS,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
    dehydrate: {
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
  },
};

export function makeQueryClient() {
  return new QueryClient(queryClientConfig);
}
