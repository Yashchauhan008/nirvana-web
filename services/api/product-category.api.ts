import serverHttpCall from "../serverHttpCall";

export interface ProductCategoryImage {
  id: string;
  key: string;
  url: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image_id: string;
  image: ProductCategoryImage;
}

export interface CategoryBanner {
  id: string;
  name: string;
  description: string;
  banner_image_id: string;
  banner_image: ProductCategoryImage;
}

export const listProductCategories = async (): Promise<ProductCategory[]> => {
  try {
    const data = await serverHttpCall({
      url: "/product-categories",
      method: "GET",
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[listProductCategories] failed:", err);
    }
    return [];
  }
};

export const listCategoryBanners = async (): Promise<CategoryBanner[]> => {
  try {
    const data = await serverHttpCall({
      url: "/product-categories/banners",
      method: "GET",
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[listCategoryBanners] failed:", err);
    }
    return [];
  }
};

/** Filter option (attribute value) for a category filter, e.g. "Samsung", "32 inch" */
export interface CategoryFilterOption {
  id: string;
  category_filter_id: string;
  value: string;
  sort_order?: number;
}

/** Category filter (attribute type) with its options, e.g. "Brand" with options ["Samsung", "LG"] */
export interface CategoryFilterWithOptions {
  id: string;
  category_id: string;
  name: string;
  slug?: string;
  sort_order?: number;
  options: CategoryFilterOption[];
}

/**
 * Normalize API response to an array of filters. Handles:
 * - Direct array
 * - Wrapped in { data: [...] } or { filters: [...] }
 */
function normalizeFiltersResponse(
  raw: unknown,
): CategoryFilterWithOptions[] {
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) list = obj.data;
    else if (Array.isArray(obj.filters)) list = obj.filters;
  }
  return list.map((item) => {
    if (!item || typeof item !== "object") return null;
    const f = item as Record<string, unknown>;
    const rawOptions = f.options ?? f.filter_options;
    const options = Array.isArray(rawOptions)
      ? (rawOptions as CategoryFilterOption[]).map((opt) => ({
          id: String(opt?.id ?? ""),
          category_filter_id: String(opt?.category_filter_id ?? f.id ?? ""),
          value: String(opt?.value ?? ""),
          sort_order: typeof opt?.sort_order === "number" ? opt.sort_order : undefined,
        }))
      : [];
    return {
      id: String(f.id ?? ""),
      category_id: String(f.category_id ?? ""),
      name: String(f.name ?? ""),
      slug: f.slug != null ? String(f.slug) : undefined,
      sort_order: typeof f.sort_order === "number" ? f.sort_order : undefined,
      options,
    } as CategoryFilterWithOptions;
  }).filter(Boolean) as CategoryFilterWithOptions[];
}

/**
 * Fetch filters and their options for a category (for left sidebar).
 * Backend: GET /e-commerce/product-categories/:category_id/filters
 * or GET /product-categories/:category_id/filters depending on server config.
 */
export const getCategoryFilters = async (
  categoryId: string,
): Promise<CategoryFilterWithOptions[]> => {
  if (!categoryId?.trim()) return [];
  try {
    const data = await serverHttpCall({
      url: `/product-categories/${encodeURIComponent(categoryId)}/filters`,
      method: "GET",
    });
    return normalizeFiltersResponse(data);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getCategoryFilters] failed for category", categoryId, err);
    }
    return [];
  }
};