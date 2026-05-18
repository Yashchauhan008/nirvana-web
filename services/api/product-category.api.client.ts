/**
 * Client-side only API for product categories and filters (uses httpCall for browser).
 * Use from "use client" components.
 */
import httpCall from "../httpCall";
import type {
  ProductCategory,
  CategoryBanner,
  CategoryFilterWithOptions,
  CategoryFilterOption,
} from "./product-category.api";

export type { ProductCategory, CategoryBanner, CategoryFilterWithOptions };

function normalizeFiltersResponse(raw: unknown): CategoryFilterWithOptions[] {
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) list = obj.data;
    else if (Array.isArray(obj.filters)) list = obj.filters;
  }
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const f = item as Record<string, unknown>;
      const rawOptions = f.options ?? f.filter_options;
      const options = Array.isArray(rawOptions)
        ? (rawOptions as CategoryFilterOption[]).map((opt) => ({
            id: String(opt?.id ?? ""),
            category_filter_id: String(opt?.category_filter_id ?? f.id ?? ""),
            value: String(opt?.value ?? ""),
            sort_order:
              typeof opt?.sort_order === "number" ? opt.sort_order : undefined,
          }))
        : [];
      return {
        id: String(f.id ?? ""),
        category_id: String(f.category_id ?? ""),
        name: String(f.name ?? ""),
        slug: f.slug != null ? String(f.slug) : undefined,
        sort_order:
          typeof f.sort_order === "number" ? f.sort_order : undefined,
        options,
      } as CategoryFilterWithOptions;
    })
    .filter(Boolean) as CategoryFilterWithOptions[];
}

export async function listProductCategoriesClient(): Promise<ProductCategory[]> {
  try {
    const data = await httpCall({
      method: "GET",
      url: "/product-categories",
    });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listCategoryBannersClient(): Promise<CategoryBanner[]> {
  try {
    const data = await httpCall({
      method: "GET",
      url: "/product-categories/banners",
    });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getCategoryFiltersClient(
  categoryId: string
): Promise<CategoryFilterWithOptions[]> {
  if (!categoryId?.trim()) return [];
  try {
    const data = await httpCall({
      method: "GET",
      url: `/product-categories/${encodeURIComponent(categoryId)}/filters`,
    });
    return normalizeFiltersResponse(data);
  } catch {
    return [];
  }
}
