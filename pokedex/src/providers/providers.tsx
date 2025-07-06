import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const FIVE_MIN_REFRESH_RATE = 5 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MIN_REFRESH_RATE,
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
