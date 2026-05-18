import serverHttpCall from "../serverHttpCall";

export interface ProductImageRef {
  id: string;
  key: string;
  url: string;
}

export interface ProductImage {
  image: ProductImageRef;
  image_id: string;
  is_primary: boolean;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  description: string;
}

export interface ProductTechnicalDetail {
  label: string;
  value: string;
}

/** Attribute/spec from category filters, shown on product detail (label = filter_name, value = selected option) */
export interface ProductFilterOption {
  filter_option_id: string;
  filter_id: string;
  filter_name: string;
  value: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  tags: string[];
  metadata: Record<string, unknown>;
  sale_price_in_paisa: number;
  sale_price_in_rupee: number;
  sale_price?: number;
  created_at: string;
  updated_at: string;
  points: string[];
  technical_details?: ProductTechnicalDetail[];
  category: ProductCategoryRef;
  primary_image: ProductImageRef;
  images: ProductImage[];
  has_pending_inquiry?: boolean;
  pending_inquiry_id?: string | null;
  product_label?: string | null;
  warranty_label?: string | null;
  is_featured?: boolean;
  filter_option_ids?: string[];
  filter_options?: ProductFilterOption[];
}

export const listProducts = async (query: object = {}): Promise<Product[]> => {
  try {
    const data = await serverHttpCall({
      url: "/products",
      method: "GET",
      params: query,
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const listFeaturedProducts = async (
  query: { limit?: number; offset?: number } = {},
): Promise<Product[]> => {
  try {
    const data = await serverHttpCall({
      url: "/products/featured",
      method: "GET",
      params: query,
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const data = await serverHttpCall({
      url: `/products/${id}`,
      method: "GET",
    });
    return data && typeof data === "object" && "id" in data
      ? ((data as unknown) as Product)
      : null;
  } catch {
    return null;
  }
};
