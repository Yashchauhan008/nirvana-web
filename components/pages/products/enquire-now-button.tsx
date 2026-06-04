"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitGuestProductInquiry } from "@/services/api/inquiry.api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import "@/styles/product-detail.css";

const productEnquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  phone_number: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit number")),
  message: z.string().trim().min(1, "Message is required").max(1000),
  quantity: z.union([z.string(), z.number()]).optional(),
});

type ProductEnquiryFormValues = z.infer<typeof productEnquirySchema>;

interface EnquireNowButtonProps {
  productId: string;
  productName?: string;
  className?: string;
  disabled?: boolean;
}

const labelClass =
  "mb-1.5 block font-body text-sm font-medium text-[var(--nirvana-deep)]";

const fieldClass =
  "h-10 rounded-lg border-[var(--nirvana-sage)]/40 bg-white font-body text-sm text-[var(--nirvana-deep)] shadow-none placeholder:font-normal placeholder:text-[var(--nirvana-sage)] focus-visible:border-[var(--nirvana-leaf)] focus-visible:ring-1 focus-visible:ring-[var(--nirvana-leaf)]/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function getDefaultValues(authUser: ReturnType<typeof useAuth>["authUser"]) {
  return {
    name: authUser?.full_name?.trim() || "",
    email: authUser?.email?.trim() || "",
    phone_number: authUser?.phone_number?.replace(/\D/g, "") || "",
    message: "",
    quantity: undefined as string | number | undefined,
  };
}

function parseQuantity(rawQuantity: ProductEnquiryFormValues["quantity"]) {
  if (typeof rawQuantity === "number") {
    return Number.isNaN(rawQuantity) ? undefined : rawQuantity;
  }
  if (typeof rawQuantity === "string" && rawQuantity.trim() !== "") {
    const parsed = Number(rawQuantity);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function FieldBlock({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 font-body text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

export function EnquireNowButton({
  productId,
  productName,
  className,
  disabled,
}: EnquireNowButtonProps) {
  const { authUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ProductEnquiryFormValues>({
    resolver: zodResolver(productEnquirySchema),
    defaultValues: getDefaultValues(authUser),
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (open && !showSuccess) {
      reset(getDefaultValues(authUser));
    }
  }, [open, authUser, reset, showSuccess]);

  function handleOpenChange(next: boolean) {
    if (isSubmitting) return;
    if (!next) setShowSuccess(false);
    setOpen(next);
  }

  async function onSubmit(values: ProductEnquiryFormValues) {
    try {
      await submitGuestProductInquiry({
        product_id: productId,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone_number: values.phone_number,
        message: values.message.trim(),
        quantity: parseQuantity(values.quantity),
      });

      reset(getDefaultValues(authUser));
      setShowSuccess(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Something went wrong. Please try again.";
      toast.error(message);
    }
  }

  const isDisabled = disabled || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={className}
          disabled={isDisabled}
          aria-label={
            productName ? `Enquire about ${productName}` : "Enquire now"
          }
        >
          Enquire now
        </button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[120] bg-black/40"
        className={cn(
          "nirvana-enquiry-dialog z-[121] gap-0 rounded-xl border border-[var(--nirvana-sage)]/30 bg-white p-0 shadow-lg sm:max-w-md",
          "[&>button]:top-3.5 [&>button]:right-3.5 [&>button]:opacity-60 [&>button]:hover:opacity-100",
        )}
      >
        {showSuccess ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2
              className="mx-auto mb-4 size-10 text-[var(--nirvana-leaf)]"
              aria-hidden
            />
            <p className="font-display text-xl text-[var(--nirvana-deep)]">
              Enquiry sent
            </p>
            <p className="mt-2 font-body text-sm text-[var(--nirvana-forest)]">
              We&apos;ll be in touch soon.
            </p>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-6 w-full rounded-full nirvana-enquiry-dialog__submit py-3.5 font-body-strong text-sm transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1 border-b border-[var(--nirvana-sage)]/20 px-6 py-5 pr-12 text-left">
              <DialogTitle className="font-display text-xl font-normal capitalize text-[var(--nirvana-deep)]">
                Enquire
              </DialogTitle>
              {productName ? (
                <p className="font-body text-sm text-[var(--nirvana-forest)]">
                  {productName}
                </p>
              ) : null}
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 px-6 py-5"
            >
              <FieldBlock id="enquiry-name" label="Name" error={errors.name?.message}>
                <Input
                  id="enquiry-name"
                  placeholder="Full name"
                  autoComplete="name"
                  className={fieldClass}
                  {...register("name")}
                />
              </FieldBlock>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldBlock
                  id="enquiry-email"
                  label="Email"
                  error={errors.email?.message}
                >
                  <Input
                    id="enquiry-email"
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    className={fieldClass}
                    {...register("email")}
                  />
                </FieldBlock>

                <FieldBlock
                  id="enquiry-phone"
                  label="Phone"
                  error={errors.phone_number?.message}
                >
                  <Input
                    id="enquiry-phone"
                    type="tel"
                    placeholder="10-digit number"
                    autoComplete="tel"
                    className={fieldClass}
                    {...register("phone_number")}
                  />
                </FieldBlock>
              </div>

              <FieldBlock
                id="enquiry-quantity"
                label="Quantity"
                error={errors.quantity?.message}
              >
                <Input
                  id="enquiry-quantity"
                  type="number"
                  min={1}
                  max={1000}
                  placeholder="Optional"
                  className={fieldClass}
                  {...register("quantity")}
                />
              </FieldBlock>

              <FieldBlock
                id="enquiry-message"
                label="Message"
                error={errors.message?.message}
              >
                <Textarea
                  id="enquiry-message"
                  placeholder="Your message"
                  rows={3}
                  className={cn(
                    fieldClass,
                    "min-h-[88px] resize-none py-2.5 leading-relaxed",
                  )}
                  {...register("message")}
                />
              </FieldBlock>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[var(--nirvana-sage)]/50 bg-white font-body-strong text-sm text-[var(--nirvana-deep)] transition-colors hover:border-[var(--nirvana-leaf)] hover:bg-[var(--nirvana-mist)] disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="nirvana-enquiry-dialog__submit inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border font-body-strong text-sm transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    "Send enquiry"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
