"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Clock3,
  CreditCard,
  PackageCheck,
  PackageSearch,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useListOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const PAGE_LIMIT = 10;
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

export default function OrdersList() {
  const router = useRouter();
  const { isHydrated, isLoggedIn } = useAuth();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      const redirectUrl = encodeURIComponent("/orders");
      router.replace(`/login?redirect_url=${redirectUrl}`);
    }
  }, [isHydrated, isLoggedIn, router]);

  const offset = useMemo(() => (page - 1) * PAGE_LIMIT, [page]);

  const { data, isLoading, isFetching } = useListOrders(offset, PAGE_LIMIT);

  if (!isHydrated || !isLoggedIn) return null;

  const orders = data?.orders ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Customer Portal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track all your previous purchases and payment status.
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Loading orders...
            </CardContent>
          </Card>
        ) : orders.length ? (
          <div className="space-y-3">
            {orders.map((order) => {
              const currentStepIndex = getCurrentTimelineStepIndex(order.status);
              const orderBadge = getOrderStatusBadge(order.status);
              const paymentBadge = getPaymentStatusBadge(order.payment_status);
              const OrderStatusIcon = orderBadge.icon;
              const PaymentStatusIcon = paymentBadge.icon;
              return (
                <Card
                  key={order.id}
                  className="overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                    <span className="font-semibold tracking-tight text-foreground">{order.serial}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatDate(order.created_at)}
                    </span>
                  </CardTitle>
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
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Items</p>
                      <p className="text-lg font-semibold text-foreground">{order.total_item_count}</p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Paid</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrencyFromPaisa(order.paid_amount_in_paisa)}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrencyFromPaisa(order.total_amount_in_paisa)}
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
                                className={`h-1.5 rounded-full ${
                                  isCompleted ? "bg-primary" : "bg-muted"
                                }`}
                              />
                              <div className="flex items-center gap-1.5">
                                <StepIcon
                                  className={`size-3.5 ${
                                    isCompleted ? "text-primary" : "text-muted-foreground"
                                  }`}
                                />
                                <p
                                  className={`text-xs ${
                                    isCompleted
                                      ? "font-medium text-foreground"
                                      : "text-muted-foreground"
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
                  <div className="flex justify-end">
                    <Button asChild>
                      <Link href={`/orders/${order.id}`}>View details</Link>
                    </Button>
                  </div>
                </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <PackageSearch className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">You have not placed any orders yet.</p>
              <Button asChild>
                <Link href="/products">Browse products</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
