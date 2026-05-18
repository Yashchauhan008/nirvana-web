"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useListProductCategories } from "@/hooks/product-category.hook";

const PRODUCTS_MENU_VALUE = "products";

function ProductCategoriesMenu({ active }: { active: boolean }) {
  const { data: categories } = useListProductCategories();
  const router = useRouter();
  const [menuValue, setMenuValue] = useState("");

  return (
    <NavigationMenu
      viewport={false}
      className="flex-none"
      value={menuValue}
      onValueChange={setMenuValue}
    >
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem value={PRODUCTS_MENU_VALUE}>
          <NavigationMenuTrigger
            className={cn(
              "rounded-none border-none bg-transparent px-1 py-1 text-sm font-medium shadow-none hover:bg-transparent focus:bg-transparent focus:outline-none data-[state=open]:bg-transparent",
              active ? "text-[#0046B7]" : "text-slate-600 hover:text-[#0046B7]",
            )}
            onClick={(e) => {
              e.preventDefault();
              router.push("/products");
            }}
          >
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mt-3 left-1/2 -translate-x-1/2 rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="grid scrollbar-hide max-h-[50svh] min-w-[60svw] grid-cols-4 p-2 overflow-y-auto">
              {(categories ?? []).map((category) => (
                <NavigationMenuLink asChild key={category.id}>
                  <Link
                    href={`/products?category_id=${category.id}`}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-colors hover:border-[#0046B7] hover:bg-slate-50"
                    onClick={() => setMenuValue("")}
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {category.image?.url ? (
                        <Image
                          src={category.image.url}
                          alt={category.name}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </div>
                    <p className="text-base text-center font-semibold text-slate-800">
                      {category.name}
                    </p>
                  </Link>
                </NavigationMenuLink>
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

export function HeaderDesktopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
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
    </nav>
  );
}
