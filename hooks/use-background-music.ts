"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BACKGROUND_MUSIC } from "@/config/background-music";

function readStoredPlaying(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(BACKGROUND_MUSIC.storageKey);
  if (stored === null) return true;
  return stored === "true";
}

function writeStoredPlaying(playing: boolean) {
  localStorage.setItem(BACKGROUND_MUSIC.storageKey, String(playing));
}

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const wantsPlayingRef = useRef(true);
  const unlockCleanupRef = useRef<(() => void) | null>(null);

  const detachUnlock = useCallback(() => {
    unlockCleanupRef.current?.();
    unlockCleanupRef.current = null;
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      await audio.play();
      setIsPlaying(true);
      writeStoredPlaying(true);
      wantsPlayingRef.current = true;
      detachUnlock();
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, [detachUnlock]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    writeStoredPlaying(false);
    wantsPlayingRef.current = false;
    detachUnlock();
  }, [detachUnlock]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
      return;
    }
    await play();
  }, [isPlaying, pause, play]);

  const attachUnlock = useCallback(() => {
    if (unlockCleanupRef.current) return;

    const unlock = () => {
      if (!wantsPlayingRef.current) return;
      void play();
    };

    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    unlockCleanupRef.current = () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [play]);

  useEffect(() => {
    wantsPlayingRef.current = readStoredPlaying();
    const audio = new Audio(BACKGROUND_MUSIC.src);
    audio.loop = true;
    audio.volume = BACKGROUND_MUSIC.volume;
    audio.preload = "auto";
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onCanPlay = () => setIsReady(true);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("canplaythrough", onCanPlay);

    const tryAutoplay = async () => {
      if (!wantsPlayingRef.current) {
        setIsPlaying(false);
        return;
      }
      const ok = await play();
      if (!ok) attachUnlock();
    };

    void tryAutoplay();

    const onVisibilityChange = () => {
      if (document.hidden || !wantsPlayingRef.current) return;
      void play();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("canplaythrough", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      detachUnlock();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [attachUnlock, detachUnlock, play]);

  return { isPlaying, isReady, toggle, play, pause };
}
