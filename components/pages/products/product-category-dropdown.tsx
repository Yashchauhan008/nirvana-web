"use client";

import { useRouter } from "next/navigation";
import type { ProductCategory } from "@/services/api/product-category.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "__all__";

function buildCategoryUrl(params: {
  categoryId?: string;
  search?: string;
  limit: number;
}): string {
  const q: Record<string, string> = { limit: String(params.limit) };
  if (params.categoryId) q.category_id = params.categoryId;
  if (params.search) q.search = params.search;
  return `/products?${new URLSearchParams(q).toString()}`;
}

interface ProductCategoryDropdownProps {
  categories: ProductCategory[];
  currentCategoryId: string | undefined;
  search: string | undefined;
  limit: number;
}

export function ProductCategoryDropdown({
  categories,
  currentCategoryId,
  search,
  limit,
}: ProductCategoryDropdownProps) {
  const router = useRouter();
  const value = currentCategoryId ?? ALL_VALUE;

  const onValueChange = (next: string) => {
    const categoryId = next === ALL_VALUE ? undefined : next;
    const url = buildCategoryUrl({ categoryId, search, limit });
    router.push(url);
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label="Filter by category"
        className="w-full border-border/60 bg-white shadow-sm lg:hidden"
      >
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent align="start" className="max-h-[min(70vh,20rem)]">
        <SelectItem value={ALL_VALUE}>All categories</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
