import Link from "next/link";
import type { ProductCategory } from "@/services/api/product-category.api";
import { cn } from "@/lib/utils";

interface ProductCategorySidebarProps {
  categories: ProductCategory[];
  currentCategoryId: string | undefined;
  search: string | undefined;
  limit: number;
}

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

export function ProductCategorySidebar({
  categories,
  currentCategoryId,
  search,
  limit,
}: ProductCategorySidebarProps) {
  const allUrl = buildCategoryUrl({ search, limit });

  return (
    <div
      className="w-full shrink-0 lg:w-64 lg:sticky lg:top-24 lg:self-start"
      aria-label="Filter by category"
    >
      {/* Desktop: sticky vertical sidebar (category filter on mobile is in search row) */}
      <aside className="hidden lg:block">
        <div className="flex max-h-none flex-col rounded-xl border border-border/60 bg-white p-4 lg:max-h-[calc(100vh-7rem)]">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Categories
          </h2>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto pr-1 scrollbar-hide">
            <Link
              href={allUrl}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                !currentCategoryId
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              All categories
            </Link>
            {categories.map((cat) => {
              const isActive = currentCategoryId === cat.id;
              const url = buildCategoryUrl({
                categoryId: cat.id,
                search,
                limit,
              });
              return (
                <Link
                  key={cat.id}
                  href={url}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}
