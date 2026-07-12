"use client";

import React, { useRef } from "react";
import { useStudio } from "@/context/StudioContext";
import { ColorPicker } from "./ColorPicker";
import { CustomSelect } from "./CustomSelect";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  CaseSensitive,
  ChevronDown,
  Layers,
  ChevronUp,
  Columns,
  Sliders,
  Type,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  Image as ImageIcon,
  MousePointer
} from "lucide-react";

export const PropertiesPanel: React.FC = () => {
  const {
    theme,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    textAlign,
    setTextAlign,
    bold,
    setBold,
    italic,
    setItalic,
    underline,
    setUnderline,
    strikethrough,
    setStrikethrough,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    elementOpacity,
    setElementOpacity,
    elementLayer,
    setElementLayer,
    pageBgColor,
    setPageBgColor,
    showPageNumbers,
    setShowPageNumbers,
    margins,
    setMargins,
    selectedElementId,
    selectedPageId,
    document: doc,
    updateElement,
    deleteElement,
    arrangeElement,
    
    // Advanced properties
    textColor,
    setTextColor,
    wordSpacing,
    setWordSpacing,
    paragraphSpacing,
    setParagraphSpacing,
    dropCapEnabled,
    setDropCapEnabled,
    outlineColor,
    setOutlineColor,
    outlineWidth,
    setOutlineWidth,
    shapeType,
    setShapeType,
    borderColor,
    setBorderColor,
    borderWidth,
    setBorderWidth,
    borderRadius,
    setBorderRadius,
    backgroundColor,
    setBackgroundColor,
  } = useStudio();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fontOptions = [
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Cinzel (Fantasy)", value: "Cinzel" },
    { name: "Orbitron (Sci-Fi)", value: "Orbitron" },
    { name: "Creepster (Horror)", value: "Creepster" },
    { name: "Alex Brush (Romance)", value: "Alex Brush" },
    { name: "Special Elite (Adventure)", value: "Special Elite" },
    { name: "Cormorant Garamond", value: "Cormorant Garamond" },
    { name: "Fredoka (Children)", value: "Fredoka" },
    { name: "Inter Sans", value: "Inter" },
  ];

  const paperColors = [
    { name: "Cream Paper", value: "#F7F2E9" },
    { name: "Bright White", value: "#FFFFFF" },
    { name: "Aged Parchment", value: "#EFE6D5" },
    { name: "Soft Charcoal", value: "#E2E4E6" },
  ];

  // Retrieve active selected element data
  const selectedPage = doc.pages.find((p) => p.id === selectedPageId);
  const selectedElement = selectedPage?.elements.find((el) => el.id === selectedElementId);

  const handleFontSizeChange = (amount: number) => {
    setFontSize((prev) => Math.max(12, Math.min(72, prev + amount)));
  };

  const handleLineHeightChange = (amount: number) => {
    setLineHeight(parseFloat(Math.max(1.0, Math.min(2.5, lineHeight + amount)).toFixed(1)));
  };

  const handleLetterSpacingChange = (amount: number) => {
    setLetterSpacing(parseInt(Math.max(-2, Math.min(10, letterSpacing + amount)).toFixed(0)));
  };

  const handleReplaceImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedElementId && selectedPageId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateElement(selectedPageId, selectedElementId, {
            content: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[300px] h-[calc(100vh-4rem)] border-l border-black/5 dark:border-white/[0.04] p-4 overflow-y-auto space-y-4 select-none flex-shrink-0 z-10 scrollbar-thin lumora-glass">
      
      {selectedElement ? (
        <>
          {/* Active Element Info Badging */}
          <div className="p-3.5 bg-black/[0.01] dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.06] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)] font-mono text-xs font-bold">
                {selectedElement.type.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-neutral-800 dark:text-white uppercase tracking-wider">
                  {selectedElement.type} Block
                </span>
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono">
                  ID: {selectedElement.id.slice(0, 8)}
                </span>
              </div>
            </div>
            
            {/* Delete Element Shortcut */}
            <button
              onClick={() => deleteElement(selectedPageId!, selectedElement.id)}
              className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 text-neutral-500 dark:text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Delete Element"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* 1. TYPOGRAPHY PANEL (Show only if text block selected) */}
          {selectedElement.type === "text" && (
            <div className="glass-panel-light p-4 rounded-2xl space-y-3.5 border border-black/5 dark:border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-455 uppercase tracking-wider">
                <Type size={12} className="text-neutral-600 dark:text-neutral-400" />
                <span>Typography</span>
              </div>

              {/* Font Family */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Font Family</label>
                <CustomSelect
                  options={fontOptions.map((opt) => ({ value: opt.value, label: opt.name }))}
                  value={fontFamily}
                  onChange={(val) => setFontFamily(val)}
                />
              </div>

              {/* Font Size */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Size</label>
                <div className="flex items-center border border-black/10 dark:border-white/8 rounded-lg bg-white dark:bg-black/40 overflow-hidden h-9">
                  <button
                    onClick={() => handleFontSizeChange(-1)}
                    className="w-8 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors cursor-pointer text-sm"
                  >
                    —
                  </button>
                  <div className="flex-1 text-center text-xs font-mono font-bold text-neutral-800 dark:text-white">
                    {fontSize}px
                  </div>
                  <button
                    onClick={() => handleFontSizeChange(1)}
                    className="w-8 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors cursor-pointer text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Styles */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Styles</label>
                <div className="grid grid-cols-4 border border-black/10 dark:border-white/8 rounded-lg bg-white dark:bg-black/40 overflow-hidden p-0.5">
                  <button
                    onClick={() => setBold(!bold)}
                    className={`h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                      bold ? "bg-black/[0.04] dark:bg-white/[0.08] text-neutral-800 dark:text-white" : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <Bold size={13} className={bold ? "theme-transition" : ""} style={bold ? { color: theme.accentColor } : {}} />
                  </button>
                  <button
                    onClick={() => setItalic(!italic)}
                    className={`h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                      italic ? "bg-black/[0.04] dark:bg-white/[0.08] text-neutral-800 dark:text-white" : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <Italic size={13} className={italic ? "theme-transition" : ""} style={italic ? { color: theme.accentColor } : {}} />
                  </button>
                  <button
                    onClick={() => setUnderline(!underline)}
                    className={`h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                      underline ? "bg-black/[0.04] dark:bg-white/[0.08] text-neutral-800 dark:text-white" : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <Underline size={13} className={underline ? "theme-transition" : ""} style={underline ? { color: theme.accentColor } : {}} />
                  </button>
                  <button
                    onClick={() => setStrikethrough(!strikethrough)}
                    className={`h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                      strikethrough ? "bg-black/[0.04] dark:bg-white/[0.08] text-neutral-800 dark:text-white" : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <Strikethrough size={13} className={strikethrough ? "theme-transition" : ""} style={strikethrough ? { color: theme.accentColor } : {}} />
                  </button>
                </div>
              </div>

              {/* Alignment */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Alignment</label>
                <div className="grid grid-cols-4 border border-black/10 dark:border-white/8 rounded-lg bg-white dark:bg-black/40 overflow-hidden p-0.5">
                  {(["left", "center", "right", "justify"] as const).map((align) => {
                    const Icon = {
                      left: AlignLeft,
                      center: AlignCenter,
                      right: AlignRight,
                      justify: AlignJustify,
                    }[align];
                    const isSelected = textAlign === align;
                    return (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align)}
                        className={`h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-black/[0.04] dark:bg-white/[0.08] text-neutral-800 dark:text-white"
                            : "text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                        }`}
                      >
                        <Icon
                          size={14}
                          className={isSelected ? "theme-transition" : ""}
                          style={isSelected ? { color: theme.accentColor } : {}}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spacings */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Line Height</label>
                  <div className="flex items-center border border-black/10 dark:border-white/8 rounded-lg bg-white dark:bg-black/40 overflow-hidden h-8">
                    <button
                      onClick={() => handleLineHeightChange(-0.1)}
                      className="w-6 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-xs"
                    >
                      —
                    </button>
                    <div className="flex-1 text-center text-[11px] font-mono text-neutral-800 dark:text-white">
                      {lineHeight}
                    </div>
                    <button
                      onClick={() => handleLineHeightChange(0.1)}
                      className="w-6 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Letter Spacing</label>
                  <div className="flex items-center border border-black/10 dark:border-white/8 rounded-lg bg-white dark:bg-black/40 overflow-hidden h-8">
                    <button
                      onClick={() => handleLetterSpacingChange(-1)}
                      className="w-6 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-xs"
                    >
                      —
                    </button>
                    <div className="flex-1 text-center text-[11px] font-mono text-neutral-800 dark:text-white">
                      {letterSpacing}
                    </div>
                    <button
                      onClick={() => handleLetterSpacingChange(1)}
                      className="w-6 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Color Picker */}
              <div className="space-y-1 pt-2">
                <ColorPicker
                  label="Text Color"
                  value={textColor}
                  onChange={setTextColor}
                />
              </div>
              <div className="border-t border-black/5 dark:border-white/[0.04] pt-3 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">Advanced Layout</span>
                
                {/* Word & Paragraph Spacing */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Word Spacing</label>
                    <input
                      type="range"
                      min="-2"
                      max="10"
                      value={wordSpacing}
                      onChange={(e) => setWordSpacing(parseInt(e.target.value))}
                      className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                    />
                    <div className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 text-right">{wordSpacing}px</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Paragraph Spacing</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={paragraphSpacing}
                      onChange={(e) => setParagraphSpacing(parseInt(e.target.value))}
                      className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                    />
                    <div className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 text-right">{paragraphSpacing}px</div>
                  </div>
                </div>

                {/* Drop Cap Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-700 dark:text-neutral-300">Enable Drop Cap</span>
                  <button
                    onClick={() => setDropCapEnabled(!dropCapEnabled)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center cursor-pointer ${
                      dropCapEnabled ? "bg-[var(--accent-color)]" : "bg-neutral-300 dark:bg-neutral-800"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        dropCapEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Text Outline Settings */}
              <div className="border-t border-black/5 dark:border-white/[0.04] pt-3 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">Outline Effect</span>
                <ColorPicker
                  label="Outline Color"
                  value={outlineColor}
                  onChange={setOutlineColor}
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">Outline Width</label>
                    <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400">{outlineWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={outlineWidth}
                    onChange={(e) => setOutlineWidth(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. IMAGE SPECIFIC CONTROLS */}
          {selectedElement.type === "image" && (
            <div className="glass-panel-light p-4 rounded-2xl space-y-3.5 border border-black/5 dark:border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-455 uppercase tracking-wider">
                <ImageIcon size={12} className="text-neutral-600 dark:text-neutral-400" />
                <span>Image Settings</span>
              </div>
              <button
                onClick={handleReplaceImageClick}
                className="w-full py-2 bg-black/[0.02] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 hover:border-[var(--accent-color)] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Replace Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {/* 3. SHAPE SPECIFIC CONTROLS */}
          {selectedElement.type === "shape" && (
            <div className="glass-panel-light p-4 rounded-2xl space-y-3.5 border border-black/5 dark:border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-455 uppercase tracking-wider">
                <Sliders size={12} className="text-neutral-600 dark:text-neutral-400" />
                <span>Shape Inspector</span>
              </div>

              {/* Shape Type Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Shape Type</label>
                <CustomSelect
                  options={[
                    { value: "rectangle", label: "Rectangle" },
                    { value: "circle", label: "Circle" },
                    { value: "triangle", label: "Triangle" },
                    { value: "star", label: "Star Banner" },
                  ]}
                  value={shapeType}
                  onChange={(val) => setShapeType(val as any)}
                />
              </div>

              {/* Shape Fill Color Picker */}
              <ColorPicker
                label="Fill Color"
                value={backgroundColor}
                onChange={setBackgroundColor}
              />

              {/* Border Color Picker */}
              <ColorPicker
                label="Border Color"
                value={borderColor}
                onChange={setBorderColor}
              />

              {/* Border Width and Radius Sliders */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Border Width</label>
                    <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400">{borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-neutral-700 dark:text-neutral-300">Border Radius</label>
                    <span className="text-[9px] font-mono text-neutral-800 dark:text-neutral-200">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. ELEMENT GENERAL PROPERTIES (OPACITY & LAYERS) */}
          <div className="glass-panel-light p-4 rounded-2xl space-y-3.5 border border-black/5 dark:border-white/[0.05]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-455 uppercase tracking-wider">
              <Sliders size={12} className="text-neutral-600 dark:text-neutral-400" />
              <span>Layer & Actions</span>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-neutral-500 dark:text-neutral-400">Opacity</label>
                <span className="text-[10px] font-mono text-neutral-700 dark:text-neutral-300">{elementOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={elementOpacity}
                onChange={(e) => setElementOpacity(parseInt(e.target.value))}
                className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
              />
            </div>

            {/* Layer Depth arrangement controls */}
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Arrange Layer Depth</label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => arrangeElement("front")}
                  className="py-1.5 bg-white dark:bg-black/40 border border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded text-[10px] cursor-pointer font-medium"
                  title="Bring to Front"
                >
                  Front
                </button>
                <button
                  onClick={() => arrangeElement("forward")}
                  className="py-1.5 bg-white dark:bg-black/40 border border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded text-[10px] cursor-pointer font-medium"
                  title="Bring Forward"
                >
                  Up
                </button>
                <button
                  onClick={() => arrangeElement("backward")}
                  className="py-1.5 bg-white dark:bg-black/40 border border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded text-[10px] cursor-pointer font-medium"
                  title="Send Backward"
                >
                  Down
                </button>
                <button
                  onClick={() => arrangeElement("back")}
                  className="py-1.5 bg-white dark:bg-black/40 border border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded text-[10px] cursor-pointer font-medium"
                  title="Send to Back"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Lock / Hide Toggles */}
            <div className="flex items-center justify-between border-t border-black/5 dark:border-white/[0.06] pt-3">
              <div className="flex items-center gap-4">
                {/* Lock Toggle */}
                <button
                  onClick={() => updateElement(selectedPageId!, selectedElement.id, { locked: !selectedElement.locked })}
                  className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                    selectedElement.locked
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400"
                      : "bg-black/[0.02] dark:bg-white/5 border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                  }`}
                >
                  {selectedElement.locked ? <Lock size={10} /> : <Unlock size={10} />}
                  <span>{selectedElement.locked ? "Locked" : "Lock"}</span>
                </button>

                {/* Hide Toggle */}
                <button
                  onClick={() => updateElement(selectedPageId!, selectedElement.id, { hidden: !selectedElement.hidden })}
                  className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                    selectedElement.hidden
                      ? "bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400"
                      : "bg-black/[0.02] dark:bg-white/5 border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                  }`}
                >
                  {selectedElement.hidden ? <EyeOff size={10} /> : <Eye size={10} />}
                  <span>{selectedElement.hidden ? "Hidden" : "Hide"}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty element select instructions */
        <div className="p-5 border border-dashed border-black/10 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-center py-8 bg-transparent">
          <MousePointer size={24} className="text-neutral-600 dark:text-neutral-450 mb-2 animate-pulse" />
          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-semibold mb-1">No Element Selected</span>
          <p className="text-[10px] text-neutral-700 dark:text-neutral-300 leading-normal">
            Click on any heading, paragraph, image, or shape on the book pages to unlock visual configuration options here.
          </p>
        </div>
      )}

      {/* 4. PAGE CONTROLS (ALWAYS VISIBLE) */}
      <div className="glass-panel-light p-4 rounded-2xl space-y-3.5 border border-black/5 dark:border-white/[0.05]">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-455 uppercase tracking-wider">
          <Columns size={12} className="text-neutral-600 dark:text-neutral-400" />
          <span>Page Setup</span>
        </div>

        {/* Page Background colors */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-neutral-700 dark:text-neutral-300">Paper Tint Color</label>
          <div className="flex items-center justify-between gap-1.5">
            {paperColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setPageBgColor(color.value)}
                className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                  pageBgColor === color.value
                    ? "border-[var(--accent-color)] scale-110 shadow-sm"
                    : "border-black/10 dark:border-white/10 hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Page Margins options */}
        <div className="space-y-1">
          <label className="text-[10px] text-neutral-700 dark:text-neutral-300">Margins</label>
          <CustomSelect
            options={[
              { value: "normal", label: "Normal" },
              { value: "wide", label: "Wide" },
              { value: "narrow", label: "Narrow" },
            ]}
            value={margins}
            onChange={(val) => setMargins(val as any)}
          />
        </div>

        {/* Page Number Toggle switch */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-neutral-700 dark:text-neutral-300">Page Numbers</span>
          <button
            onClick={() => setShowPageNumbers(!showPageNumbers)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center cursor-pointer ${
              showPageNumbers ? "bg-[var(--accent-color)]" : "bg-neutral-300 dark:bg-neutral-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                showPageNumbers ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
