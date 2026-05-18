"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  ProductCategory,
  CategoryFilterWithOptions,
} from "@/services/api/product-category.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";

const ALL_CATEGORIES_VALUE = "__all__";

interface CategoryFiltersSidebarProps {
  categories: ProductCategory[];
  currentCategoryId: string | undefined;
  categoryFilters: CategoryFilterWithOptions[];
  selectedOptionIds: string[];
  /** When true (e.g. inside bottom sheet), use full height and no sticky so parent controls scroll */
  embedded?: boolean;
  /** Optional callback after applying embedded filters (e.g. close mobile sheet) */
  onApplyFilters?: () => void;
}

export function CategoryFiltersSidebar({
  categories,
  currentCategoryId,
  categoryFilters,
  selectedOptionIds,
  embedded = false,
  onApplyFilters,
}: CategoryFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const categoryValue = currentCategoryId ?? ALL_CATEGORIES_VALUE;

  const [pendingOptionIds, setPendingOptionIds] = useState(selectedOptionIds);

  useEffect(() => {
    if (embedded) {
      setPendingOptionIds(selectedOptionIds);
    }
  }, [embedded, selectedOptionIds]);

  const activeOptionIds = embedded ? pendingOptionIds : selectedOptionIds;
  const hasActiveFilters = activeOptionIds.length > 0;
  const hasPendingChanges = useMemo(() => {
    if (!embedded) return false;
    if (pendingOptionIds.length !== selectedOptionIds.length) return true;

    const selectedSet = new Set(selectedOptionIds);
    return pendingOptionIds.some((id) => !selectedSet.has(id));
  }, [embedded, pendingOptionIds, selectedOptionIds]);

  function clearFilters() {
    if (embedded) {
      setPendingOptionIds([]);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("option_ids");
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  }

  const onCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL_CATEGORIES_VALUE) {
      params.delete("category_id");
    } else {
      params.set("category_id", value);
    }
    params.delete("option_ids");
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  };

  function onOptionClick(optionId: string) {
    if (embedded) {
      setPendingOptionIds((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const optionIdsParams = params.getAll("option_ids");
    const optionIds = optionIdsParams.length ? optionIdsParams : [];

    if (optionIds.includes(optionId)) {
      params.delete("option_ids");
      optionIds
        .filter((id) => id !== optionId)
        .forEach((id) => params.append("option_ids", id));
    } else {
      params.append("option_ids", optionId);
    }
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  }

  function applyEmbeddedFilters() {
    if (!embedded) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("option_ids");
    pendingOptionIds.forEach((id) => params.append("option_ids", id));
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    onApplyFilters?.();
  }

  return (
    <div
      className={cn(
        "w-full shrink-0",
        !embedded && "lg:w-72 xl:w-80 lg:sticky lg:top-24 lg:self-start",
      )}
      aria-label="Category and filters"
    >
      <aside className="overflow-hidden rounded-md border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div
          className={cn(
            "flex flex-col",
            embedded
              ? "max-h-full overflow-y-auto"
              : "max-h-[85vh] overflow-y-auto lg:max-h-[calc(100vh-7rem)]",
          )}
        >
          {/* Category section */}
          <section
            aria-label="Category filter"
            className="border-b border-slate-100 bg-slate-50/80 px-4 py-4"
          >
            <div className="mb-2.5 flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </h3>
            </div>
            <Select value={categoryValue} onValueChange={onCategoryChange}>
              <SelectTrigger
                aria-label="Select category"
                className="h-11 w-full border-slate-200 bg-white shadow-xs transition-colors hover:border-slate-300 focus:ring-2 focus:ring-[#0046B7]/20"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent align="start" className="max-h-[min(70vh,20rem)]">
                <SelectItem value={ALL_CATEGORIES_VALUE}>
                  All categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* Filters section */}
          {currentCategoryId && (
            <section aria-label="Filters" className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <SlidersHorizontal className="size-4" aria-hidden />
                  </span>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <span className="rounded-full bg-[#0046B7] px-2 py-0.5 text-[10px] font-medium text-white">
                      {activeOptionIds.length}
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-md font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="size-5" />
                    Clear
                  </button>
                )}
              </div>

              {categoryFilters.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-sm text-slate-500">
                  No filters for this category.
                </p>
              ) : (
                <div className="flex flex-col py-4 gap-4">
                  {categoryFilters.map((filter) => (
                    <div key={filter.id} className="">
                      <h3 className="mb-2.5 uppercase text-sm font-semibold text-slate-800">
                        {filter.name}
                      </h3>
                      <ul className="flex flex-col gap-0.5">
                        {filter.options.map((option) => {
                          const isSelected = activeOptionIds.includes(option.id);

                          return (
                            <li key={option.id}>
                              <button
                                type="button"
                                onClick={() => onOptionClick(option.id)}
                                className={cn(
                                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                                  isSelected
                                    ? "text-[#0046B7]"
                                    : "text-slate-700 hover:bg-slate-100/80",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors",
                                    isSelected
                                      ? "border-[#0046B7] bg-[#0046B7] text-white"
                                      : "border-slate-300 bg-white",
                                  )}
                                  aria-hidden
                                >
                                  {isSelected ? (
                                    <svg
                                      className="size-3"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  ) : null}
                                </span>
                                <span className="font-medium">
                                  {option.value}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {embedded && currentCategoryId && (
            <div className="sticky bottom-0 border-t border-slate-100 bg-white p-4">
              <button
                type="button"
                onClick={applyEmbeddedFilters}
                disabled={!hasPendingChanges}
                className="h-11 w-full rounded-md bg-[#0046B7] px-4 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply filters
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
