"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitContactInquiry } from "@/services/api/inquiry.api";

const requiredStar = (
  <span className="text-destructive" aria-hidden>
    {" "}
    *
  </span>
);

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const first_name = (formData.get("first_name") as string)?.trim() ?? "";
    const last_name = (formData.get("last_name") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const message = (formData.get("message") as string)?.trim() ?? "";

    if (!first_name || !phone || !message) {
      toast.error("Please fill in all required fields (First Name, Phone Number, Message).");
      return;
    }

    setPending(true);
    try {
      await submitContactInquiry({
        name: [first_name, last_name].filter(Boolean).join(" "),
        email: email || undefined,
        phone_number: phone,
        message,
      });
      setDone(true);
      form.reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--nirvana-mist)]">
          <Send className="h-6 w-6 text-[var(--nirvana-forest)]" />
        </div>
        <h3 className="font-display text-xl text-[var(--nirvana-deep)]">
          Message sent!
        </h3>
        <p className="font-body text-sm text-[var(--nirvana-forest)]/70">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="font-body-strong mt-2 text-sm text-[var(--nirvana-forest)] underline underline-offset-4 hover:opacity-80"
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldClass =
    "border-0 border-b border-[var(--nirvana-sage)]/50 bg-transparent pb-2 font-body text-sm text-[var(--nirvana-deep)] placeholder:text-[var(--nirvana-forest)]/35 focus:border-[var(--nirvana-forest)] focus:outline-none transition-colors";
  const labelClass =
    "font-body-strong text-[11px] uppercase tracking-[0.12em] text-[var(--nirvana-forest)]/70";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-first_name" className={labelClass}>
            First Name{requiredStar}
          </label>
          <input
            id="contact-first_name"
            type="text"
            name="first_name"
            required
            placeholder=""
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-last_name" className={labelClass}>
            Last Name{requiredStar}
          </label>
          <input
            id="contact-last_name"
            type="text"
            name="last_name"
            required
            placeholder="Doe"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="normal-case tracking-normal opacity-70">(optional)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className={labelClass}>
            Phone Number{requiredStar}
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            required
            placeholder="+91 012 3456 789"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className={labelClass}>
          Message{requiredStar}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Write your message.."
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--nirvana-forest)] px-8 py-3 font-body-strong text-sm tracking-[0.08em] text-[var(--nirvana-cream)] hover:bg-[var(--nirvana-deep)] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
