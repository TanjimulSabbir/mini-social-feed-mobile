// lib/query-client.ts
import { pushModal } from "@/hooks/modal";
import { getErrorMessage, getErrorStatusCode } from "@/utils/error.utils";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        pushModal(getErrorMessage(error), getErrorStatusCode(error));
      },
    },
  },
});