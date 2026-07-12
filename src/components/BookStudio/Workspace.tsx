"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStudio } from "@/context/StudioContext";
import { EditorElement } from "./EditorElement";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Book,
  Grid as GridIcon,
  Minus,
  Plus,
  BookOpen,
  EyeOff,
  PlusCircle,
  Trash2
} from "lucide-react";

export const Workspace: React.FC = () => {
  const {
    theme,
    bookTemplate,
    activePage,
    setActivePage,
    totalPages,
    zoom,
    setZoom,
    viewMode,
    setViewMode,
    document: doc,
    selectedPageId,
    setSelectedPageId,
    selectedElementId,
    setSelectedElementId,
    readingMode,
    setReadingMode,
    pageBgColor,
    showPageNumbers,
    margins,
    addPageSpread,
    deletePageSpread,
    pageTurnAnimation,
  } = useStudio();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const getLeftPageAnimation = () => {
    if (!readingMode) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 }
      };
    }

    switch (pageTurnAnimation) {
      case "classic-dissolve":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.45, ease: "easeInOut" } as const
        };
      case "horizontal-slide":
        return {
          initial: { x: direction === "next" ? 120 : -120, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } as const
        };
      case "zoom-reveal":
        return {
          initial: { scale: 0.94, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } as const
        };
      case "side-fade":
        return {
          initial: { 
            x: direction === "next" ? 45 : -45, 
            opacity: 0,
            filter: "blur(4px)" 
          },
          animate: { 
            x: 0, 
            opacity: 1,
            filter: "blur(0px)" 
          },
          transition: { duration: 0.5, ease: "easeOut" } as const
        };
      case "page-flip":
      default:
        return {
          initial: { 
            rotateY: direction === "next" ? 85 : 0, 
            transformOrigin: "100% 50%",
            z: direction === "next" ? 10 : 0,
          },
          animate: { 
            rotateY: 0, 
            z: 0,
          },
          transition: { 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          } as const
        };
    }
  };

  const getRightPageAnimation = () => {
    if (!readingMode) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 }
      };
    }

    switch (pageTurnAnimation) {
      case "classic-dissolve":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.45, ease: "easeInOut" } as const
        };
      case "horizontal-slide":
        return {
          initial: { x: direction === "next" ? 120 : -120, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } as const
        };
      case "zoom-reveal":
        return {
          initial: { scale: 0.94, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } as const
        };
      case "side-fade":
        return {
          initial: { 
            x: direction === "next" ? 45 : -45, 
            opacity: 0,
            filter: "blur(4px)" 
          },
          animate: { 
            x: 0, 
            opacity: 1,
            filter: "blur(0px)" 
          },
          transition: { duration: 0.5, ease: "easeOut" } as const
        };
      case "page-flip":
      default:
        return {
          initial: { 
            rotateY: direction === "prev" ? -85 : 0, 
            transformOrigin: "0% 50%",
            z: direction === "prev" ? 10 : 0,
          },
          animate: { 
            rotateY: 0, 
            z: 0,
          },
          transition: { 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          } as const
        };
    }
  };

  // Mouse wheel navigation helper
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Navigate page on scroll if Ctrl is not pressed
      if (!e.ctrlKey && Math.abs(e.deltaY) > 60) {
        if (e.deltaY > 0) {
          handleNextPage();
        } else {
          handlePrevPage();
        }
      }
    };
    const workspaceNode = workspaceRef.current;
    if (workspaceNode) {
      workspaceNode.addEventListener("wheel", handleWheel, { passive: true });
    }
    return () => {
      if (workspaceNode) {
        workspaceNode.removeEventListener("wheel", handleWheel);
      }
    };
  }, [activePage, totalPages, viewMode]);

  const handleZoomChange = (amount: number) => {
    setZoom((prev) => Math.max(25, Math.min(200, prev + amount)));
  };

  const handlePrevPage = () => {
    setDirection("prev");
    if (viewMode === "spread") {
      if (activePage > 2) {
        setActivePage(activePage - 2);
      } else if (activePage === 2) {
        setActivePage(1);
      }
    } else {
      if (activePage > 1) {
        setActivePage(activePage - 1);
      }
    }
  };

  const handleNextPage = () => {
    setDirection("next");
    if (viewMode === "spread") {
      if (activePage === 1) {
        setActivePage(2);
      } else if (activePage < totalPages - 1) {
        setActivePage(activePage + 2);
      }
    } else {
      if (activePage < totalPages) {
        setActivePage(activePage + 1);
      }
    }
  };

  // Click handler for page canvas selection
  const handlePageClick = (pageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPageId(pageId);
    setSelectedElementId(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePage, totalPages, viewMode]);

  // Margin CSS mapping
  const getMarginStyle = () => {
    switch (margins) {
      case "wide":
        return "top-[50px] bottom-[50px] left-[55px] right-[55px]";
      case "narrow":
        return "top-[25px] bottom-[25px] left-[30px] right-[30px]";
      default:
        return "top-[35px] bottom-[35px] left-[40px] right-[40px]";
    }
  };

  // Dynamic layout renderer
  const renderBookCanvas = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 max-h-[80vh] overflow-y-auto w-full max-w-5xl scrollbar-thin select-none">
          {doc.pages.map((page) => (
            <div
              key={page.id}
              onClick={() => {
                setViewMode("spread");
                setActivePage(page.id);
              }}
              className="group cursor-pointer flex flex-col items-center gap-2"
            >
              <div
                className="w-[140px] h-[190px] rounded-md shadow-lg border border-black/10 dark:border-neutral-700/30 overflow-hidden relative transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_10px_var(--accent-glow)]"
                style={{ backgroundColor: pageBgColor }}
              >
                {/* Visual miniature layout elements scaled down */}
                <div className="absolute inset-2 border border-black/5 opacity-50" />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-2 overflow-hidden pointer-events-none scale-[0.35] origin-center w-[390px] h-[480px] left-[-125px] top-[-145px]">
                  {page.elements.map((el) => {
                    if (el.type === "text") {
                      return (
                        <div
                          key={el.id}
                          className="text-[14px] leading-tight text-neutral-800 break-words opacity-70 line-clamp-10"
                          style={{
                            fontFamily: el.style.fontFamily === "Inter" ? "var(--font-inter)" : "inherit",
                          }}
                        >
                          {el.content}
                        </div>
                      );
                    }
                    if (el.type === "image") {
                      return (
                        <div key={el.id} className="w-full aspect-[4/3] bg-neutral-300 overflow-hidden border border-black/10 rounded-sm mb-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={el.content} alt="" className="w-full h-full object-cover" />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-neutral-500 dark:text-neutral-400">
                Page {page.id}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Determine current pages in view
    const leftPage = doc.pages.find((p) => p.id === activePage);
    const rightPage = viewMode === "spread" && activePage > 1
      ? doc.pages.find((p) => p.id === activePage + 1)
      : null;

    const isCover = activePage === 1;

    return (
      <motion.div
        className="relative group/book"
        style={{ 
          transformStyle: "preserve-3d", 
          backfaceVisibility: "hidden", 
          willChange: "transform" 
        }}
        animate={{ y: [-3, 3, -3] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
      >
        {/* Pages volume depth borders (stacked page edges) */}
        {!isCover && (
          <>
            <div
              className="absolute inset-x-2 -bottom-3 h-4 rounded-b-lg border border-neutral-700/10 shadow-lg transition-colors"
              style={{ backgroundColor: `${pageBgColor}ee`, transform: "scaleX(0.97)" }}
            />
            <div
              className="absolute inset-x-1 -bottom-2 h-3 rounded-b-md border border-neutral-700/20 shadow-md transition-colors"
              style={{ backgroundColor: `${pageBgColor}f3`, transform: "scaleX(0.985)" }}
            />
            <div
              className="absolute inset-x-0 -bottom-1 h-2 rounded-b-xs border border-neutral-700/30 shadow-xs transition-colors"
              style={{ backgroundColor: pageBgColor }}
            />

            {/* Left page depth (paper thickness stacked edges) */}
            {viewMode === "spread" && (
              <div 
                className="absolute -left-2 top-1 bottom-1 w-2 rounded-l-xs border-y border-l border-neutral-300/10 transition-colors shadow-[inset_-1px_0_1px_rgba(0,0,0,0.1)]"
                style={{ 
                  backgroundColor: pageBgColor,
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px)'
                }}
              />
            )}

            {/* Right page depth (paper thickness stacked edges) */}
            {viewMode === "spread" && (
              <div 
                className="absolute -right-2 top-1 bottom-1 w-2 rounded-r-xs border-y border-r border-neutral-300/10 transition-colors shadow-[inset_1px_0_1px_rgba(0,0,0,0.1)]"
                style={{ 
                  backgroundColor: pageBgColor,
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px)'
                }}
              />
            )}
          </>
        )}

        {/* Outer book container */}
        <div
          className="flex bg-[#2d1f18] dark:bg-neutral-950 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.04),_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25),_0_2px_4px_rgba(0,0,0,0.15)] border border-black/10 dark:border-neutral-800/25 relative z-10"
          style={{
            width: isCover || viewMode === "single" ? "390px" : "780px",
            height: "480px",
            borderRadius: "3px 4px 4px 3px",
            perspective: "2000px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{ transformStyle: "preserve-3d" }}
            className="flex w-full h-full relative"
          >
            {/* Left Page (Active Page) */}
            {leftPage && (
              <motion.div
                key={`left-page-${leftPage.id}`}
                initial={getLeftPageAnimation().initial}
                animate={getLeftPageAnimation().animate}
                transition={getLeftPageAnimation().transition}
                onClick={(e) => handlePageClick(leftPage.id, e)}
                className="w-full h-full book-paper-texture flex flex-col justify-between relative overflow-hidden select-none"
                style={{
                  backgroundColor: pageBgColor,
                  width: isCover || viewMode === "single" ? "390px" : "390px",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Ornate Frame Border (Theme specific) */}
                <div className={`absolute inset-4 pointer-events-none transition-all duration-500 ${bookTemplate.borders.borderStyle}`} />
                
                {/* Margin Area Guide Lines (dashed line during element editing) */}
                {selectedPageId === leftPage.id && !readingMode && (
                  <div className={`absolute border border-dashed border-[var(--accent-color)]/30 rounded-xs pointer-events-none ${getMarginStyle()}`} />
                )}

                {/* Elements Rendering Area */}
                <div className="relative w-full h-full p-6">
                  {leftPage.elements.map((el) => (
                    <EditorElement key={el.id} element={el} pageId={leftPage.id} />
                  ))}
                </div>

                {/* Left Page Number footer */}
                {showPageNumbers && (
                  <div className="text-center pb-3 text-neutral-500 font-mono text-[10px] font-bold z-20">
                    {leftPage.id}
                  </div>
                )}
              </motion.div>
            )}

            {/* Right Page (Active Page + 1, hidden if single or cover layout) */}
            {rightPage && viewMode === "spread" && !isCover && (
              <motion.div
                key={`right-page-${rightPage.id}`}
                initial={getRightPageAnimation().initial}
                animate={getRightPageAnimation().animate}
                transition={getRightPageAnimation().transition}
                onClick={(e) => handlePageClick(rightPage.id, e)}
                className="w-[390px] h-full book-paper-texture flex flex-col justify-between relative overflow-hidden select-none border-l border-black/5 dark:border-neutral-200/10"
                style={{
                  backgroundColor: pageBgColor,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Ornate Frame Border (Theme specific) */}
                <div className={`absolute inset-4 pointer-events-none transition-all duration-500 ${bookTemplate.borders.borderStyle}`} />

                {/* Margin Area Guide Lines */}
                {selectedPageId === rightPage.id && !readingMode && (
                  <div className={`absolute border border-dashed border-[var(--accent-color)]/30 rounded-xs pointer-events-none ${getMarginStyle()}`} />
                )}

                {/* Elements Area */}
                <div className="relative w-full h-full p-6">
                  {rightPage.elements.map((el) => (
                    <EditorElement key={el.id} element={el} pageId={rightPage.id} />
                  ))}
                </div>

                {/* Right Page Number */}
                {showPageNumbers && (
                  <div className="text-center pb-3 text-neutral-500 font-mono text-[10px] font-bold z-20">
                    {rightPage.id}
                  </div>
                )}
              </motion.div>
            )}

            {/* Spine shadows overlays */}
            {viewMode === "spread" && !isCover && (
              <>
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/15 via-black/35 to-black/15 shadow-inner pointer-events-none z-10" />
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-[0.5px] w-[1px] bg-black/5 dark:bg-white/5 pointer-events-none z-10" />
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={workspaceRef}
      className={`flex-1 flex flex-col items-center justify-between relative overflow-hidden select-none velora-workspace-light ${
        readingMode ? "p-0 h-screen w-screen bg-stone-100/98 dark:bg-[#070A0F]/95 z-50 fixed inset-0" : "p-6 h-[calc(100vh-4rem)]"
      }`}
    >
      {/* Glow Ambient behind book */}
      <div
        className="absolute w-[800px] h-[450px] rounded-full opacity-[0.12] filter blur-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-700 pointer-events-none z-0"
        style={{ backgroundColor: theme.accentColor }}
      />

      {/* Floating Toolbar controls (Hidden in reading mode) */}
      {!readingMode && (
        <div className="w-full max-w-4xl flex items-center justify-between px-4 py-2 rounded-full velora-capsule z-10 text-xs">
          {/* Left view toggles */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-black/30 p-0.5 rounded-lg border border-black/10 dark:border-white/5">
            <button
              onClick={() => setViewMode("single")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "single" ? "bg-white dark:bg-white/[0.08] text-neutral-850 dark:text-white shadow-sm dark:shadow-none" : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white"
              }`}
              title="Single Page View"
            >
              <Book size={13} />
            </button>
            <button
              onClick={() => setViewMode("spread")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "spread" ? "bg-white dark:bg-white/[0.08] text-neutral-850 dark:text-white shadow-sm dark:shadow-none" : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white"
              }`}
              title="Double Page Spread"
            >
              <BookOpen size={13} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white dark:bg-white/[0.08] text-neutral-850 dark:text-white shadow-sm dark:shadow-none" : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white"
              }`}
              title="Grid Overview"
            >
              <GridIcon size={13} />
            </button>
          </div>

          {/* Middle spread navigations */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevPage}
              disabled={activePage <= 1}
              className="p-1.5 rounded-lg border border-black/10 dark:border-white/5 text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer bg-white dark:bg-transparent"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="font-mono text-neutral-700 dark:text-neutral-300 font-semibold">
              {viewMode === "spread" && activePage > 1 ? `${activePage} — ${activePage + 1}` : activePage} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={viewMode === "spread" ? activePage >= totalPages - 1 : activePage >= totalPages}
              className="p-1.5 rounded-lg border border-black/10 dark:border-white/5 text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer bg-white dark:bg-transparent"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Right layout helpers (Page add/delete, zoom) */}
          <div className="flex items-center gap-4">
            {/* Page creation shortcuts */}
            <div className="flex items-center gap-1.5 border-r border-black/10 dark:border-white/10 pr-3">
              <button
                onClick={addPageSpread}
                className="flex items-center gap-1 text-neutral-550 dark:text-neutral-400 hover:text-neutral-850 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/5 p-1 rounded transition-colors cursor-pointer"
                title="Insert Page Spread"
              >
                <PlusCircle size={13} />
                <span>Page</span>
              </button>
              <button
                onClick={() => deletePageSpread(activePage)}
                disabled={totalPages <= 4}
                className="flex items-center gap-1 text-neutral-400 dark:text-neutral-550 hover:text-red-550 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 p-1 rounded transition-colors disabled:opacity-20 cursor-pointer"
                title="Delete Active Page Spread"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Zoom */}
            <div className="flex items-center border border-black/10 dark:border-white/5 rounded-lg bg-black/[0.02] dark:bg-black/20 overflow-hidden h-7">
              <button
                onClick={() => handleZoomChange(-25)}
                className="px-2 h-full flex items-center justify-center text-neutral-550 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <Minus size={11} />
              </button>
              <span className="w-12 text-center font-mono font-bold text-neutral-700 dark:text-neutral-300">
                {zoom}%
              </span>
              <button
                onClick={() => handleZoomChange(25)}
                className="px-2 h-full flex items-center justify-center text-neutral-550 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <Plus size={11} />
              </button>
            </div>
            <button
              onClick={() => {
                setReadingMode(true);
                setZoom(125);
              }}
              className="p-1.5 rounded-lg border border-black/10 dark:border-white/5 text-neutral-555 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              title="Reading Mode"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Book Canvas workspace */}
      <div className={`flex-1 w-full flex items-center justify-center overflow-auto z-10 ${readingMode ? "py-0" : "py-4"}`}>
        <div
          className="transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {renderBookCanvas()}
        </div>
      </div>

      {/* Reading Mode Exit Trigger */}
      {readingMode && (
        <button
          onClick={() => {
            setReadingMode(false);
            setZoom(100);
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-4 py-2 rounded-full flex items-center gap-1.5 shadow-2xl z-50 text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <EyeOff size={14} />
          <span>Exit Reading Mode</span>
        </button>
      )}

      {/* Navigation chevrons (Reading mode has larger overlays) */}
      <div className={`absolute inset-y-16 inset-x-8 flex items-center justify-between pointer-events-none z-30`}>
        <button
          onClick={handlePrevPage}
          disabled={activePage <= 1}
          className={`rounded-full bg-white/60 dark:bg-[#0E131B]/40 border border-black/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-white/95 dark:hover:bg-[#0E131B]/75 transition-all flex items-center justify-center shadow-lg pointer-events-auto hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
            readingMode ? "w-16 h-16 bg-white/90 dark:bg-neutral-900/80 border-black/10 dark:border-white/10" : "w-12 h-12"
          }`}
        >
          <ChevronLeft size={readingMode ? 28 : 20} />
        </button>

        <button
          onClick={handleNextPage}
          disabled={viewMode === "spread" ? activePage >= totalPages - 1 : activePage >= totalPages}
          className={`rounded-full bg-white/60 dark:bg-[#0E131B]/40 border border-black/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-white/95 dark:hover:bg-[#0E131B]/75 transition-all flex items-center justify-center shadow-lg pointer-events-auto hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
            readingMode ? "w-16 h-16 bg-white/90 dark:bg-neutral-900/80 border-black/10 dark:border-white/10" : "w-12 h-12"
          }`}
        >
          <ChevronRight size={readingMode ? 28 : 20} />
        </button>
      </div>

      {/* Footer info (Hidden in reading mode) */}
      {!readingMode && (
        <div className="w-full flex items-center justify-between text-[11px] text-neutral-500 font-mono px-4 mt-2">
          <span>Auto-saved just now</span>
          <div className="flex items-center gap-4">
            <span>784 words</span>
            <span>{totalPages} pages</span>
          </div>
        </div>
      )}
    </div>
  );
};
