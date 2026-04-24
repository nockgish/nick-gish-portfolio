"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export type Track = { url: string; title: string };

type AudioCtx = {
  currentTrack: Track | null;
  isPlaying: boolean;
  play: (track: Track) => void;
  pause: () => void;
  stop: () => void;
};

const AudioContext = createContext<AudioCtx | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function play(track: Track) {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.url !== track.url) {
      audio.src = track.url;
      setCurrentTrack(track);
    }
    audio.play();
  }

  function pause() {
    audioRef.current?.pause();
  }

  function stop() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = "";
    setCurrentTrack(null);
    setIsPlaying(false);
  }

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, play, pause, stop }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider>");
  return ctx;
}
