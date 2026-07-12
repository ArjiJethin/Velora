"use client";

import React, { useState, useEffect } from "react";
import { useStudio } from "@/context/StudioContext";
import { Plus, Heart, Hash, Sparkles } from "lucide-react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const {
    recentColors,
    favoriteColors,
    addRecentColor,
    addFavoriteColor,
  } = useStudio();

  const [hexInput, setHexInput] = useState(value);
  const [rgbInput, setRgbInput] = useState("");
  const [hslInput, setHslInput] = useState("");
  const [colorMode, setColorMode] = useState<"hex" | "rgb" | "hsl">("hex");

  // Curated theme palettes
  const curatedPalettes = [
    {
      name: "Warm Parchment",
      colors: ["#FAF2E9", "#EFE9DE", "#D4AF37", "#5D4037"],
      description: "Editorial creams & gold"
    },
    {
      name: "Royal Velvet",
      colors: ["#1A0B2E", "#311B92", "#D1C4E9", "#E040FB"],
      description: "Regal purples & violet"
    },
    {
      name: "Sage Forest",
      colors: ["#0B2E13", "#1B5E20", "#C8E6C9", "#81C784"],
      description: "Woodland green & moss"
    },
    {
      name: "Midnight Ink",
      colors: ["#0B132B", "#1C2541", "#3A506B", "#5BC0BE"],
      description: "Deep navy & cool teal"
    },
    {
      name: "Obsidian",
      colors: ["#040609", "#121212", "#90A4AE", "#E0E0E0"],
      description: "Sleek obsidian & charcoal"
    }
  ];

  // Convert HEX to RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6 && cleanHex.length !== 3) return null;
    
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    } else {
      r = parseInt(cleanHex.substring(0, 1) + cleanHex.substring(0, 1), 16);
      g = parseInt(cleanHex.substring(1, 2) + cleanHex.substring(1, 2), 16);
      b = parseInt(cleanHex.substring(2, 3) + cleanHex.substring(2, 3), 16);
    }
    return { r, g, b };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Parse custom strings to HEX
  useEffect(() => {
    setHexInput(value);
    
    const rgb = hexToRgb(value);
    if (rgb) {
      setRgbInput(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    } else {
      setRgbInput("");
      setHslInput("");
    }
  }, [value]);

  const handleHexSubmit = (val: string) => {
    setHexInput(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      onChange(val);
      addRecentColor(val);
    }
  };

  const handleRgbSubmit = (val: string) => {
    setRgbInput(val);
    const match = val.match(/\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*/i);
    if (match) {
      const r = Math.min(255, parseInt(match[1]));
      const g = Math.min(255, parseInt(match[2]));
      const b = Math.min(255, parseInt(match[3]));
      const hex = "#" + [r, g, b].map(x => {
        const hexStr = x.toString(16);
        return hexStr.length === 1 ? "0" + hexStr : hexStr;
      }).join("");
      onChange(hex);
      addRecentColor(hex);
    }
  };

  const handleHslSubmit = (val: string) => {
    setHslInput(val);
    const match = val.match(/\s*hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*/i);
    if (match) {
      const h = parseInt(match[1]) % 360;
      const s = Math.min(100, parseInt(match[2])) / 100;
      const l = Math.min(100, parseInt(match[3])) / 100;

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      const hue2rgb = (t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const r = Math.round(hue2rgb(h / 360 + 1/3) * 255);
      const g = Math.round(hue2rgb(h / 360) * 255);
      const b = Math.round(hue2rgb(h / 360 - 1/3) * 255);

      const hex = "#" + [r, g, b].map(x => {
        const hexStr = x.toString(16);
        return hexStr.length === 1 ? "0" + hexStr : hexStr;
      }).join("");
      onChange(hex);
      addRecentColor(hex);
    }
  };

  return (
    <div className="space-y-3.5 p-3.5 velora-glass border border-black/10 dark:border-white/[0.08] rounded-xl text-xs select-none shadow-xs font-poppins text-left">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">{label}</span>
        
        {/* Dynamic Indicator swatch */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md border border-black/15 dark:border-white/20 shadow-xs" style={{ backgroundColor: value }} />
          <span className="text-[10px] font-mono text-neutral-800 dark:text-neutral-200 uppercase">{value}</span>
        </div>
      </div>

      {/* Curated Theme Palettes */}
      <div className="space-y-2">
        <span className="text-[9px] text-neutral-500 dark:text-neutral-450 block uppercase font-bold tracking-wider">Curated Palettes</span>
        <div className="space-y-1.5">
          {curatedPalettes.map((palette) => (
            <div key={palette.name} className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-[#D4AF37]/35 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9.5px] font-bold text-neutral-800 dark:text-neutral-200">{palette.name}</span>
                <span className="text-[8px] text-neutral-400 leading-none">{palette.description}</span>
              </div>
              <div className="flex gap-2">
                {palette.colors.map((color) => {
                  const isActive = value.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        onChange(color);
                        addRecentColor(color);
                      }}
                      className={`w-7 h-7 rounded-lg border transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer relative flex items-center justify-center ${
                        isActive 
                          ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-[0_0_8px_rgba(212,175,55,0.3)]" 
                          : "border-black/10 dark:border-white/10"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorites Swatches Row */}
      <div className="space-y-1.5 border-t border-black/5 dark:border-white/[0.04] pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-neutral-600 dark:text-neutral-400 block uppercase flex items-center gap-1 font-bold">
            <Heart size={8} className="text-red-550 dark:text-red-400 fill-red-550 dark:fill-red-400" />
            <span>Favorites</span>
          </span>
          <button
            onClick={() => addFavoriteColor(value)}
            className="text-[9px] text-[#D4AF37] hover:text-[#C19B34] flex items-center gap-0.5 transition-colors cursor-pointer"
            title="Add to Favorites"
          >
            <Plus size={8} /> Add Current
          </button>
        </div>
        {favoriteColors.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {favoriteColors.map((color) => {
              const isActive = value.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    addRecentColor(color);
                  }}
                  className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                    isActive ? "ring-2 ring-[#D4AF37] border-black" : "border-black/10 dark:border-white/10"
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        ) : (
          <span className="text-[9px] text-neutral-500 dark:text-neutral-450 italic block">No favorites added yet.</span>
        )}
      </div>

      {/* Recent Swatches Row */}
      {recentColors.length > 0 && (
        <div className="space-y-1.5 border-t border-black/5 dark:border-white/[0.04] pt-2">
          <span className="text-[9px] text-neutral-600 dark:text-neutral-400 block uppercase font-bold">Recent Colors</span>
          <div className="flex flex-wrap gap-1.5">
            {recentColors.map((color, idx) => {
              const isActive = value.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={idx}
                  onClick={() => onChange(color)}
                  className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                    isActive ? "ring-2 ring-[#D4AF37] border-black" : "border-black/10 dark:border-white/10"
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Input Mode Picker & Forms */}
      <div className="space-y-2 border-t border-black/5 dark:border-white/[0.04] pt-2.5">
        <div className="flex items-center gap-2">
          {(["hex", "rgb", "hsl"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setColorMode(mode)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                colorMode === mode ? "bg-black/5 dark:bg-white/10 text-neutral-850 dark:text-white" : "text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-300"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {colorMode === "hex" && (
          <div className="flex items-center bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/8 rounded-lg overflow-hidden h-8 px-2.5">
            <Hash size={10} className="text-neutral-500 mr-1.5" />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexSubmit(e.target.value)}
              className="w-full bg-transparent text-[11px] font-mono text-neutral-850 dark:text-white outline-none"
              placeholder="#FFFFFF"
            />
          </div>
        )}

        {colorMode === "rgb" && (
          <div className="flex items-center bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/8 rounded-lg overflow-hidden h-8 px-2.5">
            <span className="text-[10px] font-bold text-neutral-500 mr-2">RGB</span>
            <input
              type="text"
              value={rgbInput}
              onChange={(e) => handleRgbSubmit(e.target.value)}
              className="w-full bg-transparent text-[11px] font-mono text-neutral-850 dark:text-white outline-none"
              placeholder="rgb(255, 255, 255)"
            />
          </div>
        )}

        {colorMode === "hsl" && (
          <div className="flex items-center bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/8 rounded-lg overflow-hidden h-8 px-2.5">
            <span className="text-[10px] font-bold text-neutral-500 mr-2">HSL</span>
            <input
              type="text"
              value={hslInput}
              onChange={(e) => handleHslSubmit(e.target.value)}
              className="w-full bg-transparent text-[11px] font-mono text-neutral-850 dark:text-white outline-none"
              placeholder="hsl(0, 0%, 100%)"
            />
          </div>
        )}
      </div>
    </div>
  );
};
