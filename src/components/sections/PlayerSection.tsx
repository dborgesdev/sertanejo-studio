import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { SITE_DATA } from "../../config/siteData";
import { SectionWrapper } from "../ui/SectionWrapper";

import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";
import hero4 from "@/assets/hero-4.webp";
import hero5 from "@/assets/hero-5.webp";
import hero6 from "@/assets/hero-6.webp";

const images = [hero1, hero2, hero3, hero4, hero5, hero6];

export function PlayerSection() {
  const [current, setCurrent] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(100);
  const [songTitle, setSongTitle] = useState("Sertanejo FM — Ao Vivo");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onPause);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onPause);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/now-playing", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as { songtitle?: string };
        if (active && data.songtitle) setSongTitle(data.songtitle);
      } catch {
        // Metadata is optional; the stream continues even if stats fail.
      }
    };

    fetchNowPlaying();
    const interval = window.setInterval(fetchNowPlaying, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    setIsLoading(true);
    try {
      await audio.play();
    } catch {
      setIsLoading(false);
    }
  };

  const changeVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume / 100;
  };

  return (
    <SectionWrapper id="player" tone="wood" glow className="pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 relative z-10">
        {/* Cabeçalho da Seção com Alto Contraste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(26,19,12,0.25)] bg-[rgba(26,19,12,0.06)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#8c5e14] mb-4 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            Rádio ao vivo
          </span>

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide text-coffee-medium">
            Rádio <span className="text-gold-gradient-dark font-bold">Sertanejo FM</span>
          </h2>

          <p className="mt-3 text-[#4a3e31] text-sm md:text-base font-semibold">
            Música sem interrupções. 24h de pura emoção e sintonia perfeita.
          </p>
        </motion.div>

        {/* Card do Player Destaque Sólido (Pop do Escuro no Claro) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden border border-[rgba(26,19,12,0.3)] shadow-[0_20px_50px_rgba(26,19,12,0.35)] bg-[#0a0805]"
        >
          {/* Topo: Slideshow de Imagens */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  i === current
                    ? "opacity-100 scale-105 transition-transform duration-10000"
                    : "opacity-0 scale-100"
                }`}
                loading="lazy"
              />
            ))}

            <div className="absolute inset-0 bg-linear-to-t from-[#0a0805]/10 via-[#0a0805]/5 to-transparent" />

            {/* Barra Equalizadora Interativa Dourada */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-end gap-1.5 px-6 py-3 rounded-2xl">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-linear-to-t from-[#8c5e14] via-[#df9919] to-[#e9ad46]"
                  animate={{
                    height: [8, Math.random() * 32 + 8, 8],
                  }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.04,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Base: Player nativo */}
          <div className="relative bg-[#0a0805] border-t border-[rgba(229,169,60,0.15)] text-white">
            <audio ref={audioRef} src={SITE_DATA.streamUrl} preload="none" />
            <div className="flex min-h-20 items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5">
              <button
                type="button"
                onClick={togglePlayback}
                disabled={isLoading}
                aria-label={isPlaying ? "Pausar transmissão" : "Ouvir Sertanejo FM"}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9ad46] text-coffee-medium transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-70 sm:h-14 sm:w-14"
              >
                {isLoading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-coffee-medium/20 border-t-coffee-medium" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current sm:h-6 sm:w-6" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e9ad46]/70 sm:text-xs">
                  Sertanejo FM
                </p>
                <p className="truncate text-sm font-semibold text-white sm:text-lg">
                  {isLoading ? "Conectando..." : songTitle}
                </p>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e9ad46] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e9ad46]" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  Ao vivo
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeVolume(volume === 0 ? 100 : 0)}
                  aria-label={volume === 0 ? "Ativar som" : "Silenciar"}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  aria-label="Volume"
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  className="hidden w-20 accent-[#e9ad46] md:block lg:w-28"
                />
                <span className="hidden w-8 text-right text-[10px] font-semibold text-white/50 lg:block">
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
