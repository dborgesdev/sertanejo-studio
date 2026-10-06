import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

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

          {/* Base: Player oficial via iframe */}
          <div className="relative bg-[#0a0805] border-t border-[rgba(229,169,60,0.15)]">
            <iframe
              src={SITE_DATA.streamIframeUrl}
              className="h-20 w-full border-0"
              title="Sertanejo FM - Player ao vivo"
              allow="autoplay"
            />
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
