"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useGetCart, useInvalidateCart } from "@/hooks/useCart";
import { updateCartItem } from "@/services/api/cart.api";
import { DeliveryChargesNotice } from "@/components/shared/delivery-charges-notice";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { data: cart, isLoading } = useGetCart();
  const invalidateCart = useInvalidateCart();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const handleUpdateQuantity = async (productId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 0) return;

    setUpdatingItemId(productId);
    try {
      await updateCartItem(productId, newQty);
      invalidateCart();
      if (newQty === 0) {
        toast.success("Item removed from bag");
      } else {
        toast.success("Bag updated");
      }
    } catch {
      toast.error("Failed to update bag");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItemId(productId);
    try {
      await updateCartItem(productId, 0);
      invalidateCart();
      toast.success("Item removed from bag");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const formatPrice = (paisa: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(paisa / 100);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--nirvana-cream)] pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--nirvana-leaf)]" />
        <p className="mt-4 font-body text-[var(--nirvana-sage)] text-sm tracking-widest uppercase">
          Loading your bag...
        </p>
      </main>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <main className="min-h-screen bg-[var(--nirvana-cream)] pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-6 rounded-full bg-[var(--nirvana-sage)]/10 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-[var(--nirvana-leaf)] animate-pulse" />
        </div>
        <span className="font-body-strong text-xs uppercase tracking-[0.3em] text-[var(--nirvana-leaf)] mb-2">
          Your Bag
        </span>
        <h1 className="font-display text-4xl text-[var(--nirvana-deep)] mb-4">
          It is completely empty
        </h1>
        <p className="font-body text-base text-[var(--nirvana-sage)] max-w-sm mb-10">
          Discover our weightless acetate frames and hand-crafted optical collection.
        </p>
        <Link
          href="/products"
          className="bg-[var(--nirvana-forest)] text-[var(--nirvana-cream)] px-8 py-4 rounded-full font-body-strong uppercase tracking-widest text-sm hover:bg-[var(--nirvana-deep)] transition-all transform hover:scale-[1.02] shadow-[0_10px_25px_rgba(42,69,56,0.15)]"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  // Calculate subtotal in paisa
  const subtotalPaisa = items.reduce((sum, item) => sum + item.quantity * item.sale_price_in_paisa, 0);

  return (
    <main className="min-h-screen bg-[var(--nirvana-cream)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            <span className="font-body-strong text-xs uppercase tracking-[0.3em] text-[var(--nirvana-leaf)]">
              Checkout Process
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-[var(--nirvana-deep)] mt-3">
              Your Shopping Bag
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => {
                const isUpdating = updatingItemId === item.product_id;
                const imageUrl = item.primary_image?.url ?? "/images/models/model3.png";

                return (
                  <div
                    key={item.product_id}
                    className="group relative flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-white/40 border border-white/60 shadow-[0_15px_30px_rgba(42,69,56,0.02)] hover:shadow-[0_20px_40px_rgba(42,69,56,0.06)] transition-all duration-300"
                  >
                    {/* Item Image */}
                    <div className="relative w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-white/60 border border-white flex items-center justify-center p-2 shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.product_name}
                        fill
                        className="object-contain p-2"
                        unoptimized={imageUrl.startsWith("http://")}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="font-display text-2xl text-[var(--nirvana-deep)] group-hover:text-[var(--nirvana-leaf)] transition-colors">
                            {item.product_name}
                          </h3>
                          <p className="font-body-strong text-lg text-[var(--nirvana-deep)] whitespace-nowrap">
                            {formatPrice(item.sale_price_in_paisa * item.quantity)}
                          </p>
                        </div>
                        <p className="font-body text-xs text-[var(--nirvana-sage)] mb-4 line-clamp-1">
                          {item.description || "Hand-polished Acetate · Signature Series"}
                        </p>
                      </div>

                      {/* Quantity controls and remove */}
                      <div className="flex justify-between items-center gap-4 mt-auto">
                        <div className="flex items-center gap-1.5 bg-white/60 rounded-full p-1 border border-white/80">
                          <button
                            type="button"
                            disabled={isUpdating || item.quantity <= 1}
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity, -1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--nirvana-cream)] text-[var(--nirvana-forest)] disabled:opacity-30 transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-body text-sm text-[var(--nirvana-deep)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity, 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--nirvana-cream)] text-[var(--nirvana-forest)] transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="text-xs font-body-strong uppercase tracking-wider text-[var(--nirvana-leaf)] hover:text-red-500 flex items-center gap-1.5 transition-colors disabled:opacity-40"
                          aria-label={`Remove ${item.product_name} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Blocking Loader Overlay while updating */}
                    {isUpdating && (
                      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] rounded-3xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--nirvana-leaf)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Checkout / Summary Panel */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="rounded-3xl border border-white/80 bg-white/30 p-8 shadow-[0_20px_40px_rgba(42,69,56,0.02)] backdrop-blur-md">
                <h2 className="font-display text-3xl text-[var(--nirvana-deep)] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 font-body text-sm text-[var(--nirvana-deep)] mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--nirvana-sage)]">Subtotal</span>
                    <span className="font-body-strong">{formatPrice(subtotalPaisa)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--nirvana-sage)]">Shipping</span>
                    <span className="font-body-strong text-green-600">Complimentary</span>
                  </div>
                  <div className="h-px bg-[var(--nirvana-forest)]/10 my-4" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-body-strong text-base">Estimated Total</span>
                    <span className="font-display text-2xl text-[var(--nirvana-deep)]">
                      {formatPrice(subtotalPaisa)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full bg-[var(--nirvana-forest)] text-[var(--nirvana-cream)] py-4 rounded-full font-body-strong uppercase tracking-widest text-sm hover:bg-[var(--nirvana-deep)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] shadow-[0_15px_30px_rgba(42,69,56,0.15)] mb-6"
                >
                  <span>Proceed to checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Delivery charges note */}
                <DeliveryChargesNotice compact />
              </div>

              {/* Extra assurance badge info */}
              <div className="px-4 py-2 border-t border-[var(--nirvana-forest)]/10 text-center font-body text-xs text-[var(--nirvana-sage)] space-y-2">
                <p>— Complimentary express shipping & tracking</p>
                <p>— Includes custom fitting kit & adjustment case</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
