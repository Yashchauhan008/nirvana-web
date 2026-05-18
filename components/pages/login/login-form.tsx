"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { loginCustomer } from "@/services/api/customers.api";
import type { LoginCustomerRequest } from "@/types/customer.type";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cartKeys } from "@/hooks/useCart";

const ValidationSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .trim()
    .nonempty("Password is required")
    .max(100, "Password must be at most 100 characters"),
});

const defaultValues: z.infer<typeof ValidationSchema> = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const rawRedirectUrl = searchParams.get("redirect_url");
  const redirectUrl = rawRedirectUrl
    ? decodeURIComponent(rawRedirectUrl)
    : null;

  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: loginMutate,
    isPending: submitting,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: LoginCustomerRequest) => loginCustomer(data),
    onSuccess: async (data) => {
      let nextUrl = redirectUrl && redirectUrl.startsWith("/")
        ? redirectUrl
        : "/";
      
      // If redirecting to a product page after auth, add flag to auto-open enquiry
      if (redirectUrl && redirectUrl.startsWith("/products/")) {
        const separator = nextUrl.includes("?") ? "&" : "?";
        nextUrl = `${nextUrl}${separator}open_enquiry=true`;
      }
      
      login(data.customer, data.token, data.expires_at);
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Signed in successfully.");
      router.replace(nextUrl);
    },
  });

  const form = useForm<z.infer<typeof ValidationSchema>>({
    resolver: zodResolver(ValidationSchema),
    defaultValues,
  });

  const { handleSubmit } = form;

  function onValidSubmit(values: z.infer<typeof ValidationSchema>) {
    loginMutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} className="mt-6 space-y-5">
      {isError && (
        <div className="text-destructive text-sm font-normal">
          {error?.message || "Login failed. Please try again."}
        </div>
      )}

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="email">
              <FieldTitle>
                Email <span className="text-destructive">*</span>
              </FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                id="email"
                className="h-11"
                type="email"
                placeholder="you@example.com"
                {...field}
                aria-invalid={fieldState.invalid}
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
          <Field>
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
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="h-11 pr-16"
                  {...field}
                  aria-invalid={fieldState.invalid}
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
        {submitting ? "Login in…" : "Log in"}
      </Button>
    </form>
  );
}
