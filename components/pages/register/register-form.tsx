"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { registerCustomer } from "@/services/api/customers.api";
import type { RegisterCustomerRequest } from "@/types/customer.type";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const ValidationSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: z
    .string()
    .trim()
    .regex(INDIAN_MOBILE_REGEX, "Enter a valid 10-digit Indian mobile number"),
});

const defaultValues: z.infer<typeof ValidationSchema> = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone_number: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectUrl = searchParams.get("redirect_url");
  const redirectUrl = rawRedirectUrl
    ? decodeURIComponent(rawRedirectUrl)
    : null;

  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: register,
    isPending: submitting,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: RegisterCustomerRequest) => registerCustomer(data),
    onSuccess: (data) => {
      const nextUrl =
        redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/";
      const query = new URLSearchParams({ token: data.token });
      if (nextUrl) {
        query.set("redirect_url", nextUrl);
      }
      router.push(`/verify-email?${query.toString()}`);
      toast.success("Account created! Verify your email to finish signing in.");
    },
  });

  const form = useForm<z.infer<typeof ValidationSchema>>({
    resolver: zodResolver(ValidationSchema),
    defaultValues,
  });

  const { handleSubmit } = form;

  function onValidSubmit(data: z.infer<typeof ValidationSchema>) {
    register(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit, () =>
        toast.error("Please fix the highlighted fields"),
      )}
      className="mt-6 space-y-5"
    >
      {isError && (
        <div className="text-destructive text-sm font-normal">
          {error.message || "Registration failed. Please try again."}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="first_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="first_name">
                <FieldTitle>
                  First name <span className="text-destructive">*</span>
                </FieldTitle>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="first_name"
                  placeholder="First name"
                  autoComplete="given-name"
                  aria-invalid={fieldState.invalid}
                  className="h-11"
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="last_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="last_name">
                <FieldTitle>
                  Last name <span className="text-destructive">*</span>
                </FieldTitle>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="last_name"
                  placeholder="Last name"
                  autoComplete="family-name"
                  aria-invalid={fieldState.invalid}
                  className="h-11"
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">
              <FieldTitle>
                Email <span className="text-destructive">*</span>
              </FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-11"
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="phone_number"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="phone_number">
              <FieldTitle>
                Phone number <span className="text-destructive">*</span>
              </FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                id="phone_number"
                type="tel"
                placeholder="Phone number"
                autoComplete="tel"
                aria-invalid={fieldState.invalid}
                className="h-11"
                maxLength={10}
                {...field}
                onChange={(event) =>
                  field.onChange(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">
              <FieldTitle>
                Password <span className="text-destructive">*</span>
              </FieldTitle>
            </FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  className="h-11 pr-16"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By registering, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
