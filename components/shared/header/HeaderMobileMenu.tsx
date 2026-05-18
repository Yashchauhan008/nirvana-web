"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, X, ShoppingCart, LogOut } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/products", label: "Product" },
  { href: "/contact", label: "Contact us" },
] as const;

export function HeaderMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: cart } = useGetCart();
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) ?? 0;
  const { authUser, isLoggedIn, logout } = useAuth();

  const userInitials = useMemo(() => {
    if (!authUser) return "";
    const first = authUser.first_name ?? "";
    const last = authUser.last_name ?? "";
    const fi = first ? first[0].toUpperCase() : "";
    const li = last ? last[0].toUpperCase() : "";
    return fi + li || (authUser.email?.[0] ?? "").toUpperCase();
  }, [authUser]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Are you sure you want to log out?")
    )
      return;
    logout();
    router.push("/");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#0046B7] hover:text-[#0046B7] md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="top"
        showCloseButton={false}
        overlayClassName="backdrop-blur-md bg-black/30"
        className="inset-0 top-0 h-full min-h-dvh w-full max-w-none flex flex-col p-0 border-0 rounded-none bg-gradient-to-b from-white via-slate-50/95 to-slate-100/90 shadow-none"
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 px-4 pt-6 pb-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <Image
              src="/logos/primary.svg"
              alt="Gravis"
              height={36}
              width={120}
              className="h-9 w-auto"
            />
          </Link>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-[#0046B7] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0046B7]/30"
            >
              <X className="size-5" />
            </button>
          </SheetClose>
        </div>

        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <nav
          className="flex flex-1 h-full flex-col px-6 py-8"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto w-full max-w-xs space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <SheetClose key={item.href} asChild>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-semibold tracking-wide transition-all duration-200",
                      active
                        ? "bg-[#0046B7] text-white shadow-lg shadow-[#0046B7]/25"
                        : "text-slate-700 hover:bg-white/80 hover:shadow-md hover:text-[#0046B7]",
                    )}
                  >
                    <span
                      className={cn(
                        "h-8 w-1 shrink-0 rounded-full",
                        active ? "bg-white/90" : "bg-[#0046B7]",
                      )}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-slate-200/80 bg-white/60 px-6 py-5">
          <div className="mx-auto flex max-w-xs flex-col gap-3">
            <SheetClose asChild>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#0046B7] hover:bg-[#0046B7]/5 hover:text-[#0046B7]"
              >
                <ShoppingCart className="size-5" />
                Cart{cartItemCount > 0 ? ` (${cartItemCount})` : ""}
              </Link>
            </SheetClose>
            {isLoggedIn && authUser ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-[#0046B7] text-white">
                      {userInitials || <User className="size-3.5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {authUser.full_name || authUser.email}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {authUser.email}
                    </span>
                  </div>
                </div>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl border-slate-200"
                    onClick={() => router.push("/account")}
                  >
                    Account settings
                  </Button>
                </SheetClose>
                <Button
                  variant="ghost"
                  className="w-full justify-center rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <SheetClose asChild>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Login
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-[#0046B7] px-4 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#0046B7]/90"
                  >
                    Register
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
