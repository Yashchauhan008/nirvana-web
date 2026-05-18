"use client";

import { Music, Pause } from "lucide-react";

import { useBackgroundMusic } from "@/hooks/use-background-music";
import { cn } from "@/lib/utils";

export function BackgroundMusic() {
  const { isPlaying, isReady, toggle } = useBackgroundMusic();

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      onPointerDown={(e) => e.stopPropagation()}
      disabled={!isReady}
      className={cn(
        "fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300",
        "hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/25",
        "disabled:cursor-wait disabled:opacity-60",
        isPlaying && "border-primary/30 text-primary",
      )}
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <Pause className="h-5 w-5" aria-hidden />
      ) : (
        <Music className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
