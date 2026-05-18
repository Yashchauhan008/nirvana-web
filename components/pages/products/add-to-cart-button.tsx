"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateCartItem } from "@/services/api/cart.api";
import { useInvalidateCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const invalidateCart = useInvalidateCart();

  async function handleAddToCart() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await updateCartItem(productId, quantity);
      invalidateCart();
      toast.success(`Added ${productName} to cart`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isLoading}
      className={className}
      aria-label={`Add ${productName} to cart`}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          Adding…
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <ShoppingCart className="size-4" />
          Add to cart
        </span>
      )}
    </button>
  );
}
