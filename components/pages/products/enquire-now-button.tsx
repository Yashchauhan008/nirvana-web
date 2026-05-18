"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { submitProductInquiry } from "@/services/api/inquiry.api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const productEnquirySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
  quantity: z.union([z.string(), z.number()]).optional(),
});

type ProductEnquiryFormValues = z.infer<typeof productEnquirySchema>;

interface EnquireNowButtonProps {
  productId: string;
  productName?: string;
  className?: string;
  disabled?: boolean;
  hasPendingInquiry?: boolean;
}

export function EnquireNowButton({
  productId,
  productName,
  className,
  disabled,
  hasPendingInquiry,
}: EnquireNowButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();

  const [open, setOpen] = useState(false);
  const [hasSubmittedPending, setHasSubmittedPending] = useState(
    !!hasPendingInquiry,
  );

  const form = useForm<ProductEnquiryFormValues>({
    resolver: zodResolver(productEnquirySchema),
    defaultValues: { message: "", quantity: undefined },
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  // Auto-open dialog if redirected from auth flow with open_enquiry param
  useEffect(() => {
    const shouldAutoOpen = searchParams.get("open_enquiry") === "true";
    if (shouldAutoOpen && isLoggedIn && !hasPendingInquiry && !hasSubmittedPending) {
      setOpen(true);
      // Clean up the URL by removing the open_enquiry param
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("open_enquiry");
      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [
    searchParams,
    isLoggedIn,
    hasPendingInquiry,
    hasSubmittedPending,
    pathname,
    router,
  ]);

  const effectiveHasPending =
    (hasPendingInquiry || hasSubmittedPending) && isLoggedIn;
  const isDisabled = disabled || effectiveHasPending || isSubmitting;
  const buttonLabel =
    effectiveHasPending && productName
      ? `Enquiry pending for ${productName}`
      : effectiveHasPending
        ? "Enquiry pending"
        : "Enquire now";

  async function onSubmit(values: ProductEnquiryFormValues) {
    const rawQuantity = values.quantity;
    let quantity: number | undefined;

    if (typeof rawQuantity === "number") {
      quantity = Number.isNaN(rawQuantity) ? undefined : rawQuantity;
    } else if (typeof rawQuantity === "string" && rawQuantity.trim() !== "") {
      const parsed = Number(rawQuantity);
      quantity = Number.isNaN(parsed) ? undefined : parsed;
    }

    try {
      await submitProductInquiry({
        product_id: productId,
        message: values.message,
        quantity,
      });
      toast.success("Your enquiry has been submitted. We'll get back to you soon.");
      reset();
      setHasSubmittedPending(true);
      setOpen(false);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to submit enquiry. Please try again.";
      toast.error(message);
    }
  }

  const currentUrl = (() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  })();

  const redirectToLogin = () => {
    router.push(`/login?redirect_url=${encodeURIComponent(currentUrl)}`);
  };

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        className={className}
        disabled={disabled}
        aria-label={
          productName ? `Enquire about ${productName}` : "Enquire now"
        }
        onClick={redirectToLogin}
      >
        {productName ? `Enquire about ${productName}` : "Enquire now"}
      </button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isDisabled && setOpen(next)}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={className}
          disabled={isDisabled}
          aria-label={
            productName ? `Enquire about ${productName}` : "Enquire now"
          }
        >
          {buttonLabel}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {productName ? `Enquire about ${productName}` : "Product enquiry"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Field data-invalid={!!errors.message}>
            <FieldLabel htmlFor="enquiry-message">
              <FieldTitle>
                Message <span className="text-destructive">*</span>
              </FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="enquiry-message"
                placeholder="e.g. I'm interested in purchasing 50 units. Can you provide a bulk discount?"
                rows={4}
                aria-invalid={!!errors.message}
                {...register("message")}
              />
              <FieldError errors={errors.message ? [errors.message] : undefined} />
            </FieldContent>
          </Field>
          <Field data-invalid={!!errors.quantity}>
            <FieldLabel htmlFor="enquiry-quantity">
              <FieldTitle>Quantity (optional)</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                id="enquiry-quantity"
                type="number"
                min={1}
                max={1000}
                placeholder="e.g. 50"
                aria-invalid={!!errors.quantity}
                {...register("quantity")}
              />
              <FieldError errors={errors.quantity ? [errors.quantity] : undefined} />
            </FieldContent>
          </Field>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit enquiry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
