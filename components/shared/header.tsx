"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, X, ShoppingCart, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useListProductCategories } from "@/hooks/product-category.hook";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/products", label: "Product", hasDropdown: true },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const firstInitial = first ? first[0].toUpperCase() : "";
    const lastInitial = last ? last[0].toUpperCase() : "";
    return (
      firstInitial + lastInitial || (authUser.email?.[0] ?? "").toUpperCase()
    );
  }, [authUser]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (!confirmed) return;
    }
    logout();
    router.push("/");
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-white/95 backdrop-blur-md shadow-sm",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/logos/primary.svg"
              alt="Gravis India"
              width={171}
              height={41}
              className="h-9 w-auto md:h-10"
              priority
            />
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <nav
          className="hidden flex-1 items-center justify-center gap-4 text-sm font-medium text-slate-700 md:flex"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-1.5 px-1 py-1 transition-colors",
              isActive("/")
                ? "text-[#0046B7]"
                : "text-slate-600 hover:text-[#0046B7]",
            )}
          >
            Home
          </Link>
          <span className="text-slate-300" aria-hidden>
            |
          </span>
          <Link
            href="/about"
            className={cn(
              "inline-flex items-center gap-1.5 px-1 py-1 transition-colors",
              isActive("/about")
                ? "text-[#0046B7]"
                : "text-slate-600 hover:text-[#0046B7]",
            )}
          >
            About us
          </Link>
          <span className="text-slate-300" aria-hidden>
            |
          </span>
          <ProductCategoriesMenu active={isActive("/products")} />
          <span className="text-slate-300" aria-hidden>
            |
          </span>
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center gap-1.5 px-1 py-1 transition-colors",
              isActive("/contact")
                ? "text-[#0046B7]"
                : "text-slate-600 hover:text-[#0046B7]",
            )}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right: Auth + Cart + primary CTA */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Shopping cart${
              cartItemCount > 0 ? `, ${cartItemCount} items` : ""
            }`}
            className="relative hover:text-primary"
          >
            <ShoppingCart className="size-6" />
            {cartItemCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0046B7] text-[10px] font-semibold text-white"
                aria-hidden
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>

          {/* Account / Auth */}
          {isLoggedIn && authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-[#0046B7] hover:text-[#0046B7]"
                  aria-label="Account menu"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="bg-[#0046B7] text-primary-foreground">
                      {userInitials || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {authUser.full_name || authUser.email}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {authUser.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/orders")}
                  className="cursor-pointer"
                >
                  My orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/account")}
                  className="cursor-pointer"
                >
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-[#0046B7] md:inline-block"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-[#0046B7] px-3 py-1.5 text-xs font-semibold text-[#0046B7] transition-colors hover:bg-[#0046B7] hover:text-white md:text-sm"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-[#0046B7] hover:text-[#0046B7] md:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(320px,100vw)] flex flex-col p-0 border-l border-border bg-background min-h-full"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="font-michroma text-lg font-bold text-primary">
                  Menu
                </span>
                <SheetClose asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="p-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <X className="size-5" />
                  </button>
                </SheetClose>
              </div>
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col flex-1 p-3 gap-0.5 overflow-auto"
                aria-label="Mobile navigation"
              >
                {navigationItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-3 border-t border-border">
                <SheetClose asChild>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <ShoppingCart className="size-5 text-muted-foreground" />
                    <span className="font-medium">
                      Cart{cartItemCount > 0 ? ` (${cartItemCount})` : ""}
                    </span>
                  </Link>
                </SheetClose>
                {isLoggedIn && authUser ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userInitials || <User className="size-3.5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {authUser.full_name || authUser.email}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {authUser.email}
                        </span>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                        onClick={() => router.push("/orders")}
                      >
                        My orders
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="mt-1 w-full justify-center"
                        onClick={() => router.push("/account")}
                      >
                        Account settings
                      </Button>
                    </SheetClose>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-destructive hover:text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-muted transition-colors"
                      >
                        Login
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                      >
                        Register
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function ProductCategoriesMenu({ active }: { active: boolean }) {
  const { data: categories } = useListProductCategories();
  const router = useRouter();

  return (
    <NavigationMenu viewport={false} className="flex-none">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "rounded-none border-none bg-transparent px-1 py-1 text-sm font-medium shadow-none hover:bg-transparent focus:bg-transparent focus:outline-none data-[state=open]:bg-transparent",
              active ? "text-[#0046B7]" : "text-slate-600 hover:text-[#0046B7]",
            )}
            onClick={(event) => {
              event.preventDefault();
              router.push("/products");
            }}
          >
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mt-4 left-1/2 -translate-x-1/2  rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="grid scrollbar-hide gap-4 p-5 grid-cols-3 min-w-[70svw] max-h-[50svh] overflow-y-auto">
              {(categories ?? []).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category_id=${category.id}`}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-colors hover:border-[#0046B7] hover:bg-slate-50"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {category.image?.url ? (
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized={category.image.url.startsWith("http://")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-800">
                      {category.name}
                    </p>
                  </div>
                </Link>
              ))}
              {!categories?.length && (
                <div className="flex items-center justify-center py-4 text-xs text-slate-500">
                  Loading categories...
                </div>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}