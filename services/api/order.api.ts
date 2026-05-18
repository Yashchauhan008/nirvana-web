import httpCall from "../httpCall";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  ListOrdersRequest,
  ListOrdersResponse,
  VerifyOrderRequest,
  VerifyOrderResponse,
} from "@/types/order.type";

export async function createOrder(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  return (await httpCall({
    method: "POST",
    url: "/orders",
    data,
  })) as CreateOrderResponse;
}

export async function verifyOrder(
  data: VerifyOrderRequest
): Promise<VerifyOrderResponse> {
  return (await httpCall({
    method: "POST",
    url: "/orders/verify",
    data,
  })) as VerifyOrderResponse;
}

export async function listOrders(
  params?: ListOrdersRequest
): Promise<ListOrdersResponse> {
  return (await httpCall({
    method: "GET",
    url: "/orders",
    params,
  })) as ListOrdersResponse;
}

export async function getOrder(orderId: string): Promise<GetOrderResponse> {
  return (await httpCall({
    method: "GET",
    url: `/orders/${orderId}`,
  })) as GetOrderResponse;
}
