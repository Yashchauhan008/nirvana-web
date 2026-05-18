import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart } from "@/services/api/cart.api";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useGetCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: getCart,
  });
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: cartKeys.all });
}
