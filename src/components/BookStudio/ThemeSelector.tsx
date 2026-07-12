"use client";

import React, { useRef } from "react";
import { useStudio } from "@/context/StudioContext";
import { THEMES } from "@/constants/themes";
import { ThemeId } from "@/types/theme";
import {
  Sparkles,
  Orbit,
  Skull,
  Heart,
  Compass,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const IconMap: Record<string, React.FC<any>> = {
  "Fantasy": Sparkles,
  "Sci-Fi": Orbit,
  "Horror": Skull,
  "Romance": Heart,
  "Adventure": Compass,
  "Classic": BookOpen,
  "Children’s": Sparkles,
  "Minimal": BookOpen,
  "Fairy Tale": Sparkles,
  "Poetry": BookOpen,
};

export const ThemeSelector: React.FC = () => {
  const { theme, bookTemplateId, setBookTemplateId } = useStudio();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const themeList = Object.values(THEMES);

  const themePalettes: Record<ThemeId, string[]> = {
    fantasy: ["#D4AF37", "#8B7355", "#F7F2E9", "#11161F"],
    scifi: ["#00E5FF", "#00838F", "#ECEFF1", "#0A0E17"],
    horror: ["#FF1744", "#4A0E17", "#ECEFF1", "#000000"],
    romance: ["#B76E79", "#8C5866", "#FAF6F0", "#1E1315"],
    adventure: ["#00E676", "#1B5E20", "#F4F1EA", "#131E15"],
    classic: ["#E0E0E0", "#9E9E9E", "#FFFFFF", "#121212"],
    children: ["#D500F9", "#00E5FF", "#FFFDE7", "#211625"],
    minimal: ["#7F8C8D", "#95A5A6", "#FAF9F6", "#1C1C1C"],
    fairytale: ["#FF9FF3", "#F19066", "#FFF5F5", "#2C1A30"],
    poetry: ["#485460", "#808E9B", "#FDFDFD", "#222222"],
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-[#0E131B]/70 border-t border-white/[0.08] p-5 select-none z-10 flex-shrink-0 theme-transition">
      <div className="max-w-[1550px] mx-auto flex items-end gap-6 justify-between">
        {/* Left header */}
        <div className="w-52 flex-shrink-0">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
            Book Template Style
          </span>
          <h3 className="text-sm font-bold text-white font-cinzel mb-1">
            Choose a genre template for your pages
          </h3>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors underline decoration-white/20 inline-flex items-center gap-1"
          >
            <span>Learn more</span>
            <span>→</span>
          </a>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative flex-1 overflow-hidden group">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-neutral-900 transition-all z-10 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-neutral-900 transition-all z-10 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>

          {/* Inner Carousel Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-1 px-1 scrollbar-none scroll-smooth"
          >
            {themeList.map((t) => {
              const isSelected = bookTemplateId === t.id;
              const Icon = IconMap[t.category] || Sparkles;
              const palette = themePalettes[t.id];

              return (
                <div
                  key={t.id}
                  onClick={() => setBookTemplateId(t.id)}
                  className={`flex-shrink-0 w-[190px] p-3 rounded-2xl cursor-pointer transition-all duration-300 relative border select-none group/card ${
                    isSelected
                      ? "bg-white/[0.04] border-[var(--accent-color)] shadow-[0_0_15px_var(--accent-glow)]"
                      : "bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  {/* Selected Glow Ring */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 rounded-2xl opacity-10 filter blur-md theme-transition"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  )}

                  {/* Card Title & Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-white font-cinzel tracking-wide">
                      {t.name}
                    </span>
                    <Icon
                      size={12}
                      className="theme-transition"
                      style={{ color: isSelected ? theme.accentColor : "#A3A3A3" }}
                    />
                  </div>

                  {/* Miniature Book Preview inside card */}
                  <div className="w-full h-[84px] bg-neutral-950 rounded-lg flex items-center justify-center mb-2.5 border border-white/[0.04] overflow-hidden">
                    <div className="w-[124px] h-[64px] rounded-xs shadow-md border border-white/5 bg-white/5 relative overflow-hidden flex">
                      {/* Left Page mini */}
                      <div className="w-1/2 h-full bg-[#F7F2E9] border-r border-black/10 p-1 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <div className={`w-8 h-1 rounded-xs ${t.id === "scifi" ? "bg-cyan-600/40" : "bg-neutral-800/40"}`} />
                          <div className="w-10 h-0.5 bg-neutral-600/20 rounded-xs" />
                          <div className="w-12 h-0.5 bg-neutral-600/20 rounded-xs" />
                          <div className="w-8 h-0.5 bg-neutral-600/20 rounded-xs" />
                        </div>
                        <div className="w-3 h-0.5 bg-neutral-400/30 mx-auto" />
                      </div>
                      {/* Right Page mini */}
                      <div className="w-1/2 h-full bg-[#F7F2E9] p-1 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <div className="w-12 h-0.5 bg-neutral-600/20 rounded-xs" />
                          <div className="w-10 h-0.5 bg-neutral-600/20 rounded-xs" />
                          <div className="w-12 h-0.5 bg-neutral-600/20 rounded-xs" />
                          <div className="w-6 h-0.5 bg-neutral-600/20 rounded-xs" />
                        </div>
                        <div className="w-3 h-0.5 bg-neutral-400/30 mx-auto" />
                      </div>
                      {/* Center crease */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-r from-black/10 via-black/25 to-black/10" />

                      {/* Theme Specific Overlay Graphic inside mini-card */}
                      <div
                        className="absolute inset-0.5 border pointer-events-none rounded-xs opacity-40 theme-transition"
                        style={{ borderColor: t.colors.accent }}
                      />
                    </div>
                  </div>

                  {/* Palette dots and active checkmark */}
                  <div className="flex items-center justify-between px-0.5">
                    {/* Dots */}
                    <div className="flex gap-1.5">
                      {palette.map((color, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-black/30"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Radio-like check indicator */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[var(--accent-color)] bg-[var(--accent-color)]"
                          : "border-neutral-700 bg-transparent group-hover/card:border-neutral-500"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="black"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
