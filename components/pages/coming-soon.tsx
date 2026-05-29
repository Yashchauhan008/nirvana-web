"use client";

import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { zaslia } from "@/lib/fonts/zaslia";
import "@/styles/home.css";

export function ComingSoon() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    // Target date: Tuesday, June 2nd, 2026 at 12:00 PM (noon)
    const targetDate = new Date("2026-06-02T12:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`coming-soon-wrapper nirvana-home grain ${zaslia.variable} relative min-h-screen w-full flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-[var(--nirvana-cream)] text-[var(--nirvana-deep)] select-none`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drawGlasses {
          from {
            stroke-dashoffset: 1200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes floatGlasses {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(0.25deg);
          }
        }
        @keyframes subtlePulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.45;
          }
        }
        .animate-draw-glasses {
          stroke-dasharray: 1200;
          animation: drawGlasses 3.5s cubic-bezier(0.25, 1, 0.5, 1) forwards, floatGlasses 8s ease-in-out infinite 3.5s;
        }
        .glow-effect {
          background: radial-gradient(circle 400px at 50% 50%, var(--color-bg-glow) 0%, transparent 80%);
          --color-bg-glow: color-mix(in srgb, var(--nirvana-mint) 45%, transparent);
        }
      `}} />

      {/* Background ambient glow */}
      <div className="absolute inset-0 glow-effect pointer-events-none z-0 opacity-80" />

      {/* Header - Brand Identity */}
      <header className="relative z-10 w-full flex justify-center py-4">
        <div className="flex flex-col items-center">
          <span className="font-display text-2xl md:text-3xl tracking-[0.4em] text-[var(--nirvana-deep)] mr-[-0.4em]">
            NIRVANA
          </span>
          <span className="font-body-strong text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[var(--nirvana-leaf)] mt-1.5 mr-[-0.5em]">
            E Y E W E A R
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 my-auto flex flex-col items-center max-w-4xl mx-auto w-full text-center px-4">

        {/* Message */}
        <p className="font-body-strong mb-4 text-[11px] uppercase tracking-[0.35em] text-[var(--nirvana-leaf)]">
          Redesign In Progress
        </p>

        <h1 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] mb-6 tracking-wide">
          <span>The future of vision is</span>
          <br />
          <span className="text-gradient italic">coming in soft focus.</span>
        </h1>

        <p className="font-body max-w-lg text-[13px] md:text-sm leading-relaxed text-[var(--nirvana-forest)]/80 mb-10 md:mb-12 px-2">
          Sculpted temples, hand-polished organic materials, and waitlist-only releases. 
          We are meticulously refining our digital boutique.
        </p>

        {/* Countdown */}
        {mounted && (
          <div className="flex justify-center gap-6 md:gap-10 mb-12 md:mb-16">
            {[
              { value: timeLeft.days, label: "days" },
              { value: timeLeft.hours, label: "hours" },
              { value: timeLeft.minutes, label: "mins" },
              { value: timeLeft.seconds, label: "secs" },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-display text-3xl md:text-4xl tracking-normal text-[var(--nirvana-forest)]">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="font-body-strong mt-2 text-[9px] uppercase tracking-[0.25em] text-[var(--nirvana-leaf)]">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-[var(--nirvana-sage)]/25 mt-8 text-[10px] md:text-xs">
        <span className="font-body text-[var(--nirvana-forest)]/60 tracking-wider">
          © {new Date().getFullYear()} NIRVANA. Handcrafted design.
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/nirvana.shades"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body-strong text-[var(--nirvana-forest)] hover:text-[var(--nirvana-leaf)] tracking-[0.2em] uppercase transition-colors flex items-center gap-1.5"
          >
            <Instagram className="w-3 h-3" /> Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
