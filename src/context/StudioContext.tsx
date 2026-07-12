"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { WorkspaceTheme, WorkspaceThemeId, BookTemplate, BookTemplateId, ThemeId, ThemeConfig } from "@/types/theme";
import { WORKSPACE_THEMES, BOOK_TEMPLATES } from "@/constants/themes";
import { BookDocument, BookPage, PageElement, ElementType, ElementStyle, TypographyStyle } from "@/types/editor";
import { generateMockBook, createTextElement } from "@/constants/mockBook";

interface StudioContextType {
  // Themes & Templates
  workspaceTheme: WorkspaceTheme;
  workspaceThemeId: WorkspaceThemeId;
  setWorkspaceThemeId: (id: WorkspaceThemeId) => void;

  bookTemplate: BookTemplate;
  bookTemplateId: BookTemplateId;
  setBookTemplateId: (id: BookTemplateId) => void;

  // Legacy variables for compatibility
  theme: WorkspaceTheme;
  setThemeById: (id: string) => void;

  activePage: number; // Left page number of the active spread
  setActivePage: (page: number) => void;
  totalPages: number;
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  viewMode: "spread" | "single" | "grid";
  setViewMode: (mode: "spread" | "single" | "grid") => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Typography states (getters from active element or defaults)
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number | ((prev: number) => number)) => void;
  textAlign: "left" | "center" | "right" | "justify";
  setTextAlign: (align: "left" | "center" | "right" | "justify") => void;
  bold: boolean;
  setBold: (bold: boolean) => void;
  italic: boolean;
  setItalic: (italic: boolean) => void;
  underline: boolean;
  setUnderline: (underline: boolean) => void;
  strikethrough: boolean;
  setStrikethrough: (strike: boolean) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  letterSpacing: number;
  setLetterSpacing: (spacing: number) => void;
  
  // Advanced Typography & Colors
  textColor: string;
  setTextColor: (color: string) => void;
  highlightColor: string;
  setHighlightColor: (color: string) => void;
  backgroundFill: string;
  setBackgroundFill: (color: string) => void;
  fontWeight: string;
  setFontWeight: (weight: string) => void;
  fontStyle: string;
  setFontStyle: (style: string) => void;
  textDecoration: string;
  setTextDecoration: (decoration: string) => void;
  smallCaps: boolean;
  setSmallCaps: (val: boolean) => void;
  superscript: boolean;
  setSuperscript: (val: boolean) => void;
  subscript: boolean;
  setSubscript: (val: boolean) => void;
  wordSpacing: number;
  setWordSpacing: (spacing: number) => void;
  paragraphSpacing: number;
  setParagraphSpacing: (spacing: number) => void;
  dropCapEnabled: boolean;
  setDropCapEnabled: (val: boolean) => void;
  textShadow: string;
  setTextShadow: (shadow: string) => void;
  outlineColor: string;
  setOutlineColor: (color: string) => void;
  outlineWidth: number;
  setOutlineWidth: (width: number) => void;

  // Shapes & borders
  shapeType: "rectangle" | "circle" | "triangle" | "star";
  setShapeType: (type: "rectangle" | "circle" | "triangle" | "star") => void;
  borderColor: string;
  setBorderColor: (color: string) => void;
  borderWidth: number;
  setBorderWidth: (width: number) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  boxShadow: string;
  setBoxShadow: (shadow: string) => void;
  backgroundColor: string; // shape fill
  setBackgroundColor: (color: string) => void;

  // Styles Panel (Figma-style Typography Styles)
  typographyStyles: TypographyStyle[];
  createStyle: (style: Omit<TypographyStyle, "id">) => void;
  renameStyle: (id: string, newName: string) => void;
  duplicateStyle: (id: string) => void;
  deleteStyle: (id: string) => void;
  applyStyle: (styleId: string) => void;
  updateStyle: (id: string, updates: Partial<TypographyStyle>, updateAllInstances: boolean) => void;

  // Custom Color Palettes
  recentColors: string[];
  addRecentColor: (color: string) => void;
  favoriteColors: string[];
  addFavoriteColor: (color: string) => void;

  // Empty State and Book Creator
  openNewBookModal: boolean;
  setOpenNewBookModal: (val: boolean) => void;
  createNewBook: (option: "blank" | "template" | "import") => void;
  
  // Element states
  elementOpacity: number;
  setElementOpacity: (opacity: number) => void;
  elementLayer: "front" | "back" | "middle";
  setElementLayer: (layer: "front" | "back" | "middle") => void;
  
  // Page states
  pageBgColor: string;
  setPageBgColor: (color: string) => void;
  showPageNumbers: boolean;
  setShowPageNumbers: (show: boolean) => void;
  margins: "normal" | "wide" | "narrow";
  setMargins: (margins: "normal" | "wide" | "narrow") => void;
  
  // Core Book Editor Engine
  document: BookDocument;
  setDocument: React.Dispatch<React.SetStateAction<BookDocument>>;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  selectedPageId: number | null;
  setSelectedPageId: (id: number | null) => void;
  readingMode: boolean;
  setReadingMode: (mode: boolean) => void;
  pageTurnAnimation: string;
  setPageTurnAnimation: (animation: string) => void;
  
  // Actions
  updateElement: (pageId: number, elementId: string, updates: Partial<PageElement>) => void;
  addElement: (pageId: number, type: ElementType, content?: string) => void;
  deleteElement: (pageId: number, elementId: string) => void;
  arrangeElement: (action: "forward" | "backward" | "front" | "back") => void;
  
  // Asset Management
  assets: string[];
  addAsset: (dataUrl: string) => void;
  
  // Page spread controls
  addPageSpread: () => void;
  deletePageSpread: (pageIndex: number) => void;
  
  // App actions
  saveStatus: "saved" | "saving" | "unsaved";
  triggerSave: () => void;
  undo: () => void;
  redo: () => void;
  historyPointer: number;
  historyLength: number;
  
  // Auto-pagination trigger
  paginatePageText: (pageId: number, elementId: string, textContent: string, domHeight: number, maxHeight: number) => void;

  // Dashboard & Global Navigation states
  activeView: string;
  setActiveView: (view: string) => void;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;
  books: BookDocument[];
  setBooks: React.Dispatch<React.SetStateAction<BookDocument[]>>;
  user: {
    name: string;
    plan: "free" | "premium";
    avatarUrl: string;
    email: string;
  };
  setUser: React.Dispatch<React.SetStateAction<{
    name: string;
    plan: "free" | "premium";
    avatarUrl: string;
    email: string;
  }>>;
  workspaceNotes: {
    id: string;
    type: "note" | "character" | "world" | "location" | "research" | "timeline";
    title: string;
    content: string;
    tags?: string[];
    lastEdited?: string;
    pinned?: boolean;
  }[];
  setWorkspaceNotes: React.Dispatch<React.SetStateAction<any[]>>;
  recentActivity: {
    id: string;
    type: "edit" | "add" | "import" | "change";
    description: string;
    timestamp: string;
    bookId?: string;
  }[];
  setRecentActivity: React.Dispatch<React.SetStateAction<any[]>>;
  notifications: {
    id: string;
    title: string;
    content: string;
    read: boolean;
    timestamp: string;
  }[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  writingGoals: {
    dailyTarget: number;
    streakDays: number;
    history: { date: string; words: number }[];
  };
  setWritingGoals: React.Dispatch<React.SetStateAction<any>>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Decoupled Workspace and Book Templates
  const [workspaceThemeId, setWorkspaceThemeIdState] = useState<WorkspaceThemeId>("warm-ivory");
  const [bookTemplateId, setBookTemplateIdState] = useState<BookTemplateId>("fantasy");
  
  // Navigation & Zoom
  const [activePage, setActivePageInternal] = useState<number>(5); // Default left page is page 5
  const [zoom, setZoom] = useState<number>(100);
  const [viewMode, setViewMode] = useState<"spread" | "single" | "grid">("spread");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("pages");
  const [readingMode, setReadingMode] = useState<boolean>(false);
  const [pageTurnAnimation, setPageTurnAnimation] = useState<string>("page-flip");
  
  // Empty states modal
  const [openNewBookModal, setOpenNewBookModal] = useState<boolean>(false);

  // Dashboard & global navigation states
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Default initial list of books
  const [books, setBooks] = useState<BookDocument[]>(() => {
    const mockBook = generateMockBook();
    return [
      {
        ...mockBook,
        id: "the-lost-kingdom",
        title: "The Lost Kingdom",
        genre: "Fantasy",
        wordCount: 24530,
        targetWordCount: 80000,
        chapterCount: 50,
        completedChapters: 24,
        lastEdited: "1 hour ago",
        status: "In Progress" as const,
        coverImage: "fantasy",
        progress: 61,
        createdDate: "May 10, 2026",
        readingTime: "1h 45m",
        tags: ["Fantasy", "Epic", "Adventure"],
        favorite: true
      },
      {
        id: "whispers-of-eldoria",
        title: "Whispers of Eldoria",
        genre: "Fantasy",
        wordCount: 12450,
        targetWordCount: 60000,
        chapterCount: 30,
        completedChapters: 12,
        lastEdited: "3 hours ago",
        status: "In Progress" as const,
        coverImage: "romance",
        progress: 40,
        createdDate: "Apr 20, 2026",
        readingTime: "55m",
        tags: ["Romance", "Elves", "Drama"],
        favorite: true,
        pages: []
      },
      {
        id: "beyond-the-stars",
        title: "Beyond the Stars",
        genre: "Sci-Fi",
        wordCount: 5120,
        targetWordCount: 85000,
        chapterCount: 25,
        completedChapters: 5,
        lastEdited: "2 days ago",
        status: "Draft" as const,
        coverImage: "sci-fi",
        progress: 20,
        createdDate: "May 01, 2026",
        readingTime: "15m",
        tags: ["Sci-Fi", "Cyberpunk", "AI"],
        favorite: false,
        pages: []
      },
      {
        id: "chronicles-of-ashenfall",
        title: "Chronicles of Ashenfall",
        genre: "Classic",
        wordCount: 78200,
        targetWordCount: 75000,
        chapterCount: 42,
        completedChapters: 42,
        lastEdited: "Last week",
        status: "Completed" as const,
        coverImage: "classic",
        progress: 100,
        createdDate: "Jan 15, 2026",
        readingTime: "4h 20m",
        tags: ["Classic", "Mystery", "Noir"],
        favorite: false,
        pages: []
      }
    ];
  });

  const [user, setUser] = useState<{
    name: string;
    plan: "free" | "premium";
    avatarUrl: string;
    email: string;
  }>({
    name: "Aurelia Vance",
    plan: "premium",
    avatarUrl: "",
    email: "aurelia@lumora.app"
  });

  const [workspaceNotes, setWorkspaceNotes] = useState<any[]>([
    {
      id: "note-1",
      type: "note",
      title: "General Ideas",
      content: "Explore the connection between the Dual Suns and the ancient gates. The magic increases during eclipses.",
      tags: ["Lore", "Magic System"],
      lastEdited: "1 hour ago",
      pinned: true
    },
    {
      id: "note-2",
      type: "character",
      title: "Lord Vance",
      content: "Main antagonist. Seeking to open the Silver Gate to retrieve his lost kingdom. Cold, calculating, wields shadow spells.",
      tags: ["Characters", "Antagonist"],
      lastEdited: "2 hours ago",
      pinned: true
    },
    {
      id: "note-3",
      type: "world",
      title: "Eldoria Magic Rules",
      content: "1. Elemental spells require organic catalyst.\n2. Eclipse amplifies shadow/astral spells by 3x.\n3. Star metal blocks magic conduction.",
      tags: ["Worldbuilding", "Rules"],
      lastEdited: "Yesterday",
      pinned: false
    },
    {
      id: "note-4",
      type: "location",
      title: "Obsidian Cliffs",
      content: "A dangerous mountain range on the coast. Made entirely of volcanic glass. The path to the Silver Gate is hidden here.",
      tags: ["Locations", "Geography"],
      lastEdited: "3 days ago",
      pinned: false
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<any[]>([
    { id: "act-1", type: "edit", description: "Edited Chapter 3: The Silver Gate", timestamp: "2 minutes ago", bookId: "the-lost-kingdom" },
    { id: "act-2", type: "add", description: "Added 450 words to Chapter 4", timestamp: "1 hour ago", bookId: "the-lost-kingdom" },
    { id: "act-3", type: "import", description: "Imported image 'castle-concept.jpg'", timestamp: "3 hours ago", bookId: "the-lost-kingdom" },
    { id: "act-4", type: "change", description: "Changed text style 'Chapter Title'", timestamp: "Yesterday", bookId: "the-lost-kingdom" }
  ]);

  const [notifications, setNotifications] = useState<any[]>([
    { id: "notif-1", title: "Goal Met!", content: "You reached your writing goal of 500 words yesterday! Keep the streak going.", read: false, timestamp: "Today" },
    { id: "notif-2", title: "New Template Available", content: "We just released a new classic Victorian Gothic template.", read: true, timestamp: "Yesterday" }
  ]);

  const [writingGoals, setWritingGoals] = useState<any>({
    dailyTarget: 500,
    streakDays: 12,
    history: [
      { date: "2026-07-06", words: 620 },
      { date: "2026-07-07", words: 450 },
      { date: "2026-07-08", words: 580 },
      { date: "2026-07-09", words: 500 },
      { date: "2026-07-10", words: 710 },
      { date: "2026-07-11", words: 530 },
      { date: "2026-07-12", words: 230 }
    ]
  });



  // Custom Colors
  const [recentColors, setRecentColors] = useState<string[]>(["#111111", "#2C2C2C", "#FAF2F2", "#FAF6EE"]);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(["#D4AF37", "#00E5FF", "#FF1744", "#00E676"]);

  // Paragraph Styles (Figma-style)
  const [typographyStyles, setTypographyStyles] = useState<TypographyStyle[]>([
    { id: "style-chap-title", name: "Chapter Title", fontFamily: "Cinzel", fontSize: 18, fontWeight: "bold", textAlign: "center", lineHeight: 1.4, color: "#111111" },
    { id: "style-h1", name: "Heading 1", fontFamily: "Cinzel", fontSize: 15, fontWeight: "bold", textAlign: "center", lineHeight: 1.4, color: "#111111" },
    { id: "style-h2", name: "Heading 2", fontFamily: "Playfair Display", fontSize: 13, fontWeight: "bold", textAlign: "left", lineHeight: 1.4, color: "#111111" },
    { id: "style-body", name: "Body Text", fontFamily: "Playfair Display", fontSize: 13, fontWeight: "normal", textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C" },
    { id: "style-quote", name: "Quote", fontFamily: "Cinzel", fontSize: 12, fontStyle: "italic", textAlign: "center", lineHeight: 1.5, color: "#111111" },
    { id: "style-dialogue", name: "Dialogue", fontFamily: "Playfair Display", fontSize: 12.5, fontStyle: "italic", textAlign: "justify", lineHeight: 1.6, color: "#2C2C2C" },
    { id: "style-caption", name: "Caption", fontFamily: "Inter", fontSize: 9.5, fontWeight: "normal", textAlign: "center", lineHeight: 1.4, color: "#555555" },
    { id: "style-footnote", name: "Footnote", fontFamily: "Inter", fontSize: 8, fontWeight: "normal", textAlign: "left", lineHeight: 1.3, color: "#777777" },
  ]);

  // Core Document State
  const [document, setDocument] = useState<BookDocument>(() => generateMockBook());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  
  // Assets library
  const [assets, setAssets] = useState<string[]>(["/fantasy_castle.png"]);
  
  // History State
  const historyRef = useRef<BookDocument[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [historyPointer, setHistoryPointer] = useState<number>(0);
  const [historyLength, setHistoryLength] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize History
  useEffect(() => {
    if (historyRef.current.length === 0) {
      historyRef.current = [JSON.parse(JSON.stringify(document))];
      historyIndexRef.current = 0;
      setHistoryPointer(0);
      setHistoryLength(0);
    }
  }, []);

  // Sync active document with the list of books in state
  useEffect(() => {
    if (!document) return;
    
    // Count words in document
    let words = 0;
    document.pages.forEach((p) => {
      p.elements.forEach((el) => {
        if (el.type === "text" && el.content) {
          const clean = el.content.replace(/<[^>]*>/g, "");
          words += clean.trim().split(/\s+/).filter(Boolean).length;
        }
      });
    });

    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === document.id
          ? {
              ...b,
              ...document,
              wordCount: words,
              progress: Math.min(100, Math.round((words / (b.targetWordCount || 80000)) * 100)),
              lastEdited: "Just now"
            }
          : b
      )
    );
  }, [document]);

  const workspaceTheme = WORKSPACE_THEMES[workspaceThemeId] || WORKSPACE_THEMES["midnight-gold"];
  const bookTemplate = BOOK_TEMPLATES[bookTemplateId] || BOOK_TEMPLATES.fantasy;
  const theme = workspaceTheme; // backward compatibility

  // Auto-sync CSS variables to root when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.style.setProperty("--accent-color", workspaceTheme.accentColor);
      root.style.setProperty("--accent-glow", workspaceTheme.accentGlow);
      root.style.setProperty("--accent-glow-strong", workspaceTheme.accentGlowStrong);
    }
  }, [workspaceTheme]);

  // Helper to push a new state onto history stack
  const pushHistory = useCallback((newDoc: BookDocument) => {
    const history = historyRef.current;
    const index = historyIndexRef.current;

    const newHistory = history.slice(0, index + 1);
    newHistory.push(JSON.parse(JSON.stringify(newDoc)));
    
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    
    setHistoryPointer(newHistory.length - 1);
    setHistoryLength(newHistory.length - 1);
    setSaveStatus("saving");

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
  }, []);

  // Set selected page number
  const setActivePage = (pageNumber: number) => {
    if (viewMode === "spread") {
      const evenPage = pageNumber % 2 === 0 ? pageNumber : pageNumber - 1;
      setActivePageInternal(Math.max(1, Math.min(document.pages.length, evenPage)));
    } else {
      setActivePageInternal(Math.max(1, Math.min(document.pages.length, pageNumber)));
    }
    setSelectedElementId(null);
    setSelectedPageId(null);
  };

  // 1. Element Updates
  const updateElement = useCallback((pageId: number, elementId: string, updates: Partial<PageElement>) => {
    setDocument((prevDoc) => {
      const updatedPages = prevDoc.pages.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          elements: page.elements.map((el) => {
            if (el.id !== elementId) return el;
            
            const updatedStyle = updates.style 
              ? { ...el.style, ...updates.style } 
              : el.style;

            return {
              ...el,
              ...updates,
              style: updatedStyle,
            };
          }),
        };
      });

      const nextDoc = { ...prevDoc, pages: updatedPages };
      pushHistory(nextDoc);
      return nextDoc;
    });
  }, [pushHistory]);

  // 2. Add New Element to current Page
  const addElement = useCallback((pageId: number, type: ElementType, content?: string) => {
    const id = `${type}-${Date.now()}`;
    const newElement: PageElement = {
      id,
      type,
      x: 50,
      y: 100,
      width: type === "image" ? 280 : 330,
      height: type === "image" ? 200 : 80,
      rotation: 0,
      opacity: 100,
      layer: type === "image" ? 2 : 1,
      locked: false,
      hidden: false,
      style: {
        fontFamily: type === "text" ? bookTemplate.fonts.body : undefined,
        fontSize: type === "text" ? 13 : undefined,
        color: type === "text" ? bookTemplate.colors.textDark : undefined,
        backgroundColor: type === "shape" ? bookTemplate.colors.accent : undefined,
        borderColor: "transparent",
        borderWidth: 0,
      },
      content: content || (type === "text" ? "New Text Element" : type === "image" ? "/fantasy_castle.png" : ""),
    };

    setDocument((prevDoc) => {
      const updatedPages = prevDoc.pages.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          elements: [...page.elements, newElement],
        };
      });

      const nextDoc = { ...prevDoc, pages: updatedPages };
      pushHistory(nextDoc);
      return nextDoc;
    });

    setSelectedElementId(id);
    setSelectedPageId(pageId);
  }, [pushHistory, bookTemplate]);

  // 3. Delete Selected Element
  const deleteElement = useCallback((pageId: number, elementId: string) => {
    setDocument((prevDoc) => {
      const updatedPages = prevDoc.pages.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          elements: page.elements.filter((el) => el.id !== elementId),
        };
      });

      const nextDoc = { ...prevDoc, pages: updatedPages };
      pushHistory(nextDoc);
      return nextDoc;
    });

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
      setSelectedPageId(null);
    }
  }, [pushHistory, selectedElementId]);

  // 4. Arrange Layer Depth
  const arrangeElement = useCallback((action: "forward" | "backward" | "front" | "back") => {
    if (!selectedElementId || !selectedPageId) return;

    setDocument((prevDoc) => {
      const updatedPages = prevDoc.pages.map((page) => {
        if (page.id !== selectedPageId) return page;

        const elements = [...page.elements];
        const elIndex = elements.findIndex((el) => el.id === selectedElementId);
        if (elIndex === -1) return page;

        const activeEl = elements[elIndex];

        if (action === "front") {
          const maxLayer = Math.max(...elements.map((el) => el.layer), 0);
          activeEl.layer = maxLayer + 1;
        } else if (action === "back") {
          const minLayer = Math.min(...elements.map((el) => el.layer), 0);
          activeEl.layer = Math.max(0, minLayer - 1);
        } else if (action === "forward") {
          activeEl.layer += 1;
        } else if (action === "backward") {
          activeEl.layer = Math.max(0, activeEl.layer - 1);
        }

        return { ...page, elements };
      });

      const nextDoc = { ...prevDoc, pages: updatedPages };
      pushHistory(nextDoc);
      return nextDoc;
    });
  }, [selectedElementId, selectedPageId, pushHistory]);

  // Auto-pagination on text overflow
  const paginatePageText = useCallback((
    pageId: number,
    elementId: string,
    textContent: string,
    domHeight: number,
    maxHeight: number
  ) => {
    setDocument((prevDoc) => {
      const pages = prevDoc.pages;
      const currentPageIndex = pages.findIndex((p) => p.id === pageId);
      if (currentPageIndex === -1) return prevDoc;

      const charRatio = textContent.length / domHeight;
      const fitCharsCount = Math.floor(maxHeight * charRatio);

      const pageText = textContent.substring(0, fitCharsCount);
      const overflowingText = textContent.substring(fitCharsCount).trim();

      if (!overflowingText) return prevDoc;

      const updatedPages = pages.map((page) => {
        if (page.id !== pageId) return page;
        const elements = page.elements.map((el) => {
          if (el.id !== elementId) return el;
          return { ...el, content: pageText };
        });
        return { ...page, elements };
      });

      let nextPage = prevDoc.pages[currentPageIndex + 1];
      let finalPages = [...updatedPages];

      if (!nextPage) {
        const nextId1 = prevDoc.pages.length + 1;
        const nextId2 = prevDoc.pages.length + 2;
        
        const newPage1: BookPage = {
          id: nextId1,
          elements: [
            createTextElement(`page-${nextId1}-hdr`, `Chronicles of Eldoria`, 40, 20, {
              opacity: 30,
              style: { fontFamily: bookTemplate.fonts.title, fontSize: 8, textAlign: "center" }
            }),
            createTextElement(`text-${nextId1}-${Date.now()}`, overflowingText, 80, 320)
          ]
        };

        const newPage2: BookPage = {
          id: nextId2,
          elements: [
            createTextElement(`page-${nextId2}-hdr`, `Chronicles of Eldoria`, 40, 20, {
              opacity: 30,
              style: { fontFamily: bookTemplate.fonts.title, fontSize: 8, textAlign: "center" }
            }),
            createTextElement(`text-${nextId2}-${Date.now()}`, "Write corresponding content here.", 80, 320)
          ]
        };

        finalPages.push(newPage1, newPage2);
      } else {
        const textEl = nextPage.elements.find((el) => el.type === "text");
        
        finalPages = finalPages.map((p) => {
          if (p.id !== nextPage.id) return p;
          
          let elements = [...p.elements];
          if (textEl) {
            elements = elements.map((el) => {
              if (el.id !== textEl.id) return el;
              return { ...el, content: `${overflowingText}\n\n${el.content}` };
            });
          } else {
            const newElId = `text-${nextPage.id}-${Date.now()}`;
            elements.push(createTextElement(newElId, overflowingText, 80, 320));
          }
          return { ...p, elements };
        });
      }

      const nextDoc = { ...prevDoc, pages: finalPages };
      pushHistory(nextDoc);
      return nextDoc;
    });
  }, [pushHistory, bookTemplate]);

  // Bind values to active element properties
  const activeElement = selectedElementId && selectedPageId
    ? document.pages
        .find((p) => p.id === selectedPageId)
        ?.elements.find((el) => el.id === selectedElementId)
    : null;

  // Element Typography settings
  const fontFamily = activeElement?.style.fontFamily || "Playfair Display";
  const fontSize = activeElement?.style.fontSize || 13;
  const textAlign = activeElement?.style.textAlign || "justify";
  const bold = activeElement?.style.fontWeight === "bold";
  const italic = activeElement?.style.fontStyle === "italic";
  const underline = activeElement?.style.textDecoration === "underline";
  const strikethrough = activeElement?.style.textDecoration === "line-through";
  const lineHeight = activeElement?.style.lineHeight || 1.6;
  const letterSpacing = activeElement?.style.letterSpacing || 0;
  
  // Custom Typography properties
  const textColor = activeElement?.style.color || "#2C2C2C";
  const highlightColor = activeElement?.style.highlightColor || "transparent";
  const backgroundFill = activeElement?.style.backgroundFill || "transparent";
  const fontWeight = activeElement?.style.fontWeight || "normal";
  const fontStyle = activeElement?.style.fontStyle || "normal";
  const textDecoration = activeElement?.style.textDecoration || "none";
  const smallCaps = !!activeElement?.style.smallCaps;
  const superscript = !!activeElement?.style.superscript;
  const subscript = !!activeElement?.style.subscript;
  const wordSpacing = activeElement?.style.wordSpacing || 0;
  const paragraphSpacing = activeElement?.style.paragraphSpacing || 0;
  const dropCapEnabled = !!activeElement?.style.dropCapEnabled;
  const textShadow = activeElement?.style.textShadow || "none";
  const outlineColor = activeElement?.style.outlineColor || "transparent";
  const outlineWidth = activeElement?.style.outlineWidth || 0;

  // Shapes visual properties
  const shapeType = activeElement?.style.shapeType || "rectangle";
  const borderColor = activeElement?.style.borderColor || "transparent";
  const borderWidth = activeElement?.style.borderWidth || 0;
  const borderRadius = activeElement?.style.borderRadius || 0;
  const boxShadow = activeElement?.style.boxShadow || "none";
  const backgroundColor = activeElement?.style.backgroundColor || "#D4AF37";

  // Page level properties
  const [pageBgColor, setPageBgColor] = useState<string>("#FAF6EE");
  const [showPageNumbers, setShowPageNumbers] = useState<boolean>(true);
  const [margins, setMargins] = useState<"normal" | "wide" | "narrow">("normal");

  const elementOpacity = activeElement?.opacity ?? 100;
  const elementLayer = activeElement
    ? activeElement.layer > 10 
      ? "front" 
      : activeElement.layer < 2 
        ? "back" 
        : "middle"
    : "middle";

  // Typography set helpers
  const setFontFamily = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { fontFamily: val } });
    }
  };

  const setFontSize = (val: number | ((prev: number) => number)) => {
    if (selectedElementId && selectedPageId) {
      const nextSize = typeof val === "function" ? val(fontSize) : val;
      updateElement(selectedPageId, selectedElementId, { style: { fontSize: nextSize } });
    }
  };

  const setTextAlign = (val: "left" | "center" | "right" | "justify") => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { textAlign: val } });
    }
  };

  const setBold = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { fontWeight: val ? "bold" : "normal" } });
    }
  };

  const setItalic = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { fontStyle: val ? "italic" : "normal" } });
    }
  };

  const setUnderline = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, {
        style: { textDecoration: val ? "underline" : "none" },
      });
    }
  };

  const setStrikethrough = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, {
        style: { textDecoration: val ? "line-through" : "none" },
      });
    }
  };

  const setLineHeight = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { lineHeight: val } });
    }
  };

  const setLetterSpacing = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { letterSpacing: val } });
    }
  };

  const setTextColor = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { color: val } });
      addRecentColor(val);
    }
  };

  const setHighlightColor = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { highlightColor: val } });
    }
  };

  const setBackgroundFill = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { backgroundFill: val } });
    }
  };

  const setFontWeight = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { fontWeight: val } });
    }
  };

  const setFontStyle = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { fontStyle: val } });
    }
  };

  const setTextDecoration = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { textDecoration: val } });
    }
  };

  const setSmallCaps = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { smallCaps: val } });
    }
  };

  const setSuperscript = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { superscript: val, subscript: false } });
    }
  };

  const setSubscript = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { subscript: val, superscript: false } });
    }
  };

  const setWordSpacing = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { wordSpacing: val } });
    }
  };

  const setParagraphSpacing = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { paragraphSpacing: val } });
    }
  };

  const setDropCapEnabled = (val: boolean) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { dropCapEnabled: val } });
    }
  };

  const setTextShadow = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { textShadow: val } });
    }
  };

  const setOutlineColor = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { outlineColor: val } });
    }
  };

  const setOutlineWidth = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { outlineWidth: val } });
    }
  };

  const setShapeType = (val: "rectangle" | "circle" | "triangle" | "star") => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { shapeType: val } });
    }
  };

  const setBorderColor = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { borderColor: val } });
    }
  };

  const setBorderWidth = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { borderWidth: val } });
    }
  };

  const setBorderRadius = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { borderRadius: val } });
    }
  };

  const setBoxShadow = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { boxShadow: val } });
    }
  };

  const setBackgroundColor = (val: string) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { style: { backgroundColor: val } });
    }
  };

  const setElementOpacity = (val: number) => {
    if (selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, { opacity: val });
    }
  };

  const setElementLayer = (val: "front" | "back" | "middle") => {
    if (selectedElementId && selectedPageId) {
      const targetLayer = val === "front" ? 15 : val === "back" ? 0 : 5;
      updateElement(selectedPageId, selectedElementId, { layer: targetLayer });
    }
  };

  const setWorkspaceThemeId = (id: WorkspaceThemeId) => {
    if (WORKSPACE_THEMES[id]) {
      setWorkspaceThemeIdState(id);
    }
  };

  const setBookTemplateId = (id: BookTemplateId) => {
    if (BOOK_TEMPLATES[id]) {
      setBookTemplateIdState(id);
      
      const newTemplate = BOOK_TEMPLATES[id];
      const titleFont = newTemplate.fonts.title;
      const bodyFont = newTemplate.fonts.body;

      setPageBgColor(newTemplate.colors.paperTint);
      
      setDocument((prevDoc) => {
        const updatedPages = prevDoc.pages.map((p) => {
          return {
            ...p,
            elements: p.elements.map((el) => {
              if (el.type !== "text") return el;
              
              const isChapterTitle = el.id.includes("title") || el.id.includes("num") || el.id.includes("cover");
              const updatedStyle = {
                ...el.style,
                fontFamily: isChapterTitle ? titleFont : bodyFont,
              };
              return { ...el, style: updatedStyle };
            }),
          };
        });

        const nextDoc = { ...prevDoc, pages: updatedPages };
        pushHistory(nextDoc);
        return nextDoc;
      });

      setSaveStatus("saving");
      setTimeout(() => setSaveStatus("saved"), 800);
    }
  };

  // Legacy theme sets
  const setThemeById = (id: string) => {
    if (WORKSPACE_THEMES[id]) {
      setWorkspaceThemeIdState(id as WorkspaceThemeId);
    } else if (BOOK_TEMPLATES[id]) {
      setBookTemplateId(id as BookTemplateId);
    }
  };

  // Styles Panel methods
  const createStyle = (newStyle: Omit<TypographyStyle, "id">) => {
    const styleId = `style-custom-${Date.now()}`;
    setTypographyStyles((prev) => [...prev, { ...newStyle, id: styleId }]);
  };

  const renameStyle = (id: string, newName: string) => {
    setTypographyStyles((prev) => prev.map((s) => s.id === id ? { ...s, name: newName } : s));
  };

  const duplicateStyle = (id: string) => {
    const styleToDup = typographyStyles.find((s) => s.id === id);
    if (styleToDup) {
      setTypographyStyles((prev) => [
        ...prev,
        { ...styleToDup, id: `style-custom-${Date.now()}`, name: `${styleToDup.name} Copy` },
      ]);
    }
  };

  const deleteStyle = (id: string) => {
    setTypographyStyles((prev) => prev.filter((s) => s.id !== id));
  };

  const applyStyle = (styleId: string) => {
    const targetStyle = typographyStyles.find((s) => s.id === styleId);
    if (targetStyle && selectedElementId && selectedPageId) {
      updateElement(selectedPageId, selectedElementId, {
        style: {
          fontFamily: targetStyle.fontFamily,
          fontSize: targetStyle.fontSize,
          fontWeight: targetStyle.fontWeight,
          fontStyle: targetStyle.fontStyle,
          textDecoration: targetStyle.textDecoration,
          color: targetStyle.color,
          textAlign: targetStyle.textAlign,
          lineHeight: targetStyle.lineHeight,
          letterSpacing: targetStyle.letterSpacing,
          wordSpacing: targetStyle.wordSpacing,
          paragraphSpacing: targetStyle.paragraphSpacing,
          textShadow: targetStyle.textShadow,
          smallCaps: targetStyle.smallCaps,
          associatedStyleId: styleId,
        },
      });
    }
  };

  const updateStyle = (id: string, updates: Partial<TypographyStyle>, updateAllInstances: boolean) => {
    setTypographyStyles((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
    
    if (updateAllInstances) {
      const targetStyle = typographyStyles.find((s) => s.id === id);
      if (targetStyle) {
        const mergedStyle = { ...targetStyle, ...updates };
        setDocument((prevDoc) => {
          const updatedPages = prevDoc.pages.map((p) => {
            return {
              ...p,
              elements: p.elements.map((el) => {
                if (el.type !== "text" || el.style.associatedStyleId !== id) return el;
                return {
                  ...el,
                  style: {
                    ...el.style,
                    fontFamily: mergedStyle.fontFamily,
                    fontSize: mergedStyle.fontSize,
                    fontWeight: mergedStyle.fontWeight,
                    fontStyle: mergedStyle.fontStyle,
                    textDecoration: mergedStyle.textDecoration,
                    color: mergedStyle.color,
                    textAlign: mergedStyle.textAlign,
                    lineHeight: mergedStyle.lineHeight,
                    letterSpacing: mergedStyle.letterSpacing,
                    wordSpacing: mergedStyle.wordSpacing,
                    paragraphSpacing: mergedStyle.paragraphSpacing,
                    textShadow: mergedStyle.textShadow,
                    smallCaps: mergedStyle.smallCaps,
                  },
                };
              }),
            };
          });
          const nextDoc = { ...prevDoc, pages: updatedPages };
          pushHistory(nextDoc);
          return nextDoc;
        });
      }
    }
  };

  // Custom colors modifiers
  const addRecentColor = (color: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 8);
    });
  };

  const addFavoriteColor = (color: string) => {
    setFavoriteColors((prev) => {
      if (prev.includes(color)) return prev;
      return [...prev, color].slice(0, 12);
    });
  };

  // Dynamic Empty State Creator
  const createNewBook = (option: "blank" | "template" | "import") => {
    setDocument(() => {
      let pages: BookPage[] = [];
      if (option === "blank") {
        pages = [
          {
            id: 1,
            title: "Cover Page",
            elements: [
              createTextElement("cover-title", "New Book", 140, 100, {
                style: { fontFamily: "Cinzel", fontSize: 28, textAlign: "center", fontWeight: "bold" }
              }),
              createTextElement("cover-author", "Untitled Author", 300, 30, {
                style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "center", fontStyle: "italic" }
              })
            ]
          },
          { id: 2, elements: [createTextElement("body-p2", "Start writing your masterpiece here...", 80, 300)] },
          { id: 3, elements: [createTextElement("body-p3", "Blank page.", 80, 300)] }
        ];
      } else if (option === "import") {
        pages = [
          {
            id: 1,
            title: "Cover Page",
            elements: [
              createTextElement("cover-title", "My Imported Chronicles", 140, 100, {
                style: { fontFamily: "Cinzel", fontSize: 26, textAlign: "center", fontWeight: "bold" }
              })
            ]
          },
          {
            id: 2,
            elements: [
              createTextElement("import-h", "Imported Chapter I", 50, 40, {
                style: { fontFamily: "Cinzel", fontSize: 16, textAlign: "center", fontWeight: "bold" }
              }),
              createTextElement("import-body", "This is an imported outline of your manuscript. You can rearrange chapters, edit paragraphs, drop in media assets, and switch typography themes using the panels around the editor workspace.", 120, 200)
            ]
          },
          { id: 3, elements: [createTextElement("import-p3", "Page 3. Double click to add custom prose.", 80, 300)] }
        ];
      } else {
        return generateMockBook();
      }
      
      const newDoc = {
        id: `book-${Date.now()}`,
        title: option === "blank" ? "Untitled Book" : "Imported Chronicles",
        pages
      };
      
      historyRef.current = [JSON.parse(JSON.stringify(newDoc))];
      historyIndexRef.current = 0;
      setHistoryPointer(0);
      setHistoryLength(0);
      setActivePage(1);
      
      return newDoc;
    });
  };

  const triggerSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
  };

  const undo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx > 0) {
      const prevIdx = idx - 1;
      const restored = historyRef.current[prevIdx];
      historyIndexRef.current = prevIdx;
      setHistoryPointer(prevIdx);
      setDocument(JSON.parse(JSON.stringify(restored)));
      setSelectedElementId(null);
      setSelectedPageId(null);
      setSaveStatus("unsaved");
      setTimeout(() => setSaveStatus("saved"), 1000);
    }
  }, []);

  const redo = useCallback(() => {
    const idx = historyIndexRef.current;
    const history = historyRef.current;
    if (idx < history.length - 1) {
      const nextIdx = idx + 1;
      const restored = history[nextIdx];
      historyIndexRef.current = nextIdx;
      setHistoryPointer(nextIdx);
      setDocument(JSON.parse(JSON.stringify(restored)));
      setSelectedElementId(null);
      setSelectedPageId(null);
      setSaveStatus("unsaved");
      setTimeout(() => setSaveStatus("saved"), 1000);
    }
  }, []);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readingMode) return;
      
      const isCtrl = e.ctrlKey || e.metaKey;
      
      if (isCtrl && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (isCtrl && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        const activeNode = window.document.activeElement;
        const isEditingText = activeNode && (
          activeNode.tagName === "INPUT" ||
          activeNode.tagName === "TEXTAREA" ||
          activeNode.hasAttribute("contenteditable")
        );
        if (!isEditingText && selectedElementId && selectedPageId) {
          e.preventDefault();
          deleteElement(selectedPageId, selectedElementId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, selectedElementId, selectedPageId, deleteElement, readingMode]);

  // Page spread actions
  const addPageSpread = useCallback(() => {
    setDocument((prevDoc) => {
      const lastPageId = prevDoc.pages.length;
      const newPage1: BookPage = {
        id: lastPageId + 1,
        elements: [
          createTextElement(`page-${lastPageId + 1}-hdr`, `Chronicles of Eldoria`, 40, 20, {
            opacity: 30,
            style: { fontFamily: bookTemplate.fonts.title, fontSize: 8, textAlign: "center" }
          }),
          createTextElement(`page-${lastPageId + 1}-body`, "Double-click to start writing a new section here.", 100, 100)
        ]
      };
      const newPage2: BookPage = {
        id: lastPageId + 2,
        elements: [
          createTextElement(`page-${lastPageId + 2}-hdr`, `Chronicles of Eldoria`, 40, 20, {
            opacity: 30,
            style: { fontFamily: bookTemplate.fonts.title, fontSize: 8, textAlign: "center" }
          }),
          createTextElement(`page-${lastPageId + 2}-body`, "Write corresponding chapter content or place media on this page.", 100, 100)
        ]
      };

      const nextDoc = {
        ...prevDoc,
        pages: [...prevDoc.pages, newPage1, newPage2],
      };
      pushHistory(nextDoc);
      return nextDoc;
    });
  }, [pushHistory, bookTemplate]);

  const deletePageSpread = useCallback((pageIndex: number) => {
    setDocument((prevDoc) => {
      const filteredPages = prevDoc.pages.filter(
        (p) => p.id !== pageIndex && p.id !== pageIndex + 1
      );
      
      const reindexedPages = filteredPages.map((page, idx) => {
        return {
          ...page,
          id: idx + 1,
        };
      });

      const nextDoc = {
        ...prevDoc,
        pages: reindexedPages,
      };
      pushHistory(nextDoc);
      return nextDoc;
    });
    setActivePage(Math.max(1, pageIndex - 2));
  }, [pushHistory]);

  const addAsset = (dataUrl: string) => {
    setAssets((prev) => [...prev, dataUrl]);
  };

  return (
    <StudioContext.Provider
      value={{
        // Themes & Templates
        workspaceTheme,
        workspaceThemeId,
        setWorkspaceThemeId,
        bookTemplate,
        bookTemplateId,
        setBookTemplateId,
        theme,
        setThemeById,

        activePage,
        setActivePage,
        totalPages: document.pages.length,
        zoom,
        setZoom,
        viewMode,
        setViewMode,
        collapsed,
        setCollapsed,
        activeTab,
        setActiveTab,
        
        // Typography properties
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
        
        // Advanced Typography states
        textColor,
        setTextColor,
        highlightColor,
        setHighlightColor,
        backgroundFill,
        setBackgroundFill,
        fontWeight,
        setFontWeight,
        fontStyle,
        setFontStyle,
        textDecoration,
        setTextDecoration,
        smallCaps,
        setSmallCaps,
        superscript,
        setSuperscript,
        subscript,
        setSubscript,
        wordSpacing,
        setWordSpacing,
        paragraphSpacing,
        setParagraphSpacing,
        dropCapEnabled,
        setDropCapEnabled,
        textShadow,
        setTextShadow,
        outlineColor,
        setOutlineColor,
        outlineWidth,
        setOutlineWidth,

        // Shapes & borders
        shapeType,
        setShapeType,
        borderColor,
        setBorderColor,
        borderWidth,
        setBorderWidth,
        borderRadius,
        setBorderRadius,
        boxShadow,
        setBoxShadow,
        backgroundColor,
        setBackgroundColor,

        // Paragraph styles
        typographyStyles,
        createStyle,
        renameStyle,
        duplicateStyle,
        deleteStyle,
        applyStyle,
        updateStyle,

        // Custom colors
        recentColors,
        addRecentColor,
        favoriteColors,
        addFavoriteColor,

        // Book Creator empty state modal
        openNewBookModal,
        setOpenNewBookModal,
        createNewBook,

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
        
        document,
        setDocument,
        selectedElementId,
        setSelectedElementId,
        selectedPageId,
        setSelectedPageId,
        readingMode,
        setReadingMode,
        pageTurnAnimation,
        setPageTurnAnimation,
        
        updateElement,
        addElement,
        deleteElement,
        arrangeElement,
        
        addPageSpread,
        deletePageSpread,
        
        assets,
        addAsset,
        
        saveStatus,
        triggerSave,
        undo,
        redo,
        historyPointer,
        historyLength,
        paginatePageText,
        
        // Dashboard & Global Navigation properties
        activeView,
        setActiveView,
        selectedBookId,
        setSelectedBookId,
        books,
        setBooks,
        user,
        setUser,
        workspaceNotes,
        setWorkspaceNotes,
        recentActivity,
        setRecentActivity,
        notifications,
        setNotifications,
        writingGoals,
        setWritingGoals,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
};
