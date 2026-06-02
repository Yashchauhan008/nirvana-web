
type PlainPageProps = {
  title: string;
  subtitle?: string;
};

export function PlainPage({ title, subtitle }: PlainPageProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-16">
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
