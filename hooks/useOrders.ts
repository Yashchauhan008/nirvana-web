import { useQuery } from "@tanstack/react-query";

import { getOrder, listOrders } from "@/services/api/order.api";

export const orderKeys = {
  all: ["orders"] as const,
  lists: (offset: number, limit: number) => [...orderKeys.all, "list", offset, limit] as const,
  details: (orderId: string) => [...orderKeys.all, "details", orderId] as const,
};

export function useListOrders(offset = 0, limit = 10) {
  return useQuery({
    queryKey: orderKeys.lists(offset, limit),
    queryFn: () => listOrders({ offset, limit }),
  });
}

export function useGetOrder(orderId: string, enabled = true) {
  return useQuery({
    queryKey: orderKeys.details(orderId),
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId) && enabled,
  });
}
