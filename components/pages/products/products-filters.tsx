"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 700;

interface ProductsFiltersProps {
  className?: string;
  onOpenFilters?: () => void;
}

export function ProductsFilters({
  className,
  onOpenFilters,
}: ProductsFiltersProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(searchParams.get("search"));

  const debouncedValue = useDebounce(value, DEBOUNCE_MS);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSearch = params.get("search") ?? null;
    const newSearch =
      debouncedValue !== undefined &&
      debouncedValue !== null &&
      debouncedValue !== ""
        ? String(debouncedValue).trim()
        : null;

    if (currentSearch === newSearch) return;

    if (newSearch !== null) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    const query = params.toString();
    router.replace(query ? `${pathName}?${query}` : pathName, {
      scroll: false,
    });
    // Intentionally omit searchParams to avoid loop: updating URL would change searchParams and re-run this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, pathName, router]);

  return (
    <div className={cn("flex w-full items-stretch gap-2", className)}>
      <div
        className={cn(
          "group/search flex min-w-0 flex-1 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2.5 shadow-sm ring-slate-200/50 transition-all duration-200 focus-within:border-[#0046B7] focus-within:ring-2 focus-within:ring-[#0046B7]/20 focus-within:shadow-md",
        )}
      >
        <Search
          className="size-5 shrink-0 text-slate-400 transition-colors group-focus-within/search:text-[#0046B7]"
          aria-hidden
        />
        <input
          type="search"
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search products by name..."
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
          aria-label="Search products"
          autoComplete="off"
        />
      </div>
      {onOpenFilters && (
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border bg-white p-1.5 lg:hidden"
        >
          <SlidersHorizontal className="size-7" aria-hidden />
          <span className="text-sm font-medium text-slate-700">Filters</span>
        </button>
      )}
    </div>
  );
}
