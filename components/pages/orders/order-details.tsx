"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Clock3,
  CreditCard,
  Download,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useGetOrder } from "@/hooks/useOrders";
import { serverDetails } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadOrderReceiptPdf } from "@/lib/order-receipt";

function formatCurrencyFromPaisa(paisa: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format((paisa || 0) / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getLineTotalInPaisa(priceInPaisa: number, quantity: number) {
  return (priceInPaisa || 0) * (quantity || 0);
}

function getAddressText(address: Record<string, unknown>) {
  const parts = [
    address.address,
    address.city,
    address.state_name,
    address.postal_code,
  ].filter((value) => typeof value === "string" && value.trim().length > 0);
  return parts.join(", ");
}

const ORDER_TIMELINE_STEPS = [
  { key: "pending", label: "Pending", icon: Clock3 },
  { key: "processing", label: "Processing", icon: CircleDashed },
  { key: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
  { key: "complete", label: "Complete", icon: CheckCircle2 },
] as const;

function getCurrentTimelineStepIndex(status: string) {
  const normalizedStatus = status?.toLowerCase();
  return ORDER_TIMELINE_STEPS.findIndex((step) => step.key === normalizedStatus);
}

function getOrderStatusBadge(status: string) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "cancel") {
    return {
      label: "Cancelled",
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }
  if (normalizedStatus === "complete") {
    return {
      label: "Complete",
      icon: CheckCircle2,
      className: "border-green-200 bg-green-50 text-green-700",
    };
  }
  if (normalizedStatus === "delivered") {
    return {
      label: "Delivered",
      icon: PackageCheck,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }
  if (normalizedStatus === "out_for_delivery") {
    return {
      label: "Out for delivery",
      icon: Truck,
      className: "border-indigo-200 bg-indigo-50 text-indigo-700",
    };
  }
  if (normalizedStatus === "processing") {
    return {
      label: "Processing",
      icon: CircleDashed,
      className: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }
  return {
    label: "Pending",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
}

function getPaymentStatusBadge(status: string) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "paid") {
    return {
      label: "Paid",
      icon: CheckCircle2,
      className: "border-green-200 bg-green-50 text-green-700",
    };
  }
  if (normalizedStatus === "failed") {
    return {
      label: "Failed",
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }
  if (normalizedStatus === "partially_paid") {
    return {
      label: "Partially paid",
      icon: AlertTriangle,
      className: "border-orange-200 bg-orange-50 text-orange-700",
    };
  }
  return {
    label: "Pending",
    icon: CreditCard,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
}

interface Props {
  orderId: string;
}

export default function OrderDetails({ orderId }: Props) {
  const router = useRouter();
  const { isHydrated, isLoggedIn } = useAuth();
  const { data, isLoading } = useGetOrder(orderId, isHydrated && isLoggedIn);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      const redirectUrl = encodeURIComponent(`/orders/${orderId}`);
      router.replace(`/login?redirect_url=${redirectUrl}`);
    }
  }, [isHydrated, isLoggedIn, orderId, router]);

  if (!isHydrated || !isLoggedIn) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  const order = data?.order;
  if (!order) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <p className="text-sm text-muted-foreground">Order not found.</p>
          <Button asChild>
            <Link href="/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentTimelineStepIndex(order.status);
  const orderBadge = getOrderStatusBadge(order.status);
  const paymentBadge = getPaymentStatusBadge(order.payment_status);
  const OrderStatusIcon = orderBadge.icon;
  const PaymentStatusIcon = paymentBadge.icon;

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Customer Portal
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{order.serial}</h1>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => downloadOrderReceiptPdf(order)}>
              <Download className="mr-2 size-4" />
              Download Receipt
            </Button>
            <Button variant="outline" asChild>
              <Link href="/orders">Back to orders</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-border/70">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${orderBadge.className}`}
              >
                <OrderStatusIcon className="size-3.5" />
                {orderBadge.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${paymentBadge.className}`}
              >
                <PaymentStatusIcon className="size-3.5" />
                {paymentBadge.label}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Paid Amount</p>
                <p className="text-lg font-semibold">{formatCurrencyFromPaisa(order.paid_amount_in_paisa)}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">{formatCurrencyFromPaisa(order.total_amount_in_paisa)}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Due Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrencyFromPaisa(order.total_amount_in_paisa - order.paid_amount_in_paisa)}
                </p>
              </div>
            </div>
            {order.status === "cancel" ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                This order was cancelled.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Order Timeline</p>
                <div className="grid gap-2 sm:grid-cols-5">
                  {ORDER_TIMELINE_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = currentStepIndex >= index;
                    const isCurrent = currentStepIndex === index;
                    return (
                      <div key={step.key} className="space-y-1 rounded-md border p-2">
                        <div
                          className={`h-1.5 rounded-full ${isCompleted ? "bg-primary" : "bg-muted"}`}
                        />
                        <div className="flex items-center gap-1.5">
                          <StepIcon
                            className={`size-3.5 ${
                              isCompleted ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              isCompleted ? "font-medium text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                            {isCurrent ? " (Current)" : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-center"
              >
                {item.primary_image?.key ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border">
                    <Image
                      src={
                        item.primary_image.url ||
                        `${serverDetails.serverProxyURL}/files/${item.primary_image.key}`
                      }
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-border text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {formatCurrencyFromPaisa(item.price_in_paisa)} x {item.quantity}
                  </p>
                  <p className="font-semibold">
                    {formatCurrencyFromPaisa(
                      getLineTotalInPaisa(item.price_in_paisa, item.quantity)
                    )}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {getAddressText(order.billing_address)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {getAddressText(order.shipping_address)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
