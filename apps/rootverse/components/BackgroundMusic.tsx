"use client";
import { useEffect, useRef } from "react";

export const BackgroundMusic = ({ enabled }: { enabled: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (enabled && audioRef.current) audioRef.current.play().catch(() => {});
    else if (audioRef.current) audioRef.current.pause();
  }, [enabled]);

  return <audio ref={audioRef} src="/music/verse_theme.mp3" loop preload="auto" />;
};
