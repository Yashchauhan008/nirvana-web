import { ContactForm } from "@/components/pages/contact/contact-form";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-[var(--nirvana-cream)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(560px,60vh)] bg-gradient-to-b from-[var(--nirvana-sage)]/20 to-transparent"
        aria-hidden
      />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-12">
        <div className="relative z-10 max-w-2xl">
          <span className="font-body-strong text-xs uppercase tracking-[0.3em] text-[var(--nirvana-leaf)]">
            Get in touch
          </span>
          <h1 className="font-display mt-4 text-5xl text-[var(--nirvana-deep)] md:text-6xl">
            Contact
          </h1>
          <p className="font-body mt-6 text-base leading-relaxed text-[var(--nirvana-forest)]/85">
            Questions about a chain piece, ear balance, or a bespoke crystal
            drop — send us a message and we&apos;ll respond within one business
            day.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-2xl px-6 pb-32 md:px-12">
        <div className="rounded-2xl border border-[var(--nirvana-sage)]/30 bg-white/60 p-8 md:p-10">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
