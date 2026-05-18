import Link from "next/link";

import { siteNav } from "@/config/site-nav";

type PlainPageProps = {
  title: string;
  subtitle?: string;
};

export function PlainPage({ title, subtitle }: PlainPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <nav className="border-b border-neutral-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-2">
          {siteNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-3 text-lg text-neutral-600">{subtitle}</p>
        ) : null}
        <p className="mt-8 max-w-xl text-neutral-500">
          Placeholder page — UI removed for redesign. Use the navigation above to
          move between sections.
        </p>
      </main>
    </div>
  );
}
