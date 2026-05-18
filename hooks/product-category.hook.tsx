import { useQuery } from "@tanstack/react-query";
import httpCall from "@/services/httpCall";
import type { ProductCategory } from "@/services/api/product-category.api";

export const useListProductCategories = () => {
  return useQuery<ProductCategory[]>({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await httpCall({
        method: "GET",
        url: "/product-categories",
      });
      return Array.isArray(response) ? (response as ProductCategory[]) : [];
    },
  });
};
