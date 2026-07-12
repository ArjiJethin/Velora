import { BookDocument, BookPage, PageElement } from "@/types/editor";

const STANDARD_WIDTH = 390;
const STANDARD_HEIGHT = 480;

// Helper to generate a text element
export const createTextElement = (
  id: string,
  content: string,
  y: number,
  height: number,
  options: Partial<PageElement> = {}
): PageElement => ({
  id,
  type: "text",
  x: 30,
  y,
  width: STANDARD_WIDTH - 60,
  height,
  rotation: 0,
  opacity: 100,
  layer: 1,
  locked: false,
  hidden: false,
  style: {
    fontFamily: "Playfair Display",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "justify",
    lineHeight: 1.6,
    letterSpacing: 0,
    color: "#2C2C2C", // Dark charcoal by default
    ...options.style,
  },
  content,
  ...options,
});

// Helper to generate an image element
export const createImageElement = (
  id: string,
  src: string,
  y: number,
  height: number,
  options: Partial<PageElement> = {}
): PageElement => ({
  id,
  type: "image",
  x: 30,
  y,
  width: STANDARD_WIDTH - 60,
  height,
  rotation: 0,
  opacity: 100,
  layer: 2,
  locked: false,
  hidden: false,
  style: {
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 0,
    ...options.style,
  },
  content: src,
  ...options,
});

// Helper to generate shapes or decorations
export const createShapeElement = (
  id: string,
  shapeType: "rectangle" | "circle" | "triangle" | "star",
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<PageElement> = {}
): PageElement => ({
  id,
  type: "shape",
  x,
  y,
  width,
  height,
  rotation: 0,
  opacity: 60,
  layer: 0,
  locked: false,
  hidden: false,
  style: {
    shapeType,
    backgroundColor: "#D4AF37",
    ...options.style,
  },
  content: "",
  ...options,
});

export const generateMockBook = (): BookDocument => {
  const pages: BookPage[] = [];

  // Page 1: Cover Page
  pages.push({
    id: 1,
    title: "Cover Page",
    elements: [
      createShapeElement("cover-border-outer", "rectangle", 15, 15, STANDARD_WIDTH - 30, STANDARD_HEIGHT - 30, {
        opacity: 100,
        style: { backgroundColor: "transparent", borderColor: "#D4AF37", borderWidth: 2 }
      }),
      createShapeElement("cover-border-inner", "rectangle", 22, 22, STANDARD_WIDTH - 44, STANDARD_HEIGHT - 44, {
        opacity: 60,
        style: { backgroundColor: "transparent", borderColor: "#D4AF37", borderWidth: 1 }
      }),
      createShapeElement("cover-corner-tl", "circle", 20, 20, 8, 8, { style: { backgroundColor: "#D4AF37" } }),
      createShapeElement("cover-corner-tr", "circle", STANDARD_WIDTH - 28, 20, 8, 8, { style: { backgroundColor: "#D4AF37" } }),
      createShapeElement("cover-corner-bl", "circle", 20, STANDARD_HEIGHT - 28, 8, 8, { style: { backgroundColor: "#D4AF37" } }),
      createShapeElement("cover-corner-br", "circle", STANDARD_WIDTH - 28, STANDARD_HEIGHT - 28, 8, 8, { style: { backgroundColor: "#D4AF37" } }),
      
      createTextElement("cover-chapter", "CHRONICLES OF ELDORIA", 85, 30, {
        style: { fontFamily: "Cinzel", fontSize: 11, textAlign: "center", fontWeight: "bold", color: "#111111", letterSpacing: 2 }
      }),
      createTextElement("cover-title", "The Lost Kingdom", 145, 100, {
        style: { fontFamily: "Cinzel", fontSize: 32, textAlign: "center", fontWeight: "bold", lineHeight: 1.2, color: "#111111" }
      }),
      createShapeElement("cover-divider", "rectangle", 130, 260, STANDARD_WIDTH - 260, 2, {
        opacity: 100,
        style: { backgroundColor: "#D4AF37" }
      }),
      createTextElement("cover-author", "By Aurelia Vance", 310, 30, {
        style: { fontFamily: "Playfair Display", fontSize: 14, textAlign: "center", fontStyle: "italic", color: "#111111" }
      }),
      createTextElement("cover-sub", "A Premium Digital Edition", 380, 20, {
        opacity: 50,
        style: { fontFamily: "Inter", fontSize: 9, textAlign: "center", color: "#2C2C2C", letterSpacing: 1 }
      })
    ]
  });

  // Page 2: Copyright Page
  pages.push({
    id: 2,
    title: "Copyright Page",
    elements: [
      createTextElement("cr-title", "The Lost Kingdom", 80, 30, {
        style: { fontFamily: "Cinzel", fontSize: 14, textAlign: "center", fontWeight: "bold", color: "#111111" }
      }),
      createTextElement("cr-author", "Aurelia Vance", 115, 20, {
        style: { fontFamily: "Playfair Display", fontSize: 10, textAlign: "center", color: "#2C2C2C" }
      }),
      createShapeElement("cr-divider", "rectangle", 160, 150, 70, 1, {
        opacity: 30,
        style: { backgroundColor: "#111111" }
      }),
      createTextElement("cr-body", 
        "Copyright © 2026 by Aurelia Vance\n\nAll rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the publisher.\n\nFirst Lumora Edition: June 2026\nPublished by Lumora Press, Eldoria City\n\nPrinted in the United Kingdom", 
        180, 220, {
        style: { fontFamily: "Cormorant Garamond", fontSize: 9, textAlign: "center", lineHeight: 1.5, color: "#555555" }
      })
    ]
  });

  // Page 3: Table of Contents
  pages.push({
    id: 3,
    title: "Table of Contents",
    elements: [
      createTextElement("toc-title", "Contents", 60, 40, {
        style: { fontFamily: "Cinzel", fontSize: 20, textAlign: "center", fontWeight: "bold", color: "#111111", letterSpacing: 1 }
      }),
      createShapeElement("toc-divider", "rectangle", 165, 110, 60, 1, {
        opacity: 40,
        style: { backgroundColor: "#D4AF37" }
      }),
      createTextElement("toc-chapter-1", "Chapter I: Prologue of Shadows ........................... 4", 150, 30, {
        style: { fontFamily: "Cormorant Garamond", fontSize: 11, textAlign: "left", color: "#2C2C2C" }
      }),
      createTextElement("toc-chapter-2", "Chapter II: The Whispering Woods ........................ 6", 195, 30, {
        style: { fontFamily: "Cormorant Garamond", fontSize: 11, textAlign: "left", color: "#2C2C2C" }
      }),
      createTextElement("toc-chapter-3", "Chapter III: The Silver Gate ................................ 8", 240, 30, {
        style: { fontFamily: "Cormorant Garamond", fontSize: 11, textAlign: "left", color: "#2C2C2C" }
      }),
      createTextElement("toc-chapter-4", "Chapter IV: The Dual Suns .................................. 10", 285, 30, {
        style: { fontFamily: "Cormorant Garamond", fontSize: 11, textAlign: "left", color: "#2C2C2C" }
      }),
      createTextElement("toc-chapter-5", "Chapter V: The Journey Ahead ........................... 12", 330, 30, {
        style: { fontFamily: "Cormorant Garamond", fontSize: 11, textAlign: "left", color: "#2C2C2C" }
      })
    ]
  });

  // Page 4: Preface
  pages.push({
    id: 4,
    title: "Preface",
    elements: [
      createTextElement("preface-title", "Preface", 60, 40, {
        style: { fontFamily: "Cinzel", fontSize: 18, textAlign: "center", fontWeight: "bold", color: "#111111" }
      }),
      createTextElement("preface-body", 
        "Eldoria was not always a land of mystery. Long before the shroud of mist settled over the mountain passes, it was a kingdom of light, where stone towers gleamed in the sun. This volume serves as an artifact of those forgotten times, compiled from recovered fragments and ancient scrolls. Let the reader tread lightly through these pages.", 
        130, 260, {
        style: { fontFamily: "Playfair Display", fontSize: 12.5, textAlign: "justify", lineHeight: 1.7, color: "#2C2C2C" }
      }),
      createShapeElement("preface-ornament", "circle", STANDARD_WIDTH / 2 - 4, 400, 8, 8, {
        opacity: 50,
        style: { backgroundColor: "#D4AF37" }
      })
    ]
  });

  // Page 5: Chapter I (Prologue of Shadows)
  pages.push({
    id: 5,
    chapterNumber: 1,
    chapterTitle: "Prologue of Shadows",
    elements: [
      createTextElement("c1-num", "Chapter I", 50, 20, {
        opacity: 60,
        style: { fontFamily: "Cinzel", fontSize: 10, textAlign: "center", color: "#111111" }
      }),
      createTextElement("c1-title", "Prologue of Shadows", 75, 40, {
        style: { fontFamily: "Cinzel", fontSize: 18, textAlign: "center", fontWeight: "bold", color: "#111111" }
      }),
      createShapeElement("c1-divider", "rectangle", 170, 125, 50, 1, {
        opacity: 50,
        style: { backgroundColor: "#D4AF37" }
      }),
      createTextElement("c1-body", 
        "The shadows came first to the borders of the kingdom. It was not a sudden invasion, but a slow creep, like frost drawing patterns on a winter pane. The villagers in the outer valleys spoke of trees that seemed to move when no wind blew, and streams that ran black in the moonlight.", 
        155, 230, {
        style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C", dropCapEnabled: true }
      })
    ]
  });

  // Page 6: Chapter I (Illustration & Quote)
  pages.push({
    id: 6,
    elements: [
      createTextElement("c1-body-p2", 
        "Few believed the scouts at first. The royal city of Aethelgard was safe behind high stone walls, its people convinced that the ancient wards would hold forever. But wards, like treaties, are only as strong as the memories of those who swore them.", 
        50, 150, {
        style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C" }
      }),
      createShapeElement("c1-quote-box", "rectangle", 30, 230, STANDARD_WIDTH - 60, 110, {
        opacity: 10,
        style: { backgroundColor: "#D4AF37", borderColor: "#D4AF37", borderWidth: 1 }
      }),
      createTextElement("c1-quote", 
        "“A kingdom built on forgotten promises is but a house carved in sand.”", 
        250, 80, {
        style: { fontFamily: "Cinzel", fontSize: 12, fontStyle: "italic", textAlign: "center", color: "#111111", lineHeight: 1.5 }
      })
    ]
  });

  // Page 7: Chapter II (The Whispering Woods)
  pages.push({
    id: 7,
    chapterNumber: 2,
    chapterTitle: "The Whispering Woods",
    elements: [
      createTextElement("c2-num", "Chapter II", 50, 20, {
        opacity: 60,
        style: { fontFamily: "Cinzel", fontSize: 10, textAlign: "center", color: "#111111" }
      }),
      createTextElement("c2-title", "The Whispering Woods", 75, 40, {
        style: { fontFamily: "Cinzel", fontSize: 18, textAlign: "center", fontWeight: "bold", color: "#111111" }
      }),
      createShapeElement("c2-divider", "rectangle", 170, 125, 50, 1, {
        opacity: 50,
        style: { backgroundColor: "#D4AF37" }
      }),
      createTextElement("c2-body-1", 
        "Deep within the heart of Aethelwood lay the forgotten ruins of a civilization that preceded even Eldoria. These crumbling arches, overgrown with glowing blue ivy, held secrets that the mages could only dream of unlocking.", 
        155, 120, {
        style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C", dropCapEnabled: true }
      }),
      // Dialogue blocks showing proper dialogue representation
      createTextElement("c2-diag-1", 
        "“Who goes there?” a voice whispered from the branches.\n\n“Only a traveler seeking light,” Aurelia replied, her hand close to her sword.", 
        300, 130, {
        style: { fontFamily: "Playfair Display", fontSize: 12.5, fontStyle: "italic", textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C" }
      })
    ]
  });

  // Page 8: Full-Page Illustration (Rich showcase)
  pages.push({
    id: 8,
    title: "Full-Page Illustration",
    elements: [
      createShapeElement("ill-bg", "rectangle", 20, 20, STANDARD_WIDTH - 40, STANDARD_HEIGHT - 40, {
        opacity: 50,
        style: { backgroundColor: "#FAF6EE", borderColor: "#D4AF37", borderWidth: 1 }
      }),
      createImageElement("ill-img", "/fantasy_castle.png", 40, 320, {
        style: { borderWidth: 1, borderColor: "#D4AF37" }
      }),
      createTextElement("ill-caption", "The Lost Citadels of Eldoria's Mountain Valleys", 380, 50, {
        style: { fontFamily: "Cinzel", fontSize: 10, textAlign: "center", fontWeight: "bold", color: "#111111" }
      })
    ]
  });

  // Page 9: Chapter III (The Silver Gate)
  pages.push({
    id: 9,
    chapterNumber: 3,
    chapterTitle: "The Silver Gate",
    elements: [
      createTextElement("c3-num", "Chapter III", 50, 20, {
        opacity: 60,
        style: { fontFamily: "Cinzel", fontSize: 10, textAlign: "center", color: "#111111" }
      }),
      createTextElement("c3-title", "The Silver Gate", 75, 40, {
        style: { fontFamily: "Cinzel", fontSize: 18, textAlign: "center", fontWeight: "bold", color: "#111111" }
      }),
      createShapeElement("c3-divider", "rectangle", 170, 125, 50, 1, {
        opacity: 50,
        style: { backgroundColor: "#D4AF37" }
      }),
      createTextElement("c3-body-1", 
        "At the edge of the obsidian cliffs, they found it. A massive archway constructed from polished silver that caught the rays of the setting suns, reflecting a cold, brilliant glow that illuminated the path.", 
        155, 140, {
        style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C", dropCapEnabled: true }
      }),
      createShapeElement("c3-triangle-frame", "triangle", 155, 310, 80, 80, {
        opacity: 30,
        style: { backgroundColor: "#D4AF37", borderColor: "#D4AF37", borderWidth: 1 }
      }),
      createTextElement("c3-body-2", "The gateway stood unlocked, waiting.", 410, 40, {
        style: { fontFamily: "Cinzel", fontSize: 11, textAlign: "center", fontWeight: "bold", color: "#111111" }
      })
    ]
  });

  // Page 10: Chapter IV (The Dual Suns)
  pages.push({
    id: 10,
    chapterNumber: 4,
    chapterTitle: "The Dual Suns",
    elements: [
      createTextElement("c4-num", "Chapter IV", 50, 20, {
        opacity: 60,
        style: { fontFamily: "Cinzel", fontSize: 10, textAlign: "center", color: "#111111" }
      }),
      createTextElement("c4-title", "The Dual Suns", 75, 40, {
        style: { fontFamily: "Cinzel", fontSize: 18, textAlign: "center", fontWeight: "bold", color: "#111111" }
      }),
      createShapeElement("c4-divider", "rectangle", 170, 125, 50, 1, {
        opacity: 50,
        style: { backgroundColor: "#D4AF37" }
      }),
      createTextElement("c4-body-1", 
        "The transition was silent. One step, they were standing inside the ancient stone chamber; the next, they stepped out onto a beach of violet sand under a double sun. The ocean before them was not water, but a shimmering liquid gold.", 
        155, 230, {
        style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C", dropCapEnabled: true }
      })
    ]
  });

  // Generate intermediate dummy pages up to 50
  for (let i = 11; i <= 50; i++) {
    pages.push({
      id: i,
      elements: [
        createTextElement(`page-${i}-hdr`, `Chronicles of Eldoria — Page ${i}`, 40, 20, {
          opacity: 40,
          style: { fontFamily: "Cinzel", fontSize: 8, textAlign: "center", color: "#111111" }
        }),
        createTextElement(`page-${i}-body`, 
          `This is page ${i} of our chronicle. Moving closer to the discovery, scholars and adventurers alike searched the stone steps for inscriptions. The symbols, etched deep into the obsidian slabs, glowed with residual heat when touched, humming a low frequency that resonated with the traveler's heartbeat.`, 
          80, 320, {
          style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C" }
        })
      ]
    });
  }

  return {
    id: "the-lost-kingdom",
    title: "The Lost Kingdom",
    pages,
  };
};
