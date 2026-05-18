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
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Send className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-michroma text-lg font-semibold text-foreground">
          Message sent!
        </h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-2 text-sm text-primary underline underline-offset-4 hover:opacity-80"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Row 1: First Name + Last Name */}
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-first_name" className="text-xs font-medium text-muted-foreground">
            First Name{requiredStar}
          </label>
          <input
            id="contact-first_name"
            type="text"
            name="first_name"
            required
            placeholder=""
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-last_name" className="text-xs font-medium text-muted-foreground">
            Last Name{requiredStar}
          </label>
          <input
            id="contact-last_name"
            type="text"
            name="last_name"
            required
            placeholder="Doe"
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground">
            Email <span className="text-muted-foreground/70">(optional)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className="text-xs font-medium text-muted-foreground">
            Phone Number{requiredStar}
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            required
            placeholder="+91 012 3456 789"
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-xs font-medium text-muted-foreground">
          Message{requiredStar}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={3}
          placeholder="Write your message.."
          className="resize-none border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
