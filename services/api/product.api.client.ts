/**
 * Client-side only API for products (uses httpCall for browser).
 * Use from "use client" components.
 */
import httpCall from "../httpCall";
import type { Product } from "./product.api";

export type { Product };

export async function listProductsClient(
  query: Record<string, string | number | string[] | undefined> = {}
): Promise<Product[]> {
  try {
    const data = await httpCall({
      method: "GET",
      url: "/products",
      params: query,
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
