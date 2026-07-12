"use client";

import React, { useState, useRef, useEffect } from "react";
import { PageElement } from "@/types/editor";
import { useStudio } from "@/context/StudioContext";
import { RotateCw, Lock, Trash2 } from "lucide-react";

interface EditorElementProps {
  element: PageElement;
  pageId: number;
}

export const EditorElement: React.FC<EditorElementProps> = ({ element, pageId }) => {
  const {
    selectedElementId,
    setSelectedElementId,
    setSelectedPageId,
    updateElement,
    deleteElement,
    zoom,
    paginatePageText,
    readingMode,
  } = useStudio();

  const isSelected = !readingMode && selectedElementId === element.id;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Local drag/resize/rotate trackers
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, elW: 0, elH: 0 });
  const rotateStart = useRef({ cx: 0, cy: 0, startAngle: 0, elRot: 0 });

  // Select element on click
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (readingMode) return;
    if (element.locked) return;
    setSelectedElementId(element.id);
    setSelectedPageId(pageId);
  };

  // Drag element handler
  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (readingMode || element.locked || isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedElementId(element.id);
    setSelectedPageId(pageId);

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const zoomFactor = zoom / 100;
      const dx = (moveEvent.clientX - dragStart.current.x) / zoomFactor;
      const dy = (moveEvent.clientY - dragStart.current.y) / zoomFactor;

      updateElement(pageId, element.id, {
        x: Math.round(dragStart.current.elX + dx),
        y: Math.round(dragStart.current.elY + dy),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Resize element handler
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      elW: element.width,
      elH: element.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const zoomFactor = zoom / 100;
      const dw = (moveEvent.clientX - resizeStart.current.x) / zoomFactor;
      const dh = (moveEvent.clientY - resizeStart.current.y) / zoomFactor;

      updateElement(pageId, element.id, {
        width: Math.max(20, Math.round(resizeStart.current.elW + dw)),
        height: Math.max(20, Math.round(resizeStart.current.elH + dh)),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Rotate element handler
  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);

    rotateStart.current = {
      cx,
      cy,
      startAngle,
      elRot: element.rotation,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - rotateStart.current.cx;
      const dy = moveEvent.clientY - rotateStart.current.cy;
      const angle = Math.atan2(dy, dx);
      
      let deg = Math.round(
        rotateStart.current.elRot + ((angle - rotateStart.current.startAngle) * 180) / Math.PI
      );
      
      deg = (deg + 360) % 360;

      updateElement(pageId, element.id, { rotation: deg });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Inline text editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (readingMode) return;
    if (element.type === "text" && !element.locked) {
      setIsEditing(true);
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(textRef.current);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 50);
    }
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
      const newText = textRef.current.innerText || "";
      updateElement(pageId, element.id, { content: newText });

      // Run auto-pagination check on text blur
      const scrollHeight = textRef.current.scrollHeight;
      const clientHeight = element.height;
      if (scrollHeight > clientHeight) {
        paginatePageText(pageId, element.id, newText, scrollHeight, clientHeight);
      }
    }
  };

  // Dynamic Typography styling calculations
  const getStyleObject = () => {
    const isHeading =
      element.id.includes("title") ||
      element.id.includes("num") ||
      element.id.includes("header") ||
      element.id.includes("hdr");
    
    // Default body text to dark charcoal, and headings slightly darker for extreme readability
    const defaultColor = isHeading ? "#111111" : "#2C2C2C";

    let displayFontSize = element.style.fontSize;
    if (displayFontSize && (element.style.superscript || element.style.subscript)) {
      displayFontSize = Math.round(displayFontSize * 0.7);
    }

    const style: React.CSSProperties = {
      opacity: element.opacity / 100,
      fontFamily: element.style.fontFamily === "Inter" ? "var(--font-inter)" : "inherit",
      fontSize: displayFontSize ? `${displayFontSize}px` : undefined,
      fontWeight: element.style.fontWeight || "normal",
      fontStyle: element.style.fontStyle || "normal",
      textDecoration: element.style.textDecoration || "none",
      textAlign: element.style.textAlign || "justify",
      lineHeight: element.style.lineHeight || 1.6,
      letterSpacing: element.style.letterSpacing ? `${element.style.letterSpacing}px` : undefined,
      wordSpacing: element.style.wordSpacing ? `${element.style.wordSpacing}px` : undefined,
      color: element.style.color || defaultColor,
      backgroundColor: element.style.backgroundFill || "transparent",
      fontVariant: element.style.smallCaps ? "small-caps" : "normal",
      verticalAlign: element.style.superscript ? "super" : element.style.subscript ? "sub" : "baseline",
      paddingBottom: element.style.paragraphSpacing ? `${element.style.paragraphSpacing}px` : undefined,
      textShadow: element.style.textShadow || undefined,
    };

    if (element.style.outlineWidth && element.style.outlineColor) {
      style.WebkitTextStroke = `${element.style.outlineWidth}px ${element.style.outlineColor}`;
    }

    return style;
  };

  const getShapeStyle = (): React.CSSProperties => {
    const shapeStyle: React.CSSProperties = {
      backgroundColor: element.style.backgroundColor || "#D4AF37",
      borderColor: element.style.borderColor || "transparent",
      borderWidth: element.style.borderWidth || 0,
      borderStyle: element.style.borderWidth ? "solid" : "none",
      borderRadius:
        element.style.shapeType === "circle"
          ? "50%"
          : element.style.borderRadius
          ? `${element.style.borderRadius}px`
          : undefined,
      boxShadow: element.style.boxShadow || undefined,
      opacity: element.opacity / 100,
    };

    if (element.style.shapeType === "triangle") {
      shapeStyle.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
    } else if (element.style.shapeType === "star") {
      shapeStyle.clipPath =
        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    }

    return shapeStyle;
  };

  const getImageStyle = (): React.CSSProperties => {
    return {
      opacity: element.opacity / 100,
      boxShadow: element.style.boxShadow || undefined,
      borderColor: element.style.borderColor || "transparent",
      borderWidth: element.style.borderWidth ? `${element.style.borderWidth}px` : undefined,
      borderStyle: element.style.borderWidth ? "solid" : "none",
      borderRadius: element.style.borderRadius ? `${element.style.borderRadius}px` : undefined,
    };
  };

  // Render content depending on element type
  const renderContent = () => {
    if (element.hidden) return null;

    switch (element.type) {
      case "text": {
        const textContent = element.content || "";
        const hasDropCap = element.style.dropCapEnabled && textContent.length > 0;
        
        return (
          <div
            ref={textRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={handleTextBlur}
            onInput={() => {
              if (textRef.current) {
                const scrollHeight = textRef.current.scrollHeight;
                const clientHeight = element.height;
                if (scrollHeight > clientHeight) {
                  textRef.current.style.outline = "1px dashed #FF1744";
                } else {
                  textRef.current.style.outline = "none";
                }
              }
            }}
            style={getStyleObject()}
            className={`w-full h-full outline-hidden whitespace-pre-wrap break-words overflow-hidden ${
              isEditing ? "cursor-text select-text" : "cursor-default select-none"
            }`}
          >
            {!isEditing && hasDropCap && (
              <span className="float-left text-4xl font-bold mr-2 mt-1 text-[var(--accent-color)] leading-none select-none">
                {textContent.charAt(0)}
              </span>
            )}
            {isEditing ? textContent : hasDropCap ? textContent.slice(1) : textContent}
          </div>
        );
      }
      case "image":
        return (
          <div
            className="w-full h-full relative overflow-hidden pointer-events-none"
            style={getImageStyle()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={element.content}
              alt="Element Media"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "shape":
        return (
          <div
            className="w-full h-full transition-all"
            style={getShapeStyle()}
          />
        );
      default:
        return null;
    }
  };

  // Dynamic font classname helpers
  const getFontFamilyClass = (family?: string) => {
    if (!family) return "";
    switch (family) {
      case "Cinzel":
        return "font-cinzel";
      case "Orbitron":
        return "font-orbitron";
      case "Creepster":
        return "font-creepster";
      case "Alex Brush":
        return "font-alex";
      case "Special Elite":
        return "font-special";
      case "Cormorant Garamond":
        return "font-cormorant";
      case "Fredoka":
        return "font-fredoka";
      case "Inter":
        return "font-inter";
      default:
        return "font-playfair";
    }
  };

  return (
    <div
      ref={elementRef}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      className={`absolute transition-shadow duration-100 ${
        isSelected
          ? "ring-1 ring-[var(--accent-color)] shadow-[0_0_10px_var(--accent-glow)] z-50"
          : !readingMode
          ? "hover:ring-1 hover:ring-neutral-400/50"
          : ""
      } ${getFontFamilyClass(element.style.fontFamily)}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.layer,
      }}
    >
      {/* Element Inner Draggable Wrapper */}
      <div
        onMouseDown={handleDragMouseDown}
        className={`w-full h-full ${readingMode ? "cursor-default select-none" : "cursor-move"}`}
      >
        {renderContent()}
      </div>

      {/* Selected Action Handles (Resize, Rotation, Quick Delete) */}
      {isSelected && !element.locked && (
        <>
          {/* Bottom right corner resize node */}
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-[-4px] right-[-4px] w-2.5 h-2.5 bg-black border-2 border-[var(--accent-color)] rounded-full cursor-se-resize z-50 hover:scale-125 transition-transform"
          />
          {/* Top center rotate node */}
          <div
            onMouseDown={handleRotateMouseDown}
            className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-5 h-5 bg-[#0B0F15] border border-white/20 rounded-full flex items-center justify-center cursor-alias text-white/70 hover:text-white z-50 shadow-md"
            title="Rotate"
          >
            <RotateCw size={10} />
          </div>
          {/* Top right quick delete node */}
          <button
            onClick={() => deleteElement(pageId, element.id)}
            className="absolute top-[-24px] right-[-24px] w-5 h-5 bg-[#FF1744] hover:bg-red-600 rounded-full flex items-center justify-center text-white cursor-pointer z-50 shadow-sm border border-white/10"
            title="Delete"
          >
            <Trash2 size={10} />
          </button>
        </>
      )}

      {/* Lock indicator overlay */}
      {element.locked && isSelected && (
        <div className="absolute top-1 right-1 bg-black/60 p-1 rounded-sm text-yellow-500 shadow-md border border-white/10 z-50">
          <Lock size={10} />
        </div>
      )}
    </div>
  );
};
