export type PaymentMode = "full" | "token";

export interface CreateOrderRequest {
  payment_mode: PaymentMode;
  promo_code?: string;
  full_name: string;
  phone_number: string;
  organization_name?: string;
  gst_number?: string;
  pan_number?: string;
  shipping_address: string;
  shipping_state_id: string;
  shipping_city: string;
  shipping_postal_code: string;
  billing_address: string;
  billing_state_id: string;
  billing_city: string;
  billing_postal_code: string;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface CreateOrderResponse {
  order: {
    id: string;
    serial: string;
    total_amount_in_paisa: number;
  };
  payment: RazorpayOrderResponse | null;
  payment_summary: {
    payment_mode: PaymentMode;
    total_amount_in_paisa: number;
    payable_amount_in_paisa: number;
    remaining_amount_in_paisa: number;
  };
  razorpay_key_id: string | null;
}

export interface VerifyOrderRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyOrderResponse {
  order: {
    id: string;
    serial: string;
    payment_status: string;
    status: string;
    total_amount_in_paisa: number;
    paid_amount_in_paisa: number;
    is_paid: boolean;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
  };
}

export interface OrderListItem {
  id: string;
  serial: string;
  payment_status: string;
  status: string;
  total_amount_in_paisa: number;
  paid_amount_in_paisa: number;
  is_paid: boolean;
  created_at: string;
  total_item_count: number;
}

export interface ListOrdersRequest {
  offset?: number;
  limit?: number;
}

export interface ListOrdersResponse {
  orders: OrderListItem[];
  meta: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface OrderDetailsItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_in_paisa: number;
  description: string | null;
  primary_image: {
    id: string;
    key: string;
    url: string;
  } | null;
}

export interface OrderDetails {
  id: string;
  serial: string;
  payment_status: string;
  status: string;
  total_amount_in_paisa: number;
  paid_amount_in_paisa: number;
  is_paid: boolean;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
  billing_details: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  shipping_address: Record<string, unknown>;
  items: OrderDetailsItem[];
}

export interface GetOrderResponse {
  order: OrderDetails;
}
