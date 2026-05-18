"use client";

import { useRef, useEffect, useMemo } from "react";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { listProductsClient } from "@/services/api/product.api.client";

const DEFAULT_PAGE_SIZE = 24;

export type ProductsFilterParams = Record<
  string,
  string | number | string[] | undefined
>;

export interface UseInfiniteProductsOptions {
  filterParams: ProductsFilterParams;
  pageSize?: number;
  /** Root margin for IntersectionObserver (e.g. "200px" to load before fully in view). */
  rootMargin?: string;
}

export function useInfiniteProducts({
  filterParams,
  pageSize = DEFAULT_PAGE_SIZE,
  rootMargin = "200px",
}: UseInfiniteProductsOptions) {
  const {
    data: productsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", filterParams],
    queryFn: ({ pageParam }) =>
      listProductsClient({
        ...filterParams,
        offset: pageParam as number,
        limit: pageSize,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === pageSize ? allPages.length * pageSize : undefined,
    placeholderData: keepPreviousData,
  });

  const products = useMemo(
    () => productsData?.pages.flat() ?? [],
    [productsData]
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin, threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin]);

  return {
    products,
    isLoading,
    isFetchingNextPage,
    loadMoreRef,
  };
}
