"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStudio } from "@/context/StudioContext";
import { CustomSelect } from "./CustomSelect";
import { ElementType } from "@/types/editor";
import {
  PagesIcon,
  TemplatesIcon,
  TypographyIcon,
  AssetsIcon,
  BookmarksIcon,
  HistoryIcon,
  PublishIcon,
  LibraryIcon,
  ElementsIcon,
  SettingsIcon
} from "./CustomIcons";
import {
  Layers,
  BookOpen,
  Image as ImageIcon,
  Palette,
  Grid,
  CaseSensitive,
  Settings,
  Search,
  SlidersHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  FolderOpen,
  Type,
  Layout,
  Book,
  Maximize2,
  Sparkles,
  Orbit,
  Skull,
  Heart,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WORKSPACE_THEMES, BOOK_TEMPLATES } from "@/constants/themes";

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

export const Sidebar: React.FC = () => {
  const {
    theme,
    workspaceThemeId,
    setWorkspaceThemeId,
    bookTemplateId,
    setBookTemplateId,
    activePage,
    setActivePage,
    activeTab,
    setActiveTab,
    collapsed,
    setCollapsed,
    document: doc,
    addElement,
    addPageSpread,
    assets,
    addAsset,
    selectedPageId,
    setSelectedPageId,
    setFontFamily,
    setFontSize,
    pageTurnAnimation,
    setPageTurnAnimation,
    viewMode,
  } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");
  const [bookDimensions, setBookDimensions] = useState("US Trade (6\" x 9\")");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const spreadRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const navigationTabs = [
    { id: "pages", label: "Pages", icon: PagesIcon },
    { id: "chapters", label: "Chapters", icon: BookmarksIcon },
    { id: "assets", label: "Assets", icon: AssetsIcon },
    { id: "themes", label: "Themes", icon: TemplatesIcon },
    { id: "elements", label: "Elements", icon: ElementsIcon },
    { id: "textstyle", label: "Text Style", icon: TypographyIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  // Group pages dynamically into spreads for thumbnail navigation
  // Page 1 is single cover, then 2-3, 4-5, etc.
  const spreads: { leftId: number; rightId: number | null; name: string }[] = [];
  
  if (doc.pages.length > 0) {
    // Page 1: Single Cover
    spreads.push({
      leftId: 1,
      rightId: null,
      name: doc.pages[0].title || "Cover Page"
    });

    // Subsenquent page spreads
    for (let i = 1; i < doc.pages.length; i += 2) {
      const leftPage = doc.pages[i];
      const rightPage = doc.pages[i + 1] || null;
      const chapter = leftPage.chapterTitle || rightPage?.chapterTitle || "";
      spreads.push({
        leftId: leftPage.id,
        rightId: rightPage ? rightPage.id : null,
        name: chapter ? `Ch: ${chapter}` : `Spread ${leftPage.id}-${rightPage ? rightPage.id : ""}`
      });
    }
  }

  const filteredSpreads = spreads.filter((spread) =>
    spread.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const activeSpread = spreads.find(
      (s) => s.leftId === activePage || s.rightId === activePage
    );
    if (activeSpread) {
      const refKey = `spread-${activeSpread.leftId}`;
      const element = spreadRefs.current[refKey];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activePage, spreads]);

  const handleTabClick = (tabId: string) => {
    if (activeTab === tabId && !collapsed) {
      setCollapsed(true);
    } else {
      setActiveTab(tabId);
      setCollapsed(false);
    }
  };

  // Image Upload helper
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addAsset(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertAsset = (assetUrl: string) => {
    const targetPage = selectedPageId || activePage;
    addElement(targetPage, "image", assetUrl);
  };

  const handleInsertElement = (type: ElementType, defaultText?: string) => {
    const targetPage = selectedPageId || activePage;
    addElement(targetPage, type, defaultText);
  };

  // Get list of chapters dynamically
  const chapters = doc.pages.filter((page) => page.chapterNumber !== undefined && page.chapterTitle);

  const isChapterActive = (chId: number) => {
    if (viewMode === "single") {
      return activePage === chId;
    }
    // Spread view mode
    if (chId === 1) {
      return activePage === 1;
    }
    if (chId % 2 === 0) {
      return activePage === chId || activePage === chId - 1;
    } else {
      return activePage === chId - 1 || activePage === chId;
    }
  };

  return (
    <div className="flex select-none z-20 relative">
      {/* 1. Far Left Icon Bar */}
      <div className="w-16 h-[calc(100vh-4rem)] border-r border-black/5 dark:border-white/[0.04] flex flex-col justify-between items-center py-4 flex-shrink-0 z-20 velora-ceramic">
        <div className="flex flex-col gap-3 w-full">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !collapsed;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative w-full h-12 flex items-center justify-center group transition-colors cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 w-0.5 h-8 rounded-r-md theme-transition"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                )}

                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-black/[0.04] dark:bg-white/[0.05] text-neutral-800 dark:text-white shadow-inner"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]"
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: `${theme.accentColor}20`,
                          boxShadow: `inset 0 0 10px ${theme.accentGlow}`,
                        }
                      : {}
                  }
                >
                  <Icon
                    size={18}
                    className="theme-transition"
                    style={isActive ? { color: theme.accentColor } : {}}
                  />
                </div>

                <div className="absolute left-[70px] bg-white dark:bg-[#11161F] border border-black/5 dark:border-white/10 text-neutral-800 dark:text-neutral-200 text-xs px-2.5 py-1 rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 scale-90 origin-left group-hover:scale-100 whitespace-nowrap z-30">
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-black/5 dark:border-white/[0.05] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-all cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* 2. Sliding Panel Content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="h-[calc(100vh-4rem)] border-r border-black/5 dark:border-white/[0.04] overflow-hidden flex flex-col flex-shrink-0 z-10 velora-glass"
          >
            {/* Pages Tab Panel */}
            {activeTab === "pages" && (
              <div className="flex flex-col h-full w-[280px]">
                <div className="p-4 border-b border-black/5 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider font-poppins">
                    Pages
                  </span>
                  <button className="p-1.5 rounded-lg border border-black/5 dark:border-white/[0.06] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <SlidersHorizontal size={13} />
                  </button>
                </div>

                <div className="px-4 py-3">
                  <div className="relative w-full">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs glass-input text-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                </div>

                {/* Dynamic Page thumbnails lists */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 scrollbar-thin">
                  {filteredSpreads.map((spread, idx) => {
                    const isLeftSelected = activePage === spread.leftId;
                    const isRightSelected = spread.rightId !== null && activePage === spread.rightId;
                    const isSelected = isLeftSelected || isRightSelected;
                    
                    const leftPageData = doc.pages.find(p => p.id === spread.leftId);
                    const rightPageData = spread.rightId ? doc.pages.find(p => p.id === spread.rightId) : null;

                    return (
                      <div
                        key={spread.leftId}
                        ref={(el) => {
                          spreadRefs.current[`spread-${spread.leftId}`] = el;
                        }}
                        onClick={() => setActivePage(spread.leftId)}
                        className={`group p-2.5 rounded-xl cursor-pointer transition-all duration-300 relative border ${
                          isSelected
                            ? "bg-black/[0.02] dark:bg-white/[0.04] border-[var(--accent-color)] shadow-[0_0_12px_var(--accent-glow)]"
                            : "bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/[0.05] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-black/10 dark:hover:border-white/10"
                        }`}
                      >
                        {/* Selected Book Spine Motif Edge */}
                        {isSelected && (
                          <div 
                            className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md theme-transition" 
                            style={{ 
                              backgroundColor: theme.accentColor,
                              boxShadow: `0 0 8px ${theme.accentColor}`,
                              backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 5px)'
                            }} 
                          />
                        )}
                        {isSelected && (
                          <div
                            className="absolute inset-0 rounded-xl opacity-[0.03] filter blur-md theme-transition"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                        )}

                        {/* Miniature spread page view */}
                        <div className="relative w-full h-[110px] velora-glass rounded-lg flex items-center justify-center p-2 mb-2 border border-black/10 dark:border-white/[0.08] group-hover:border-black/15 dark:group-hover:border-white/15 transition-colors overflow-hidden">
                          <div className="flex w-[160px] h-[90px] shadow-md rounded-sm relative overflow-hidden bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08]">
                            {/* Page Left */}
                            {leftPageData && (
                              <div className="w-1/2 h-full bg-[#F7F2E9] border-r border-black/10 flex flex-col p-1 justify-between relative">
                                {/* Miniature elements */}
                                <div className="relative w-full h-full scale-[0.25] origin-top-left w-[195px] h-[240px] pointer-events-none">
                                  {leftPageData.elements.map((el) => (
                                    <div
                                      key={el.id}
                                      className={`absolute ${
                                        el.type === "image"
                                          ? "bg-amber-900/20 border border-amber-900/40 rounded-xs"
                                          : el.type === "shape"
                                            ? "bg-[#D4AF37]"
                                            : "bg-neutral-600/30"
                                      }`}
                                      style={{
                                        left: `${el.x / 2}px`,
                                        top: `${el.y / 2}px`,
                                        width: `${el.width / 2}px`,
                                        height: `${el.height / 2}px`,
                                      }}
                                    />
                                  ))}
                                </div>
                                <div className="text-[5px] text-neutral-400 font-mono text-center">
                                  {leftPageData.id}
                                </div>
                              </div>
                            )}

                            {/* Page Right (Show only if spread) */}
                            <div className="w-1/2 h-full bg-[#F7F2E9] flex flex-col p-1 justify-between relative">
                              {rightPageData ? (
                                <>
                                  <div className="relative w-full h-full scale-[0.25] origin-top-left w-[195px] h-[240px] pointer-events-none">
                                    {rightPageData.elements.map((el) => (
                                      <div
                                        key={el.id}
                                        className={`absolute ${
                                          el.type === "image"
                                            ? "bg-amber-900/20 border border-amber-900/40 rounded-xs"
                                            : el.type === "shape"
                                              ? "bg-[#D4AF37]"
                                              : "bg-neutral-600/30"
                                        }`}
                                        style={{
                                          left: `${el.x / 2}px`,
                                          top: `${el.y / 2}px`,
                                          width: `${el.width / 2}px`,
                                          height: `${el.height / 2}px`,
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-[5px] text-neutral-400 font-mono text-center">
                                    {rightPageData.id}
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-stone-300 dark:bg-neutral-800 flex items-center justify-center">
                                  <span className="text-[5px] text-neutral-500">END</span>
                                </div>
                              )}
                            </div>

                            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-r from-black/20 via-black/40 to-black/20 shadow-xs" />
                          </div>

                          <div className="absolute inset-0 bg-black/30 dark:bg-[#0B0F15]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-white font-medium bg-neutral-900/80 px-2 py-1 rounded border border-white/10">
                              Edit Spread
                            </span>
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="flex items-center justify-between text-xs px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-neutral-500 font-mono font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-neutral-700 dark:text-neutral-200 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate max-w-[150px]">
                              {spread.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {spread.leftId}{spread.rightId ? `-${spread.rightId}` : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-black/5 dark:border-white/[0.06] bg-transparent">
                  <button
                    onClick={addPageSpread}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-black/15 dark:border-white/15 hover:border-[var(--accent-color)] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-all text-xs cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Page Spread</span>
                  </button>
                </div>
              </div>
            )}

            {/* Chapters Tab Panel */}
            {activeTab === "chapters" && (
              <div className="flex flex-col h-full w-[280px] p-4">
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider font-poppins mb-4">
                  Chapters
                </span>
                <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
                  {chapters.map((ch) => {
                    const isActive = isChapterActive(ch.id);
                    return (
                      <div
                        key={ch.id}
                        onClick={() => {
                          if (ch.id === 1) {
                            setActivePage(1);
                          } else if (ch.id % 2 === 0) {
                            setActivePage(ch.id);
                          } else {
                            setActivePage(ch.id - 1);
                          }
                        }}
                        className={`p-3 rounded-xl flex items-center justify-between cursor-pointer border transition-colors ${
                          isActive
                            ? "bg-black/[0.02] dark:bg-white/[0.03] border-[var(--accent-color)] text-neutral-800 dark:text-white"
                            : "bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/[0.05] text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-poppins">
                          <FileText
                            size={14}
                            className={isActive ? "text-[var(--accent-color)]" : "text-neutral-500"}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">
                              Chapter {ch.chapterNumber}: {ch.chapterTitle}
                            </span>
                            <span className="text-[10px] text-neutral-500">Page {ch.id}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assets Tab Panel */}
            {activeTab === "assets" && (
              <div className="flex flex-col h-full w-[280px] p-4">
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider font-poppins mb-2">
                  Assets
                </span>
                <p className="text-[11px] text-neutral-500 mb-4">
                  Upload illustrations, photos, and icons to insert into your pages.
                </p>

                {/* Upload File button */}
                <div
                  onClick={handleUploadClick}
                  className="border border-dashed border-black/10 dark:border-2 dark:border-white/10 rounded-xl p-6 text-center mb-4 flex flex-col items-center justify-center hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors cursor-pointer bg-transparent"
                >
                  <Upload size={18} className="text-neutral-400 mb-2" />
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">Upload Media</span>
                  <span className="text-[10px] text-neutral-500 mt-1">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin">
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider block mb-2">
                    Media Library
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {assets.map((assetUrl, i) => (
                      <div
                        key={i}
                        onClick={() => handleInsertAsset(assetUrl)}
                        className="aspect-square bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-lg relative overflow-hidden group cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={assetUrl}
                          alt="Asset thumbnail"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[9px] text-white bg-neutral-950/80 px-1.5 py-0.5 rounded">
                            Insert
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Themes Tab Panel */}
            {activeTab === "themes" && (
              <div className="flex flex-col h-full w-[280px] p-4 overflow-y-auto scrollbar-thin select-none">
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider font-poppins mb-4">
                  Theme & Template
                </span>

                {/* 1. Workspace Theme Selection */}
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                    Workspace Accent
                  </span>
                  <p className="text-[9.5px] text-neutral-500 mb-3 leading-normal">
                    Applies color accents to the editor panels, selection outlines, and glows.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(WORKSPACE_THEMES).map((wt) => {
                      const isActive = workspaceThemeId === wt.id;
                      return (
                        <button
                          key={wt.id}
                          onClick={() => setWorkspaceThemeId(wt.id)}
                          className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-medium transition-all text-left cursor-pointer ${
                            isActive
                              ? "bg-black/[0.02] dark:bg-white/[0.04] border-[var(--accent-color)] text-neutral-800 dark:text-white shadow-[0_0_8px_var(--accent-glow)]"
                              : "bg-transparent border-black/5 dark:border-white/[0.05] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/35 flex-shrink-0"
                            style={{ backgroundColor: wt.accentColor }}
                          />
                          <span className="truncate">{wt.name.split(" ")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Book Design Template Selection */}
                <div className="border-t border-black/5 dark:border-white/[0.06] pt-4 pb-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                    Book Template Style
                  </span>
                  <p className="text-[9.5px] text-neutral-500 mb-3 leading-normal">
                    Dictates layout margins, fonts, frames, and background paper tint.
                  </p>

                  <div className="space-y-2.5">
                    {Object.values(BOOK_TEMPLATES).map((bt) => {
                      const isActive = bookTemplateId === bt.id;
                      const Icon = IconMap[bt.category] || Sparkles;
                      const palette = [
                        bt.colors.accent,
                        bt.colors.textDark,
                        bt.colors.paperTint
                      ];
                      return (
                        <div
                          key={bt.id}
                          onClick={() => setBookTemplateId(bt.id)}
                          className={`p-3.5 rounded-[18px] border cursor-pointer transition-all relative group/card flex gap-3 overflow-hidden select-none ${
                            isActive
                              ? "bg-black/[0.02] dark:bg-white/[0.03] border-[var(--accent-color)] shadow-[0_0_16px_var(--accent-glow)]"
                              : "bg-transparent border-black/5 dark:border-white/[0.04] hover:bg-black/[0.01] dark:hover:bg-white/[0.02] hover:border-black/10 dark:hover:border-white/10 hover:-translate-y-0.5"
                          }`}
                        >
                          {/* Mini book mockup */}
                          <div className="w-10 h-14 relative flex-shrink-0 [perspective:300px] mt-0.5">
                            {/* Paper stack depth */}
                            <div 
                              className="absolute right-0.5 top-0.5 bottom-0.5 w-1.5 bg-neutral-200 rounded-r shadow-xs transition-transform duration-300 origin-left group-hover/card:scale-x-125"
                              style={{ backgroundColor: bt.colors.paperTint }}
                            />
                            {/* Hardcover Spine */}
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-sm bg-neutral-900 border-r border-black/30 z-10 shadow-md transition-transform duration-300"
                              style={{ 
                                backgroundColor: bt.colors.accent,
                                backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(255,255,255,0.15) 60%, rgba(0,0,0,0.4) 100%)'
                              }}
                            />
                            {/* Cover page */}
                            <div 
                              className="absolute left-2.5 right-1 top-0 bottom-0 rounded-r-xs bg-neutral-800 border-l border-white/10 z-10 transition-transform duration-300 origin-left [transform-style:preserve-3d] group-hover/card:[transform:rotateY(-20deg)] shadow-sm flex flex-col justify-between p-1 overflow-hidden"
                              style={{ backgroundColor: bt.colors.accent }}
                            >
                              {/* Ornate border preview */}
                              <div className="w-full h-full border-[0.5px] border-white/20 rounded-xs flex flex-col justify-between p-0.5">
                                <span className="text-[4px] font-bold text-white/80 font-poppins leading-none truncate block">
                                    {bt.name.split(" ")[0]}
                                </span>
                                <div className="flex gap-[1px] justify-center">
                                  <div className="w-1 h-1 rounded-full bg-white/25" />
                                  <div className="w-1 h-1 rounded-full bg-white/25" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[11px] font-bold text-neutral-800 dark:text-white font-poppins tracking-wide truncate">
                                  {bt.name}
                                </span>
                                <Icon
                                  size={11}
                                  className="theme-transition"
                                  style={{ color: isActive ? theme.accentColor : "#A3A3A3" }}
                                />
                              </div>
                              
                              <p className="text-[9px] text-neutral-400 leading-normal line-clamp-2">
                                {bt.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-1.5">
                              {/* Palette dots */}
                              <div className="flex gap-1">
                                {palette.map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full border border-black/35"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>

                              {/* Selection circle */}
                              <div
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                  isActive
                                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]"
                                    : "border-neutral-700 bg-transparent group-hover/card:border-neutral-500"
                                }`}
                              >
                                {isActive && (
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {/* Elements Tab Panel */}
            {activeTab === "elements" && (
              <div className="flex flex-col h-full w-[280px] p-4">
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider font-poppins mb-4">
                  Elements
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleInsertElement("text", "New Chapter Title")}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 hover:border-[var(--accent-color)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <Layout size={18} className="text-neutral-400 mb-1" />
                    <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">Headings</span>
                  </button>
                  <button
                    onClick={() => handleInsertElement("text", "Once upon a time...")}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 hover:border-[var(--accent-color)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <Type size={18} className="text-neutral-400 mb-1" />
                    <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">Body Block</span>
                  </button>
                  <button
                    onClick={() => handleInsertElement("shape")}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 hover:border-[var(--accent-color)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <Grid size={18} className="text-neutral-400 mb-1" />
                    <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">Shapes</span>
                  </button>
                  <button
                    onClick={() => handleInsertElement("text", "“Quote Block”")}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 hover:border-[var(--accent-color)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <Book size={18} className="text-neutral-400 mb-1" />
                    <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">Quotes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Text Style Tab Panel */}
            {activeTab === "textstyle" && (
              <div className="flex flex-col h-full w-[280px] p-4">
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider font-poppins mb-4">
                  Text Presets
                </span>
                <div className="space-y-3">
                  <div
                    onClick={() => {
                      setFontFamily("Cinzel");
                      setFontSize(48);
                    }}
                    className="p-3 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-xl hover:border-[var(--accent-color)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer"
                  >
                    <span className="text-xs text-neutral-400 block mb-1 font-mono">Book Title Heading</span>
                    <span className="text-lg font-cinzel text-neutral-900 dark:text-white">THE LOST KINGDOM</span>
                  </div>
                  <div
                    onClick={() => {
                      setFontFamily("Playfair Display");
                      setFontSize(32);
                    }}
                    className="p-3 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-xl hover:border-[var(--accent-color)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer"
                  >
                    <span className="text-xs text-neutral-400 block mb-1 font-mono">Chapter Heading</span>
                    <span className="text-base font-playfair text-neutral-900 dark:text-white">Chapter I: The Beginning</span>
                  </div>
                  <div
                    onClick={() => {
                      setFontFamily("Cormorant Garamond");
                      setFontSize(18);
                    }}
                    className="p-3 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-xl hover:border-[var(--accent-color)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer"
                  >
                    <span className="text-xs text-neutral-400 block mb-1 font-mono">Body Prose</span>
                    <span className="text-[13px] font-cormorant text-neutral-700 dark:text-neutral-200 leading-normal block">
                      In the ancient land of Eldoria, where mountains kissed the clouds...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab Panel */}
            {activeTab === "settings" && (
              <div className="flex flex-col h-full w-[280px] p-4 space-y-4">
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider font-poppins">
                  Book Settings
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      Book Dimensions
                    </label>
                    <CustomSelect
                      options={[
                        { value: "US Trade (6\" x 9\")", label: "US Trade (6\" x 9\")" },
                        { value: "Novel Standard (5\" x 8\")", label: "Novel Standard (5\" x 8\")" },
                        { value: "A5 Standard (5.83\" x 8.27\")", label: "A5 Standard (5.83\" x 8.27\")" },
                        { value: "Square (8\" x 8\")", label: "Square (8\" x 8\")" },
                      ]}
                      value={bookDimensions}
                      onChange={setBookDimensions}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      Page Turn Animation
                    </label>
                    <CustomSelect
                      options={[
                        { value: "page-flip", label: "Book Flip" },
                        { value: "side-fade", label: "Side Fade" },
                        { value: "horizontal-slide", label: "Horizontal Slide" },
                        { value: "classic-dissolve", label: "Classic Dissolve" },
                        { value: "zoom-reveal", label: "Zoom & Reveal" },
                      ]}
                      value={pageTurnAnimation}
                      onChange={setPageTurnAnimation}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      Publication Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-black/10 dark:border-white/10 rounded-lg text-center cursor-pointer bg-black/[0.01] dark:bg-white/[0.02]">
                        <span className="text-xs text-neutral-800 dark:text-white block">Digital (Web)</span>
                        <span className="text-[9px] text-neutral-500">Interactive</span>
                      </div>
                      <div className="p-2 border border-black/5 dark:border-white/5 rounded-lg text-center cursor-pointer opacity-50">
                        <span className="text-xs text-neutral-500 dark:text-neutral-300 block">Print (PDF)</span>
                        <span className="text-[9px] text-neutral-500">High-Res</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
