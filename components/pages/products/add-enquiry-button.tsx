"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";
import { submitGuestProductInquiry } from "@/services/api/inquiry.api";
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

/** Matches backend: name 1-255, message 1-1000, phone 10 digits, quantity optional 1-1000 */
const guestEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  phone_number: z
    .string()
    .trim()
    .transform((s) => s.replace(/\D/g, ""))
    .pipe(z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits")),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be less than 1000 characters")
    .optional(),
  quantity: z.union([
    z.string(),
    z.number().int().min(1).max(1000),
  ]).optional(),
});

type GuestEnquiryFormValues = z.infer<typeof guestEnquirySchema>;

interface AddEnquiryButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

export function AddEnquiryButton({
  productId,
  productName,
  className,
}: AddEnquiryButtonProps) {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<GuestEnquiryFormValues>({
    resolver: zodResolver(guestEnquirySchema),
    defaultValues: {
      name: "",
      phone_number: "",
      message: "",
      quantity: undefined,
    },
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: GuestEnquiryFormValues) {
    const rawQuantity = values.quantity;
    let quantity: number | undefined;
    if (typeof rawQuantity === "number") {
      quantity = Number.isNaN(rawQuantity) ? undefined : rawQuantity;
    } else if (typeof rawQuantity === "string" && rawQuantity.trim() !== "") {
      const parsed = Number(rawQuantity);
      quantity = Number.isNaN(parsed) ? undefined : parsed;
    }

    try {
      await submitGuestProductInquiry({
        product_id: productId,
        name: values.name,
        phone_number: values.phone_number,
        message: values.message?.trim() ?? "",
        quantity,
      });
      reset();
      setShowSuccess(true);
    } catch {
      toast.error("Failed to submit enquiry. Please try again.");
    }
  }

  function handleClose(open: boolean) {
    if (!open) setShowSuccess(false);
    setOpen(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={className}
          aria-label={`Enquire about ${productName}`}
        >
          Add Enquiry
        </button>
      </DialogTrigger>
      <DialogContent>
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
              <CheckCircle2 className="size-8" aria-hidden />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Message sent successfully
              </h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll connect with you in the next 24 hours.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => handleClose(false)}
              className="mt-2"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Enquire about {productName}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="guest-enquiry-name">
              <FieldTitle>
                Name <span className="text-destructive">*</span>
              </FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                id="guest-enquiry-name"
                placeholder="Your name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </FieldContent>
          </Field>
          <Field data-invalid={!!errors.phone_number}>
            <FieldLabel htmlFor="guest-enquiry-phone">
              <FieldTitle>
                Phone Number <span className="text-destructive">*</span>
              </FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                id="guest-enquiry-phone"
                type="tel"
                placeholder="10 digits, e.g. 9876543210"
                aria-invalid={!!errors.phone_number}
                {...register("phone_number")}
              />
              <FieldError
                errors={errors.phone_number ? [errors.phone_number] : undefined}
              />
            </FieldContent>
          </Field>
          <Field data-invalid={!!errors.message}>
            <FieldLabel htmlFor="guest-enquiry-message">
              <FieldTitle>Message (optional)</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="guest-enquiry-message"
                placeholder="Write your message..."
                rows={4}
                aria-invalid={!!errors.message}
                {...register("message")}
              />
              <FieldError errors={errors.message ? [errors.message] : undefined} />
            </FieldContent>
          </Field>
          <Field data-invalid={!!errors.quantity}>
            <FieldLabel htmlFor="guest-enquiry-quantity">
              <FieldTitle>Quantity (optional)</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                id="guest-enquiry-quantity"
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
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
