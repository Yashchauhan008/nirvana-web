import httpCall from "../httpCall";
import { setGuestCartToken } from "@/utils/authStorage";


export interface UpdateCartResponse {
  token?: string;
  product_id: string;
}

export interface CartItemImage {
  id: string;
  key: string;
  url: string;
}

export interface CartItem {
  quantity: number;
  product_id: string;
  description: string;
  product_name: string;
  primary_image: CartItemImage;
  sale_price_in_paisa: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export async function getCart(): Promise<CartResponse> {
  const response = await httpCall({
    method: "GET",
    url: "/cart",
  });
  return response as unknown as CartResponse;
}



export async function updateCartItem(
  product_id: string,
  quantity: number
): Promise<UpdateCartResponse> {
  const response = (await httpCall({
    method: "PUT",
    url: `/cart/${product_id}`,
    data: { quantity },
  })) as UpdateCartResponse;

  if (typeof window !== "undefined" && response.token) {
    setGuestCartToken(response.token);
  }
  return response;
}
