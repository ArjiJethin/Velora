"use client";

import React, { useState } from "react";
import { useStudio } from "@/context/StudioContext";
import { PublishIcon } from "./CustomIcons";
import {
  Undo2,
  Redo2,
  Type,
  Image as ImageIcon,
  Square,
  Table as TableIcon,
  Columns,
  Plus,
  Eye,
  BookOpen,
  Globe,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const Toolbar: React.FC = () => {
  const {
    theme,
    saveStatus,
    undo,
    redo,
    historyPointer,
    historyLength,
    triggerSave,
    addElement,
    activePage,
    selectedPageId,
    document: doc,
    totalPages,
    setReadingMode,
    setZoom,
    setActiveView
  } = useStudio();

  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleAddElement = (type: "text" | "image" | "shape") => {
    const pageId = selectedPageId || activePage;
    addElement(pageId, type);
  };

  return (
    <>
      <header className="theme-transition h-16 w-full px-6 flex items-center justify-between select-none z-30 velora-ceramic">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-1 py-1 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Velora Logo"
              className="w-8 h-8 object-contain flex-shrink-0"
            />
            <div className="flex flex-col justify-center">
              <span 
                className="text-[20px] leading-none tracking-[0.14em] text-[#1F1F1F] dark:text-[#EAEAEA]"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif", 
                  fontWeight: 600 
                }}
              >
                VELORA
              </span>
              <span className="text-[7.5px] uppercase tracking-[0.25em] text-[#D4AF37] dark:text-[#E8C35A] font-bold leading-none mt-1 font-poppins">
                Book Studio
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

          {/* Book Navigation Path */}
          <div className="flex items-center gap-2 text-[13px] text-neutral-500 dark:text-neutral-400">
            <span 
              onClick={() => setActiveView("dashboard")}
              className="hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              My Books
            </span>
            <ChevronRight size={12} className="text-neutral-400 dark:text-neutral-600" />
            <span className="text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
              {doc.title}
            </span>

            {/* Dynamic Save status indicator */}
            <div className="flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06]">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  saveStatus === "saving"
                    ? "bg-amber-400 animate-pulse"
                    : saveStatus === "saved"
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-red-400"
                }`}
              />
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Unsaved Changes"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Tools Capsule */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center px-1.5 py-1 rounded-full velora-capsule shadow-2xl">
          <div className="flex items-center gap-1">
            {/* Undo */}
            <button
              onClick={undo}
              disabled={historyPointer === 0}
              title="Undo (Ctrl+Z)"
              className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] disabled:opacity-20 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
            >
              <Undo2 size={15} />
            </button>

            {/* Redo */}
            <button
              onClick={redo}
              disabled={historyPointer >= historyLength}
              title="Redo (Ctrl+Y)"
              className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] disabled:opacity-20 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
            >
              <Redo2 size={15} />
            </button>

            <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1.5" />

            {/* Insert Text */}
            <button
              onClick={() => handleAddElement("text")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer font-medium"
            >
              <Type size={14} className="text-neutral-400" />
              Text
            </button>

            {/* Insert Image */}
            <button
              onClick={() => handleAddElement("image")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer font-medium"
            >
              <ImageIcon size={14} className="text-neutral-400" />
              Image
            </button>

            {/* Insert Shape */}
            <button
              onClick={() => handleAddElement("shape")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer font-medium"
            >
              <Square size={14} className="text-neutral-400" />
              Shape
            </button>

            <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1.5" />

            {/* Insert Table */}
            <button
              onClick={() => handleAddElement("text")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer font-medium"
            >
              <TableIcon size={14} className="text-neutral-400" />
              Table
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Preview */}
          <button
            onClick={triggerSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-black/5 dark:border-white/[0.06] transition-all duration-200 cursor-pointer"
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>

          {/* Reading Mode */}
          <button
            onClick={() => {
              setReadingMode(true);
              setZoom(120);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-black/5 dark:border-white/[0.06] transition-all duration-200 cursor-pointer"
          >
            <BookOpen size={14} />
            <span>Reading Mode</span>
          </button>

          {/* Publish */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="theme-transition flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold text-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer btn-publish"
            style={{
              backgroundColor: "#D4AF37",
              boxShadow: "0 4px 14px rgba(212, 175, 55, 0.4)",
            }}
          >
            <PublishIcon size={14} />
            <span>Publish</span>
          </button>

          <div className="w-px h-5 bg-black/10 dark:bg-white/10" />

          {/* User profile dropdown info */}
          <div className="relative group cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/15 overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B76E79] flex items-center justify-center text-[11px] font-bold text-black">
                AM
              </div>
            </div>
            <div className="absolute top-[calc(100%+6px)] right-0 w-32 velora-glass p-2 rounded-lg text-[11px] text-neutral-800 dark:text-neutral-400 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 scale-95 group-hover:scale-100">
              Aria Moon (Author)
            </div>
          </div>
        </div>
      </header>

      {/* Publish Modal dialog popup */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="velora-glass w-full max-w-md p-6 rounded-2xl relative shadow-2xl overflow-hidden"
            >
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-xl theme-transition"
                style={{ backgroundColor: theme.accentColor }}
              />

              <div className="flex items-center gap-2 mb-3">
                <Sparkles
                  size={20}
                  className="theme-transition"
                  style={{ color: theme.accentColor }}
                />
                 <h3 className="text-lg font-bold text-neutral-800 dark:text-white font-poppins">Publish Storybook</h3>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed mb-5">
                Ready to share <strong className="text-neutral-800 dark:text-neutral-200">{doc.title}</strong>? This will compile your text, high-res layouts, and illustrations into a web-optimized responsive digital flipbook.
              </p>

              <div className="space-y-3 mb-6 font-mono text-[11px]">
                <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/[0.06] rounded-xl flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-400">Book Title</span>
                  <span className="text-neutral-800 dark:text-white font-medium">{doc.title}</span>
                </div>
                <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/[0.06] rounded-xl flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-400">Selected Theme Style</span>
                  <span
                    className="font-medium theme-transition"
                    style={{ color: theme.accentColor }}
                  >
                    {theme.name}
                  </span>
                </div>
                <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/[0.06] rounded-xl flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-400">Total Book Pages</span>
                  <span className="text-neutral-800 dark:text-white font-medium">{totalPages} Pages</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04] text-[13px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    triggerSave();
                    setShowPublishModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-lg text-black font-semibold text-[13px] theme-transition cursor-pointer"
                  style={{
                    backgroundColor: "#D4AF37",
                    boxShadow: "0 4px 12px rgba(212, 175, 55, 0.35)",
                  }}
                >
                  Confirm & Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
