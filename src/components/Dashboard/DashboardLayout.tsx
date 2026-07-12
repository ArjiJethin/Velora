"use client";

import React, { useState, useEffect } from "react";
import { useStudio } from "@/context/StudioContext";
import { BookDocument } from "@/types/editor";
import { generateMockBook, createTextElement } from "@/constants/mockBook";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Settings,
  Trash2,
  User,
  Bell,
  Gift,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Grid,
  List,
  Filter,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Book,
  FileText,
  Users,
  Compass,
  Heart,
  Globe,
  Sparkles,
  Database,
  CheckSquare,
  HelpCircle,
  Play,
  Copy,
  Archive,
  Download,
  Share2,
  MoreHorizontal,
  Flame,
  Clock,
  ChevronDown,
  X,
  FileUp,
  ChevronUp,
  Edit2
} from "lucide-react";

export default function DashboardLayout() {
  const {
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
    setDocument,
    setActivePage,
    workspaceTheme
  } = useStudio();

  const isDark = workspaceTheme.isDark;
  
  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewBookModal, setOpenNewBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookGenre, setNewBookGenre] = useState("Fantasy");
  const [newBookTemplate, setNewBookTemplate] = useState("fantasy");
  const [importText, setImportText] = useState("");
  const [importFileName, setImportFileName] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState("All");
  const [libraryView, setLibraryView] = useState<"grid" | "list">("grid");
  const [librarySearch, setLibrarySearch] = useState("");
  const [librarySort, setLibrarySort] = useState("recent");
  
  // Workspace (Author Notebook) state
  const [notebookTab, setNotebookTab] = useState<"all" | "note" | "character" | "world" | "location" | "research" | "timeline">("all");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<"note" | "character" | "world" | "location" | "research" | "timeline">("note");
  const [noteTags, setNoteTags] = useState("");

  // Checklist state for new user
  const [checklist, setChecklist] = useState([
    { id: "create", text: "Create your first book", completed: books.length > 1 },
    { id: "write", text: "Write your first chapter", completed: false },
    { id: "cover", text: "Add a cover", completed: true },
    { id: "goal", text: "Set your writing goal", completed: true },
    { id: "words", text: "Complete your first 500 words", completed: false }
  ]);

  useEffect(() => {
    setChecklist(prev => prev.map(item => {
      if (item.id === "create") {
        return { ...item, completed: books.length > 0 };
      }
      return item;
    }));
  }, [books]);

  // Open book inside the Book Studio
  const handleOpenStudio = (book: BookDocument) => {
    // If book is missing page data, generate mock structure
    let fullBook = book;
    if (!book.pages || book.pages.length === 0) {
      const freshMock = generateMockBook();
      fullBook = {
        ...book,
        pages: freshMock.pages
      };
      // update list
      setBooks(prev => prev.map(b => b.id === book.id ? fullBook : b));
    }
    
    setDocument(fullBook);
    setActivePage(5); // Go to start page spread
    setActiveView("studio");
  };

  // Create Book handler
  const handleCreateBook = (option: "blank" | "template" | "import") => {
    const freshId = `book-${Date.now()}`;
    let pagesArray = [];

    if (option === "blank" || option === "template") {
      const freshMock = generateMockBook();
      pagesArray = freshMock.pages;
    } else if (option === "import" && importText) {
      // Parse importText into mock pages
      const paragraphs = importText.split("\n\n").filter(Boolean);
      pagesArray.push({
        id: 1,
        title: "Cover Page",
        elements: [
          createTextElement("cover-title", newBookTitle || "Untitled Import", 180, 80, {
            style: { fontFamily: "Cinzel", fontSize: 28, textAlign: "center", fontWeight: "bold" }
          }),
          createTextElement("cover-author", user.name, 300, 30, {
            style: { fontFamily: "Playfair Display", fontSize: 13, textAlign: "center", fontStyle: "italic" }
          })
        ]
      });

      // Split paragraphs across pages
      paragraphs.forEach((pText, index) => {
        pagesArray.push({
          id: index + 2,
          title: `Chapter Section ${index + 1}`,
          elements: [
            createTextElement(`page-${index+2}-hdr`, newBookTitle, 40, 20, {
              opacity: 30,
              style: { fontSize: 8, textAlign: "center" }
            }),
            createTextElement(`page-${index+2}-body`, pText, 85, 300)
          ]
        });
      });
    }

    const newBookDoc: BookDocument = {
      id: freshId,
      title: newBookTitle || "Untitled Masterpiece",
      pages: pagesArray,
      genre: newBookGenre,
      wordCount: option === "import" ? importText.split(/\s+/).filter(Boolean).length : 0,
      targetWordCount: 80000,
      chapterCount: option === "import" ? Math.max(1, Math.ceil(pagesArray.length / 4)) : 10,
      lastEdited: "Just now",
      status: "Draft",
      coverImage: newBookTemplate.toLowerCase(),
      progress: 0,
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readingTime: option === "import" ? `${Math.ceil(importText.split(/\s+/).length / 200)}m` : "1m",
      tags: [newBookGenre, "Draft"],
      favorite: false
    };

    setBooks(prev => [newBookDoc, ...prev]);
    
    // Log Activity
    setRecentActivity(prev => [
      {
        id: `act-${Date.now()}`,
        type: option === "import" ? "import" : "add",
        description: `Created new book "${newBookDoc.title}"`,
        timestamp: "Just now",
        bookId: freshId
      },
      ...prev
    ]);

    setNewBookTitle("");
    setImportText("");
    setImportFileName("");
    setOpenNewBookModal(false);
    
    // Auto-open studio for new book
    handleOpenStudio(newBookDoc);
  };

  // Note actions
  const handleSaveNote = () => {
    if (!noteTitle) return;
    if (editingNoteId) {
      setWorkspaceNotes(prev => prev.map(n => n.id === editingNoteId ? {
        ...n,
        title: noteTitle,
        content: noteContent,
        type: noteType,
        tags: noteTags.split(",").map(t => t.trim()).filter(Boolean),
        lastEdited: "Just now"
      } : n));
      setEditingNoteId(null);
    } else {
      const newNote = {
        id: `note-${Date.now()}`,
        type: noteType,
        title: noteTitle,
        content: noteContent,
        tags: noteTags.split(",").map(t => t.trim()).filter(Boolean),
        lastEdited: "Just now",
        pinned: false
      };
      setWorkspaceNotes(prev => [newNote, ...prev]);
    }
    setNoteTitle("");
    setNoteContent("");
    setNoteTags("");
  };

  const handleEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteType(note.type);
    setNoteTags(note.tags?.join(", ") || "");
  };

  const handleDeleteNote = (noteId: string) => {
    setWorkspaceNotes(prev => prev.filter(n => n.id !== noteId));
    if (editingNoteId === noteId) {
      setEditingNoteId(null);
      setNoteTitle("");
      setNoteContent("");
      setNoteTags("");
    }
  };

  const handleTogglePinNote = (noteId: string) => {
    setWorkspaceNotes(prev => prev.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n));
  };

  // Book actions inside details page
  const activeBook = books.find(b => b.id === selectedBookId) || books[0];

  const handleToggleFavoriteBook = (bookId: string) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, favorite: !b.favorite } : b));
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
    // Log Activity
    const targetBook = books.find(b => b.id === bookId);
    setRecentActivity(prev => [
      {
        id: `act-${Date.now()}`,
        type: "change",
        description: `Moved "${targetBook?.title}" to trash`,
        timestamp: "Just now"
      },
      ...prev
    ]);
    if (selectedBookId === bookId) {
      setSelectedBookId(null);
      setActiveView("dashboard");
    }
  };

  const handleDuplicateBook = (book: BookDocument) => {
    const dupBook = {
      ...book,
      id: `book-${Date.now()}`,
      title: `${book.title} (Copy)`,
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastEdited: "Just now"
    };
    setBooks(prev => [dupBook, ...prev]);
  };

  // UI styling helpers
  const glassStyle = isDark
    ? "bg-white/[0.02] dark:bg-[#0E131F]/40 backdrop-blur-2xl border border-white/[0.07] shadow-xl"
    : "bg-white/65 backdrop-blur-2xl border border-black/[0.04] shadow-sm";

  const cardHover = "transition-all duration-300 hover:shadow-lg hover:border-black/10 dark:hover:border-white/15 hover:-translate-y-0.5";

  // Sidebar item rendering helper
  const renderSidebarItem = (viewName: string, label: string, icon: React.ReactNode) => {
    const isActive = activeView === viewName;
    return (
      <button
        onClick={() => {
          setSelectedBookId(null);
          setActiveView(viewName);
        }}
        className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-medium font-poppins transition-all relative ${
          isActive
            ? "text-[#D4AF37] dark:text-[#E8C35A] bg-amber-500/5 dark:bg-amber-400/5"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-bar"
            className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-[#D4AF37]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <span className={`transition-colors ${isActive ? "text-[#D4AF37] dark:text-[#E8C35A]" : "text-neutral-400 dark:text-neutral-500"}`}>
          {icon}
        </span>
        <span className="tracking-wide">{label}</span>
      </button>
    );
  };

  // 3D Bookshelf Book Cover Component
  const BookshelfBook: React.FC<{ book: BookDocument; onClick: () => void; onDoubleClick: () => void }> = ({ book, onClick, onDoubleClick }) => {
    const getCoverGradient = (coverStyle?: string) => {
      switch (coverStyle?.toLowerCase()) {
        case "fantasy":
          return "bg-gradient-to-br from-[#123023] via-[#0E2018] to-[#122A1E]";
        case "romance":
          return "bg-gradient-to-br from-[#0B132B] via-[#080F21] to-[#15233C]";
        case "sci-fi":
          return "bg-gradient-to-br from-[#EBE3D5] via-[#DECDB6] to-[#C4AF98]";
        case "classic":
          return "bg-gradient-to-br from-[#3C1642] via-[#2A0E2F] to-[#1E0921]";
        default:
          return "bg-gradient-to-br from-[#FAF6EE] via-[#EAE1D4] to-[#C8B89C]";
      }
    };

    const getTextColor = (coverStyle?: string) => {
      return coverStyle?.toLowerCase() === "sci-fi"
        ? "text-neutral-800"
        : "text-[#FAF5EB]";
    };

    const getSpineColor = (coverStyle?: string) => {
      switch (coverStyle?.toLowerCase()) {
        case "fantasy": return "bg-[#0A1611] border-r border-white/5";
        case "romance": return "bg-[#050B17] border-r border-white/5";
        case "sci-fi": return "bg-[#AA9680] border-r border-black/5";
        case "classic": return "bg-[#1B091E] border-r border-white/5";
        default: return "bg-[#AE9D80] border-r border-black/5";
      }
    };

    return (
      <div 
        onClick={onClick} 
        onDoubleClick={onDoubleClick} 
        className="flex flex-col items-center cursor-pointer select-none group"
      >
        {/* 3D Book Cover Container */}
        <div 
          className="relative w-[100px] h-[142px] transition-all duration-300 transform group-hover:-translate-y-3 group-hover:rotate-[-2deg] group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.18)] shadow-md rounded-[3px_5px_5px_3px] overflow-hidden flex border border-black/10 dark:border-white/5" 
          style={{ perspective: "600px", transformStyle: "preserve-3d" }}
        >
          {/* Book Spine crease */}
          <div className={`w-[8px] h-full ${getSpineColor(book.coverImage)}`} />
          
          {/* Page stack depth effect on right edge */}
          <div className="absolute right-0 top-1 bottom-1 w-[4px] bg-white border-l border-neutral-300/40 rounded-r-sm shadow-inner" />
          
          {/* Front Cover Face */}
          <div className={`flex-1 h-full p-2 flex flex-col justify-between relative border-l border-white/10 ${getCoverGradient(book.coverImage)}`}>
            {/* Soft inner glow decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Custom SVG emblems based on genre to mimic illustration details */}
            {book.coverImage?.toLowerCase() === "romance" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-white fill-none stroke-current" strokeWidth="2">
                  <circle cx="50" cy="50" r="30" />
                  <path d="M50 20 L50 80 M20 50 L80 50" />
                </svg>
              </div>
            )}
            
            {book.coverImage?.toLowerCase() === "sci-fi" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-neutral-800 fill-none stroke-current" strokeWidth="2">
                  <polygon points="50,15 90,80 10,80" />
                </svg>
              </div>
            )}

            <div className="flex flex-col items-center text-center mt-2 relative z-10">
              <span className={`text-[6.5px] uppercase tracking-wider opacity-60 font-bold font-poppins ${getTextColor(book.coverImage)}`}>
                {book.genre || "Novel"}
              </span>
              <span className={`text-[8.5px] font-bold font-cinzel leading-tight mt-1 line-clamp-3 ${getTextColor(book.coverImage)}`}>
                {book.title}
              </span>
            </div>
            
            <div className="flex flex-col items-center mb-1 relative z-10">
              <div className="w-5 h-[0.5px] bg-[#D4AF37] opacity-60 mb-1" />
              <span className={`text-[5.5px] tracking-wide opacity-75 font-mono ${getTextColor(book.coverImage)}`}>
                {book.wordCount?.toLocaleString() || "0"} W
              </span>
            </div>
          </div>
        </div>

        {/* Labels below */}
        <div className="text-center mt-3 max-w-[110px] font-poppins">
          <h4 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-100 truncate w-full">
            {book.title}
          </h4>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold leading-none ${
              book.status === "Completed" ? "bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#1B3A24]/60 dark:text-[#81C784]" :
              book.status === "Draft" ? "bg-[#FFF8E1] text-[#F57F17] dark:bg-[#3E2723]/60 dark:text-[#FFE082]" :
              "bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#1B3A24]/60 dark:text-[#81C784]"
            }`}>
              {book.status || "In Progress"}
            </span>
          </div>
          <span className="text-[8.5px] text-neutral-400 dark:text-neutral-500 block mt-1 font-medium">
            {book.completedChapters !== undefined ? `${book.completedChapters} / ${book.chapterCount}` : `0 / ${book.chapterCount}`} chapters
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-screen w-screen flex overflow-hidden theme-transition ${
      isDark ? "bg-[#0B0F15] text-[#F3F4F6]" : "bg-[#FAF6EE] text-[#2D2824]"
    }`}>
      {/* ============================================================== */}
      {/* 1. GLOBAL LEFT SIDEBAR NAVIGATION */}
      {/* ============================================================== */}
      <aside className={`w-[260px] h-full flex flex-col justify-between p-5 border-r border-black/[0.04] dark:border-white/[0.06] select-none shrink-0 ${
        isDark ? "bg-[#090D13]" : "bg-white/40 backdrop-blur-2xl"
      }`}>
        <div className="flex flex-col gap-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-3 py-1.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E2B747] to-[#C19B34] flex items-center justify-center text-white shadow-md">
              <BookOpen size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold font-poppins tracking-wider leading-none text-neutral-900 dark:text-white uppercase">
                Lumora
              </span>
              <span className="text-[8.5px] uppercase tracking-widest text-[#D4AF37] dark:text-[#E8C35A] font-medium leading-none mt-1">
                Book Studio
              </span>
            </div>
          </div>

          {/* Navigation Links Group */}
          <nav className="space-y-1">
            {renderSidebarItem("dashboard", "Dashboard", <BookOpen size={16} />)}
            {renderSidebarItem("library", "Library", <Book size={16} />)}
            {renderSidebarItem("workspace", "Workspace", <FileText size={16} />)}
            {renderSidebarItem("community", "Community", <Users size={16} />)}
            {renderSidebarItem("templates", "Templates", <Grid size={16} />)}
            {renderSidebarItem("favorites", "Favorites", <Heart size={16} />)}
            {renderSidebarItem("discover", "Discover", <Compass size={16} />)}
            
            <div className="h-[1px] bg-black/[0.04] dark:bg-white/[0.06] my-4" />

            {renderSidebarItem("profile", "Profile", <User size={16} />)}
            {renderSidebarItem("settings", "Settings", <Settings size={16} />)}
            {renderSidebarItem("trash", "Trash", <Trash2 size={16} />)}
          </nav>
        </div>

        {/* User Plan upgrade badge */}
        <div className="p-1 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 font-poppins">
            <span>Storage</span>
            <span className="font-mono">2.4 GB / 10 GB</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-0.5 mb-3.5">
            <div 
              className="h-full bg-[#D4AF37] rounded-full" 
              style={{ width: "24%" }} 
            />
          </div>
          <button 
            onClick={() => setUser(prev => ({ ...prev, plan: "premium", name: "Aurelia Vance" }))}
            className="w-full py-2 bg-amber-500/5 hover:bg-[#D4AF37] border border-[#D4AF37]/25 text-[#D4AF37] hover:text-white font-bold rounded-xl text-[10.5px] font-poppins transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={11} className="shrink-0" />
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN LAYOUT SHELL (FIXED HEADER + CONTENT VIEWPORT) */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* ============================================================== */}
        {/* TOP FIXED APP HEADER */}
        {/* ============================================================== */}
        <header className={`h-16 w-full flex items-center justify-between px-8 border-b border-black/[0.03] dark:border-white/[0.05] z-40 relative select-none shrink-0 ${
          isDark ? "bg-[#0B0F15]/90 backdrop-blur-2xl" : "bg-[#FAF6EE]/90 backdrop-blur-2xl"
        }`}>
          {/* Search bar widget */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={14} />
            <input
              type="text"
              placeholder="Search your books, notes, ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 text-[11.5px] rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37] focus:bg-white dark:focus:bg-[#0E131B] text-neutral-800 dark:text-neutral-100 font-poppins transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[8.5px] font-mono text-neutral-400 bg-neutral-200/50 dark:bg-neutral-800/60 dark:text-neutral-500 rounded-sm">
              ⌘K
            </span>
          </div>

          {/* Quick Actions Panel & Icons */}
          <div className="flex items-center gap-3.5 relative">
            <button 
              onClick={() => {
                setNewBookTitle("");
                setOpenNewBookModal(true);
              }}
              className="h-8.5 px-3 bg-[#D4AF37] hover:bg-[#C19B34] text-white font-bold rounded-xl text-[11.5px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={13} />
              New Book
            </button>

            {/* Gift button */}
            <button className="p-2 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors relative cursor-pointer text-neutral-500 dark:text-neutral-400">
              <Gift size={15} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors relative cursor-pointer text-neutral-500 dark:text-neutral-400"
              >
                <Bell size={15} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2 w-80 rounded-xl p-3 shadow-xl ${glassStyle}`}
                  >
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2 mb-2">
                      <span className="text-[11.5px] font-bold text-neutral-800 dark:text-neutral-100">Notifications</span>
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-[9px] text-[#D4AF37] hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-2 rounded-lg transition-colors ${n.read ? "opacity-75" : "bg-[#D4AF37]/5"}`}>
                          <h5 className="text-[10px] font-bold text-neutral-800 dark:text-neutral-100">{n.title}</h5>
                          <p className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5">{n.content}</p>
                          <span className="text-[8px] text-neutral-400 block mt-1">{n.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-white/[0.02] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <div className="w-6.5 h-6.5 rounded-lg bg-amber-400/20 text-[#D4AF37] flex items-center justify-center font-bold text-[11px] font-poppins">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex flex-col items-start text-left select-none">
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-100 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[8px] text-neutral-400 dark:text-neutral-500 leading-none">
                    {user.plan === "premium" ? "Premium" : "Free Plan"}
                  </span>
                </div>
                <ChevronDown size={11} className="text-neutral-400 mt-0.5" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl p-2 shadow-xl ${glassStyle}`}
                  >
                    <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 mb-1.5">
                      <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-100">{user.name}</p>
                      <p className="text-[9px] text-neutral-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setUser(prev => ({
                          ...prev,
                          name: prev.name === "New Writer" ? "Aurelia Vance" : "New Writer",
                          plan: prev.name === "New Writer" ? "premium" : "free"
                        }));
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[10px] text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] hover:text-[#D4AF37] transition-all cursor-pointer"
                    >
                      Swap Mock Account ({user.name === "New Writer" ? "Aurelia Vance" : "New Writer"})
                    </button>
                    <button 
                      onClick={() => {
                        setActiveView("profile");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[10px] text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-all"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        setActiveView("settings");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[10px] text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-all"
                    >
                      Account Settings
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ============================================================== */}
        {/* SCROLLABLE MAIN VIEWS AREA */}
        {/* ============================================================== */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin select-none relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView + (selectedBookId || "")}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-[1240px] mx-auto w-full pb-10"
            >
              {/* ============================================================== */}
              {/* VIEW: DASHBOARD (Existing User / New User) */}
              {/* ============================================================== */}
              {activeView === "dashboard" && (
                <>
                  {books.length > 0 ? (
                    /* EXISTING USER EXPERIENCE (Reference Image 1) */
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                      {/* Left & Center Columns (spans 3 columns of the 4-column grid) */}
                      <div className="xl:col-span-3 space-y-6">
                        
                        {/* Row 1: Greeting & Quote */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                          <div className="lg:col-span-2">
                            <h1 className="text-[28px] font-bold font-poppins text-neutral-900 dark:text-white tracking-tight">
                              Good afternoon, Aurelia! ✨
                            </h1>
                            <p className="text-[13px] text-neutral-500 mt-1.5 font-medium">
                              Every story you write shapes a world.
                            </p>
                          </div>
                          <div className="lg:col-span-1">
                            {/* Quote Card (Neil Gaiman) */}
                            <div className={`p-4.5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-[90px] border border-black/[0.03] dark:border-white/[0.04] ${glassStyle}`}>
                              <div className="flex gap-2 text-left pr-16 relative z-10">
                                <span className="text-[20px] font-serif text-[#D4AF37]/50 leading-none -mt-1 select-none">“</span>
                                <div className="-mt-0.5 flex flex-col">
                                  <p className="text-[10.5px] italic text-neutral-700 dark:text-neutral-300 font-serif leading-snug">
                                    A book is a dream that you hold in your hand.
                                  </p>
                                  <span className="text-[8px] font-bold text-neutral-400 dark:text-neutral-500 mt-1 font-poppins">
                                    — Neil Gaiman
                                  </span>
                                </div>
                              </div>
                              
                              {/* Quill & leaves SVG illustration */}
                              <div className="absolute right-0 bottom-0 top-0 w-20 flex items-center justify-center pointer-events-none select-none">
                                <svg viewBox="0 0 100 100" className="w-18 h-18 text-neutral-800 dark:text-white opacity-95">
                                  <path d="M42 82 Q30 75 22 55" stroke="#8EA082" strokeWidth="1" fill="none" opacity="0.65" strokeDasharray="1 1" />
                                  <circle cx="22" cy="55" r="1.5" fill="#8EA082" opacity="0.8" />
                                  <circle cx="27" cy="65" r="1" fill="#8EA082" opacity="0.8" />
                                  <path d="M68 82 Q78 72 82 58" stroke="#8EA082" strokeWidth="1" fill="none" opacity="0.65" strokeDasharray="1 1" />
                                  <circle cx="82" cy="58" r="1.5" fill="#8EA082" opacity="0.8" />
                                  
                                  {/* Glass Inkwell */}
                                  <path d="M38 72 L62 72 L66 84 L34 84 Z" fill="url(#glassGrad)" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" />
                                  <rect x="44" y="68" width="12" height="4" rx="1" fill="#D4AF37" opacity="0.8" />
                                  <rect x="42" y="70" width="16" height="2" rx="0.5" fill="#EAEAEA" />
                                  <path d="M36 78 L64 78 L65.5 83 L34.5 83 Z" fill="#1C1814" />
                                  
                                  {/* Quill Feather */}
                                  <path d="M50 70 Q58 45 74 18 Q76 15 78 17 Q80 19 77 23 Q63 48 50 70" fill="url(#quillFeather)" />
                                  <path d="M50 70 Q58 45 74 18" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
                                  
                                  <defs>
                                    <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)"/>
                                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0.45)"/>
                                    </linearGradient>
                                    <linearGradient id="quillFeather" x1="0" y1="1" x2="1" y2="0">
                                      <stop offset="0%" stopColor="#DFD5C2" />
                                      <stop offset="70%" stopColor="#FAF7F2" />
                                      <stop offset="100%" stopColor="#FFFFFF" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Continue Writing & Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            {/* Continue Writing primary Card */}
                            <div className={`p-5 rounded-2xl flex gap-5 items-stretch relative overflow-hidden ${glassStyle}`}>
                              {/* Book cover preview mockup */}
                              <div 
                                onClick={() => handleOpenStudio(activeBook)}
                                className="w-[100px] h-[142px] shadow-lg rounded-[2px_4px_4px_2px] overflow-hidden flex cursor-pointer shrink-0 border border-neutral-700/10 hover:scale-[1.03] transition-transform relative group"
                              >
                                <div className="w-[8px] h-full bg-[#121E16] z-10" />
                                {/* Cover Art content */}
                                <div className="flex-1 h-full p-2 flex flex-col justify-between bg-gradient-to-br from-[#123023] via-[#0E2018] to-[#122A1E] relative">
                                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
                                  <span className="text-[6.5px] text-[#D4AF37]/70 text-center uppercase tracking-wider font-bold font-poppins">Fantasy</span>
                                  <span className="text-[9.5px] font-bold font-cinzel text-[#FAF5EB] leading-tight text-center mt-3 line-clamp-3">THE LOST KINGDOM</span>
                                  <div className="flex flex-col items-center">
                                    <div className="w-4 h-[0.5px] bg-[#D4AF37] opacity-60 mb-0.5" />
                                    <span className="text-[5.5px] text-[#FAF5EB]/80 font-mono tracking-wider">24,530 W</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] font-poppins">
                                      Continue Writing
                                    </span>
                                    <button className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer">
                                      <MoreHorizontal size={14} />
                                    </button>
                                  </div>
                                  <h2 className="text-[17px] font-bold font-poppins text-neutral-900 dark:text-white mt-1">
                                    {activeBook.title}
                                  </h2>
                                  <p className="text-[10.5px] text-neutral-400 font-medium">
                                    {activeBook.genre} • {activeBook.chapterCount} Chapters
                                  </p>
                                  
                                  <div className="mt-3.5 flex items-center justify-between gap-3 font-poppins">
                                    <span className="text-[11.5px] font-semibold text-neutral-800 dark:text-neutral-200">
                                      {activeBook.wordCount?.toLocaleString() || "0"} / {activeBook.targetWordCount?.toLocaleString() || "80,000"} words
                                    </span>
                                    <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded-md">
                                      {activeBook.progress}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                                    <div 
                                      className="h-full bg-[#D4AF37] rounded-full"
                                      style={{ width: `${activeBook.progress}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-black/[0.03] dark:border-white/[0.04]">
                                  <span className="text-[9.5px] text-neutral-400 font-medium flex items-center gap-1 font-poppins">
                                    <Clock size={11} className="text-neutral-300" />
                                    Last edited 1 hour ago
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => {
                                        setSelectedBookId(activeBook.id);
                                        setActiveView("book-details");
                                      }}
                                      className="px-2.5 py-1 border border-black/5 dark:border-white/10 hover:bg-black/[0.01] dark:hover:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 font-bold rounded-lg text-[10px] cursor-pointer font-poppins transition-colors"
                                    >
                                      View Details
                                    </button>
                                    <button 
                                      onClick={() => handleOpenStudio(activeBook)}
                                      className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#C19B34] text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer shadow-xs font-poppins transition-all"
                                    >
                                      Open in Studio
                                      <ArrowRight size={11} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-1">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 h-full">
                              {/* Words Written */}
                              <div className={`p-3.5 rounded-2xl flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.04] ${glassStyle}`}>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#FAF0D4] dark:bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shadow-xs">
                                    <Edit2 size={13} />
                                  </div>
                                  <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-poppins">Words Written</span>
                                </div>
                                <div className="mt-2 text-left">
                                  <span className="text-[17px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins block leading-none">24,530</span>
                                  <span className="text-[8px] font-bold text-emerald-500 mt-1 flex items-center gap-0.5 font-poppins">
                                    <ChevronUp size={10} /> +12.5% this month
                                  </span>
                                </div>
                              </div>

                              {/* Pages Completed */}
                              <div className={`p-3.5 rounded-2xl flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.04] ${glassStyle}`}>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] dark:bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shadow-xs">
                                    <BookOpen size={13} />
                                  </div>
                                  <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-poppins">Pages Completed</span>
                                </div>
                                <div className="mt-2 text-left">
                                  <span className="text-[17px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins block leading-none font-mono">58</span>
                                  <span className="text-[8px] font-bold text-emerald-500 mt-1 flex items-center gap-0.5 font-poppins">
                                    <ChevronUp size={10} /> +7.3% this month
                                  </span>
                                </div>
                              </div>

                              {/* Writing Time */}
                              <div className={`p-3.5 rounded-2xl flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.04] ${glassStyle}`}>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#E6FDF4] dark:bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shadow-xs">
                                    <Calendar size={13} />
                                  </div>
                                  <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-poppins">Writing Time</span>
                                </div>
                                <div className="mt-2 text-left">
                                  <span className="text-[17px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins block leading-none">18h 24m</span>
                                  <span className="text-[8px] font-bold text-emerald-500 mt-1 flex items-center gap-0.5 font-poppins">
                                    <ChevronUp size={10} /> +8.1% this month
                                  </span>
                                </div>
                              </div>

                              {/* Writing Streak */}
                              <div className={`p-3.5 rounded-2xl flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.04] ${glassStyle}`}>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#FEE2E2] dark:bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center shadow-xs animate-pulse">
                                    <Flame size={13} />
                                  </div>
                                  <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-poppins">Writing Streak</span>
                                </div>
                                <div className="mt-2 text-left font-poppins">
                                  <span className="text-[17px] font-bold text-neutral-800 dark:text-neutral-100 block leading-none font-mono">12</span>
                                  <span className="text-[8px] font-bold text-neutral-400 dark:text-neutral-500 mt-1 block">
                                    days in a row 🔥
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Your Bookshelf */}
                        <div className={`p-5 rounded-2xl relative ${glassStyle}`}>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider">
                              Your Bookshelf
                            </h3>
                            <button 
                              onClick={() => {
                                setLibraryFilter("All");
                                setActiveView("library");
                              }}
                              className="text-[11.5px] font-bold text-[#D4AF37] hover:underline flex items-center gap-0.5 font-poppins"
                            >
                              View all
                              <ChevronRight size={12} />
                            </button>
                          </div>

                          {/* 3D Shelf Books list */}
                          <div className="relative pt-2 pb-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-5 relative z-10">
                              {books.slice(0, 4).map(b => (
                                <BookshelfBook 
                                  key={b.id} 
                                  book={b} 
                                  onClick={() => {
                                    setSelectedBookId(b.id);
                                    setActiveView("book-details");
                                  }}
                                  onDoubleClick={() => handleOpenStudio(b)}
                                />
                              ))}
                              {/* Create book placeholder */}
                              <div 
                                onClick={() => {
                                  setNewBookTitle("");
                                  setOpenNewBookModal(true);
                                }}
                                className="flex flex-col items-center justify-center cursor-pointer group"
                              >
                                <div className="w-[100px] h-[142px] border-2 border-dashed border-black/10 dark:border-white/10 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/5 rounded-[3px_5px_5px_3px] transition-all flex flex-col items-center justify-center gap-2 bg-white/20 dark:bg-black/10">
                                  <Plus size={18} className="text-neutral-400 group-hover:text-[#D4AF37] group-hover:scale-110 transition-transform" />
                                  <span className="text-[10px] text-neutral-400 group-hover:text-[#D4AF37] font-medium font-poppins">New Book</span>
                                </div>
                                <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-100 mt-3 opacity-0 group-hover:opacity-100 transition-opacity font-poppins">
                                  Start fresh
                                </span>
                              </div>
                            </div>
                            {/* Shelf wood ledge overlay */}
                            <div className="absolute -bottom-3 inset-x-0 h-4 bg-gradient-to-b from-[#FAF5EB] via-[#E2D8C9] to-[#D5C9B7] dark:from-[#161D26] dark:via-[#11161D] dark:to-[#0A0D12] border-t border-black/5 dark:border-white/5 rounded-md shadow-[0_6px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)]" />
                          </div>
                        </div>

                        {/* Row 4: Explore Templates & Quick Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Explore Templates */}
                          <div className={`p-5 rounded-2xl ${glassStyle}`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider">
                                Explore Templates
                              </h4>
                              <button 
                                onClick={() => setActiveView("templates")}
                                className="text-[10.5px] font-bold text-[#D4AF37] hover:underline font-poppins"
                              >
                                View all
                              </button>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {[
                                { name: "Fantasy", count: "12 Templates", fromColor: "#123023", toColor: "#122A1E" },
                                { name: "Romance", count: "8 Templates", fromColor: "#F43F5E", toColor: "#ECCAF4" },
                                { name: "Sci-Fi", count: "10 Templates", fromColor: "#1D2A44", toColor: "#0B132B" },
                                { name: "Classic", count: "7 Templates", fromColor: "#3C1642", toColor: "#1E0921" }
                              ].map((t) => (
                                <div 
                                  key={t.name}
                                  onClick={() => {
                                    setNewBookGenre(t.name);
                                    setNewBookTemplate(t.name.toLowerCase());
                                    setOpenNewBookModal(true);
                                  }}
                                  className="p-1.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.015] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[92px]"
                                >
                                  <div 
                                    className="w-full h-11 rounded-lg mb-1.5 shadow-inner" 
                                    style={{ background: `linear-gradient(135deg, ${t.fromColor}, ${t.toColor})` }}
                                  />
                                  <div className="flex flex-col text-center">
                                    <span className="text-[8.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins">{t.name}</span>
                                    <span className="text-[7.5px] text-neutral-400 dark:text-neutral-500 font-poppins font-medium">{t.count}</span>
                                  </div>
                                </div>
                              ))}
                              {/* All Templates button */}
                              <div 
                                onClick={() => setActiveView("templates")}
                                className="p-1.5 rounded-xl border border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] bg-amber-500/[0.02] hover:bg-[#D4AF37]/5 transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[92px]"
                              >
                                <div className="w-full h-11 rounded-lg mb-1.5 flex items-center justify-center bg-amber-100 dark:bg-amber-950/20 text-[#D4AF37]">
                                  <Grid size={16} />
                                </div>
                                <div className="flex flex-col text-center">
                                  <span className="text-[8.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins">All</span>
                                  <span className="text-[7.5px] text-[#D4AF37] font-bold font-poppins">Templates</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className={`p-5 rounded-2xl ${glassStyle}`}>
                            <h4 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                              Quick Actions
                            </h4>
                            <div className="grid grid-cols-5 gap-2">
                              {/* Action 1: New Book */}
                              <button 
                                onClick={() => {
                                  setNewBookTitle("");
                                  setOpenNewBookModal(true);
                                }}
                                className="p-1.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.015] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[92px]"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#FAF0D4] dark:bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-1 shadow-xs">
                                  <Edit2 size={13} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins leading-none mb-0.5">New Book</span>
                                  <span className="text-[7px] text-neutral-400 dark:text-neutral-500 font-poppins font-medium leading-none">Scratch</span>
                                </div>
                              </button>

                              {/* Action 2: Import */}
                              <button 
                                onClick={() => {
                                  setNewBookTitle("");
                                  setOpenNewBookModal(true);
                                }}
                                className="p-1.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.015] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[92px]"
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 shadow-xs">
                                  <FileUp size={13} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins leading-none mb-0.5">Import</span>
                                  <span className="text-[7px] text-neutral-400 dark:text-neutral-500 font-poppins font-medium leading-none">TXT, DOCX</span>
                                </div>
                              </button>

                              {/* Action 3: AI Story Assistant */}
                              <button 
                                onClick={() => {
                                  setActiveView("discover");
                                }}
                                className="p-1.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.015] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[92px]"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#E6FDF4] dark:bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mb-1 shadow-xs">
                                  <Sparkles size={13} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins leading-none mb-0.5">AI Story</span>
                                  <span className="text-[7px] text-neutral-400 dark:text-neutral-500 font-poppins font-medium leading-none">Assistant</span>
                                </div>
                              </button>

                              {/* Action 4: Writing Goals */}
                              <button 
                                onClick={() => {
                                  setActiveView("settings");
                                }}
                                className="p-1.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.015] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[92px]"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#FFF2E2] dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mb-1 shadow-xs">
                                  <Flame size={13} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins leading-none mb-0.5">Goals</span>
                                  <span className="text-[7px] text-neutral-400 dark:text-neutral-500 font-poppins font-medium leading-none">Streak</span>
                                </div>
                              </button>

                              {/* Action 5: Book Settings */}
                              <button 
                                onClick={() => {
                                  setActiveView("settings");
                                }}
                                className="p-1.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.015] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[92px]"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1 shadow-xs">
                                  <Settings size={13} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins leading-none mb-0.5">Settings</span>
                                  <span className="text-[7px] text-neutral-400 dark:text-neutral-500 font-poppins font-medium leading-none">Defaults</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Right 1 Column (Writing Calendar & Recent Activity) */}
                      <div className="xl:col-span-1 space-y-6">
                        {/* Writing Calendar Card */}
                        <div className={`p-5 rounded-2xl ${glassStyle}`}>
                          <div className="flex items-center justify-between mb-4 font-poppins">
                            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                              Writing Calendar
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-neutral-500">May 2026</span>
                              <div className="flex gap-0.5">
                                <button className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-700 cursor-pointer"><ChevronLeft size={12} /></button>
                                <button className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-700 cursor-pointer"><ChevronRight size={12} /></button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Calendar Days */}
                          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center font-poppins">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                              <span key={i} className="text-[8.5px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">{d}</span>
                            ))}
                            {/* May 2026 starts on Friday */}
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={`empty-${i}`} className="aspect-square text-[9.5px] text-neutral-300 dark:text-neutral-700 flex items-center justify-center">
                                {27 + i}
                              </div>
                            ))}
                            {Array.from({ length: 31 }, (_, idx) => {
                              const day = idx + 1;
                              // Match image goals:
                              // Green dot = Writing Goal Met (days 6, 8, 9, 10, 11, 18, 19, 24, 25)
                              // Yellow dot = Partial Goal (days 7, 20, 26)
                              const metGoal = [6, 8, 9, 10, 11, 18, 19, 24, 25].includes(day);
                              const partialGoal = [7, 20, 26].includes(day);
                              const isToday = day === 12;

                              return (
                                <div 
                                  key={idx} 
                                  className={`aspect-square flex flex-col items-center justify-center text-[10px] rounded-lg relative ${
                                    isToday ? "bg-[#D4AF37] text-white font-bold shadow-xs" :
                                    "text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
                                  }`}
                                >
                                  <span className="leading-none">{day}</span>
                                  {/* Small status dot at bottom of date */}
                                  {metGoal && !isToday && (
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-0.5" />
                                  )}
                                  {partialGoal && !isToday && (
                                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-0.5" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Legend */}
                          <div className="flex items-center gap-4 mt-5 pt-3 border-t border-black/[0.03] dark:border-white/[0.04] text-[9px] font-poppins font-medium text-neutral-400">
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              <span>Writing Goal Met</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                              <span>Partial Goal</span>
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity Timeline */}
                        <div className={`p-5 rounded-2xl ${glassStyle}`}>
                          <div className="flex items-center justify-between mb-5 font-poppins">
                            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                              Recent Activity
                            </h3>
                            <button 
                              onClick={() => {
                                setLibraryFilter("All");
                                setActiveView("library");
                              }}
                              className="text-[10.5px] font-bold text-[#D4AF37] hover:underline"
                            >
                              View all →
                            </button>
                          </div>
                          
                          <div className="space-y-4 font-poppins">
                            {[
                              { id: "act-1", description: "Edited Chapter 3: The Silver Gate", timestamp: "2 minutes ago", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", icon: <Edit2 size={11} /> },
                              { id: "act-2", description: "Added 450 words to Chapter 4", timestamp: "1 hour ago", color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400", icon: <Plus size={11} /> },
                              { id: "act-3", description: "Imported image \"castle-concept.jpg\"", timestamp: "3 hours ago", color: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400", icon: <FileUp size={11} /> },
                              { id: "act-4", description: "Changed text style \"Chapter Title\"", timestamp: "Yesterday", color: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400", icon: <Edit2 size={11} /> }
                            ].map((act, index) => (
                              <div key={act.id} className="flex gap-3 text-left">
                                <div className="flex flex-col items-center">
                                  <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 ${act.color}`}>
                                    {act.icon}
                                  </div>
                                  {index < 3 && <div className="w-0.5 flex-1 bg-black/[0.04] dark:bg-white/[0.06] mt-2.5" />}
                                </div>
                                <div className="pt-0.5 flex-1">
                                  <p className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                                    {act.description}
                                  </p>
                                  <span className="text-[8.5px] text-neutral-400 dark:text-neutral-500 mt-0.5 block">{act.timestamp}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NEW USER EXPERIENCE (Reference Image 2) */
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      {/* Left 2 Columns */}
                      <div className="xl:col-span-2 space-y-6">
                        {/* Welcome Hero card */}
                        <div className={`p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center justify-between ${glassStyle}`}>
                          {/* Sparkle background decoration */}
                          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
                            <Sparkles size={250} />
                          </div>

                          <div className="space-y-4 flex-1">
                            <h1 className="text-2xl font-bold font-poppins text-neutral-900 dark:text-white leading-tight">
                              Welcome to Lumora, New Writer! ✨
                            </h1>
                            <p className="text-[13px] text-neutral-500 leading-relaxed">
                              Your story begins here. Let's turn your ideas into something unforgettable. Start a blank book or explore our beautiful templates.
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                              <button 
                                onClick={() => {
                                  setNewBookTitle("");
                                  setOpenNewBookModal(true);
                                }}
                                className="px-5 h-10 bg-[#D4AF37] hover:bg-[#C19B34] text-white font-bold rounded-xl text-[12px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Plus size={14} />
                                New Book
                              </button>
                              <button 
                                onClick={() => setActiveView("templates")}
                                className="px-5 h-10 border border-black/5 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-[12px] cursor-pointer"
                              >
                                Explore Templates
                              </button>
                            </div>
                          </div>

                          {/* Open Book illustration preview */}
                          <div className="relative w-48 h-32 flex items-center justify-center shrink-0">
                            <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl blur-lg" />
                            <BookOpen size={64} className="text-[#D4AF37] relative z-10 animate-pulse" />
                          </div>
                        </div>

                        {/* Start with Template section */}
                        <div className={`p-6 rounded-2xl ${glassStyle}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider">
                              Start with a Template
                            </h3>
                            <button 
                              onClick={() => setActiveView("templates")}
                              className="text-[10.5px] font-bold text-[#D4AF37] hover:underline"
                            >
                              View all templates
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {["Fantasy", "Romance", "Sci-Fi", "Classic", "Mystery"].map((genre) => (
                              <div 
                                key={genre}
                                onClick={() => {
                                  setNewBookGenre(genre);
                                  setNewBookTemplate(genre.toLowerCase());
                                  setOpenNewBookModal(true);
                                }}
                                className={`p-3 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer ${cardHover}`}
                              >
                                <div className="w-[60px] h-[85px] bg-[#D4AF37]/10 dark:bg-white/[0.02] rounded-md flex items-center justify-center text-neutral-400 group-hover:text-[#D4AF37] mb-2.5">
                                  <Book size={24} className="text-[#D4AF37]/60" />
                                </div>
                                <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-100">{genre}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* How it works layout */}
                        <div className={`p-6 rounded-2xl ${glassStyle}`}>
                          <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider mb-6">
                            How it works
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                            {[
                              { step: "1", title: "Create", desc: "Start a new book or choose a template." },
                              { step: "2", title: "Write", desc: "Use the studio to write, organize and design." },
                              { step: "3", title: "Design", desc: "Add beautiful elements and bring it to life." },
                              { step: "4", title: "Publish", desc: "Export and share your masterpiece." }
                            ].map((item, idx) => (
                              <div key={item.step} className="flex flex-col items-center text-center relative">
                                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 dark:bg-white/[0.03] text-[#D4AF37] flex items-center justify-center font-bold text-[13px] font-poppins mb-3">
                                  {item.step}
                                </div>
                                <h4 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-100">{item.title}</h4>
                                <p className="text-[9.5px] text-neutral-400 mt-1">{item.desc}</p>
                                
                                {idx < 3 && (
                                  <div className="hidden sm:block absolute top-5 -right-3 w-6 h-[0.5px] bg-neutral-300 dark:bg-neutral-800" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right 1 Column checklist, quote, resources */}
                      <div className="space-y-6">
                        {/* Start Checklist card */}
                        <div className={`p-5 rounded-2xl ${glassStyle}`}>
                          <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                            Let's get you started
                          </h3>
                          
                          <div className="space-y-3">
                            {checklist.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 text-left">
                                <button 
                                  onClick={() => {
                                    if (item.id === "create" && !item.completed) {
                                      setNewBookTitle("");
                                      setOpenNewBookModal(true);
                                    } else {
                                      setChecklist(prev => prev.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i));
                                    }
                                  }}
                                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                    item.completed 
                                      ? "bg-[#D4AF37] border-[#D4AF37] text-white" 
                                      : "border-black/10 dark:border-white/10 hover:border-[#D4AF37]"
                                  }`}
                                >
                                  {item.completed && <CheckSquare size={11} />}
                                </button>
                                <span className={`text-[11px] font-medium transition-all ${
                                  item.completed 
                                    ? "line-through text-neutral-400" 
                                    : "text-neutral-700 dark:text-neutral-300"
                                }`}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tip of Day quote */}
                        <div className={`p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden ${glassStyle}`}>
                          <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider">
                            Writing Tip of the Day
                          </h3>
                          <span className="text-[32px] font-serif text-[#D4AF37]/35 leading-none">“</span>
                          <p className="text-[12.5px] italic text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed -mt-3.5">
                            Don't worry about writing the perfect first draft. Just write.
                          </p>
                          <span className="text-[10px] font-bold text-neutral-500 font-poppins text-right w-full">
                            — Anne Lamott
                          </span>
                        </div>

                        {/* Helpful Resources list */}
                        <div className={`p-5 rounded-2xl ${glassStyle}`}>
                          <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                            Helpful Resources
                          </h3>
                          
                          <div className="space-y-3">
                            {[
                              { title: "Getting Started Guide", desc: "Learn the basics of Lumora", icon: <BookOpen size={13} /> },
                              { title: "Writing Best Practices", desc: "Tips to improve your writing", icon: <Edit2 size={13} /> },
                              { title: "Keyboard Shortcuts", desc: "Work faster in the studio", icon: <Database size={13} /> }
                            ].map((res) => (
                              <div key={res.title} className={`p-2.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.015] hover:bg-black/[0.02] hover:border-[#D4AF37]/30 transition-all flex items-start gap-3 cursor-pointer ${cardHover}`}>
                                <span className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] mt-0.5">
                                  {res.icon}
                                </span>
                                <div className="flex flex-col text-left">
                                  <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-100">{res.title}</span>
                                  <span className="text-[9px] text-neutral-400">{res.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ============================================================== */}
              {/* VIEW: LIBRARY */}
              {/* ============================================================== */}
              {activeView === "library" && (
                <div className="space-y-6">
                  {/* Library header toolbar */}
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold font-poppins text-neutral-900 dark:text-white">
                        Author Library
                      </h1>
                      <p className="text-[11.5px] text-neutral-500 mt-0.5">
                        Manage drafts, favorites, and published novels.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {/* Search */}
                      <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={13} />
                        <input
                          type="text"
                          placeholder="Search library..."
                          value={librarySearch}
                          onChange={(e) => setLibrarySearch(e.target.value)}
                          className="w-full md:w-48 pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* Sort Dropdown */}
                      <div className="relative">
                        <select 
                          value={librarySort}
                          onChange={(e) => setLibrarySort(e.target.value)}
                          className="pl-3 pr-8 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none font-poppins text-neutral-700 dark:text-neutral-300 appearance-none cursor-pointer"
                        >
                          <option value="recent">Recent Edit</option>
                          <option value="alphabetical">Title A-Z</option>
                          <option value="words">Word Count</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
                      </div>

                      {/* View toggles */}
                      <div className="flex items-center border border-black/5 dark:border-white/5 rounded-lg overflow-hidden bg-black/[0.01] dark:bg-white/[0.02]">
                        <button 
                          onClick={() => setLibraryView("grid")}
                          className={`p-2 cursor-pointer ${libraryView === "grid" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-neutral-400"}`}
                        >
                          <Grid size={13} />
                        </button>
                        <button 
                          onClick={() => setLibraryView("list")}
                          className={`p-2 cursor-pointer ${libraryView === "list" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-neutral-400"}`}
                        >
                          <List size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filter tabs row */}
                  <div className="flex items-center gap-1.5 border-b border-black/5 dark:border-white/5 pb-2">
                    {["All", "In Progress", "Draft", "Completed", "Favorites"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setLibraryFilter(tab)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg font-poppins transition-all cursor-pointer ${
                          libraryFilter === tab
                            ? "bg-[#D4AF37] text-white"
                            : "text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Books grid/list layout */}
                  {(() => {
                    // filter books
                    let filtered = books.filter(b => {
                      const matchesSearch = b.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
                                           b.genre?.toLowerCase().includes(librarySearch.toLowerCase());
                      if (!matchesSearch) return false;

                      if (libraryFilter === "Favorites") return b.favorite;
                      if (libraryFilter !== "All" && b.status !== libraryFilter) return false;
                      return true;
                    });

                    // sort books
                    if (librarySort === "alphabetical") {
                      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
                    } else if (librarySort === "words") {
                      filtered = [...filtered].sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
                    }

                    if (filtered.length === 0) {
                      return (
                        <div className="py-20 text-center">
                          <BookOpen size={48} className="mx-auto text-neutral-300 mb-3" />
                          <p className="text-[13px] text-neutral-500">No books found matching this filter.</p>
                        </div>
                      );
                    }

                    if (libraryView === "list") {
                      return (
                        <div className={`rounded-2xl overflow-hidden divide-y divide-black/5 dark:divide-white/5 ${glassStyle}`}>
                          {filtered.map(b => (
                            <div 
                              key={b.id} 
                              onClick={() => {
                                setSelectedBookId(b.id);
                                setActiveView("book-details");
                              }}
                              className="p-4 hover:bg-black/[0.015] dark:hover:bg-white/[0.015] flex items-center justify-between cursor-pointer select-none transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-13 rounded bg-[#D4AF37]/10 flex items-center justify-center font-bold text-[10px] text-[#D4AF37]">
                                  B
                                </div>
                                <div className="text-left">
                                  <h3 className="text-[12.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins">{b.title}</h3>
                                  <p className="text-[10px] text-neutral-400 mt-0.5">{b.genre} • {b.createdDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right font-mono text-[10.5px] text-neutral-600 dark:text-neutral-400">
                                  {b.wordCount?.toLocaleString()} words
                                </div>
                                <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${
                                  b.status === "Completed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" :
                                  b.status === "Draft" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" :
                                  "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                                }`}>
                                  {b.status}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenStudio(b);
                                  }}
                                  className="p-2 rounded-lg bg-[#D4AF37] hover:bg-[#C19B34] text-white transition-all"
                                >
                                  <Play size={10} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filtered.map(b => (
                          <div 
                            key={b.id} 
                            className={`p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer ${glassStyle} ${cardHover}`}
                            onClick={() => {
                              setSelectedBookId(b.id);
                              setActiveView("book-details");
                            }}
                          >
                            {/* Stand cover */}
                            <div className="w-[80px] h-[115px] shadow-md rounded-[2px_3px_3px_2px] bg-gradient-to-br from-[#1E293B] to-[#1E3A8A] flex items-center justify-center text-white/50 text-[10px] font-cinzel font-bold mb-3">
                              Cover
                            </div>
                            <h3 className="text-[11.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins truncate w-full">{b.title}</h3>
                            <span className="text-[9.5px] text-neutral-400 mt-0.5">{b.genre}</span>
                            <div className="flex items-center justify-between w-full mt-4 border-t border-black/5 dark:border-white/5 pt-2.5">
                              <span className="text-[9.5px] text-neutral-500 font-mono">{b.wordCount?.toLocaleString()} W</span>
                              <span className="text-[9px] font-bold text-[#D4AF37]">{b.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: WORKSPACE (Pre-Writing Author Notebook) */}
              {/* ============================================================== */}
              {activeView === "workspace" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-poppins text-neutral-900 dark:text-white">
                      Author Notebook & Planning
                    </h1>
                    <p className="text-[11.5px] text-neutral-500 mt-0.5">
                      Outline characters, flesh out worldbuilding rules, and store outline notes before writing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 1 Column: Note Editor form */}
                    <div className={`p-5 rounded-2xl space-y-4 h-fit ${glassStyle}`}>
                      <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider">
                        {editingNoteId ? "Edit Planning Note" : "Create Planning Note"}
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 mb-1">Title</label>
                          <input
                            type="text"
                            placeholder="Note title..."
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 mb-1">Type</label>
                          <select
                            value={noteType}
                            onChange={(e) => setNoteType(e.target.value as any)}
                            className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none font-poppins text-neutral-700 dark:text-neutral-300"
                          >
                            <option value="note">Scratch Note</option>
                            <option value="character">Character Outline</option>
                            <option value="world">Worldbuilding Rule</option>
                            <option value="location">Location Guide</option>
                            <option value="research">Research Material</option>
                            <option value="timeline">Book Timeline</option>
                          </select>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 mb-1">Content</label>
                          <textarea
                            placeholder="Write your outline details..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37] font-sans"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 mb-1">Tags (Comma-separated)</label>
                          <input
                            type="text"
                            placeholder="Lore, Protagonist, Act 1..."
                            value={noteTags}
                            onChange={(e) => setNoteTags(e.target.value)}
                            className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button 
                          onClick={handleSaveNote}
                          className="flex-1 py-2 bg-[#D4AF37] hover:bg-[#C19B34] text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer shadow-xs"
                        >
                          {editingNoteId ? "Save Changes" : "Add Note"}
                        </button>
                        {editingNoteId && (
                          <button 
                            onClick={() => {
                              setEditingNoteId(null);
                              setNoteTitle("");
                              setNoteContent("");
                              setNoteTags("");
                            }}
                            className="px-3 py-2 border border-black/5 dark:border-white/10 hover:bg-black/[0.02] text-neutral-500 rounded-lg text-[11px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right 2 Columns: Saved Notes list */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Filter subtabs */}
                      <div className="flex items-center gap-1.5 border-b border-black/5 dark:border-white/5 pb-2">
                        {[
                          { id: "all", label: "All Notes" },
                          { id: "note", label: "General" },
                          { id: "character", label: "Characters" },
                          { id: "world", label: "Worldbuilding" },
                          { id: "location", label: "Locations" },
                          { id: "research", label: "Research" },
                          { id: "timeline", label: "Timelines" }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setNotebookTab(t.id as any)}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg font-poppins transition-all cursor-pointer ${
                              notebookTab === t.id
                                ? "bg-amber-500/10 text-[#D4AF37] border border-[#D4AF37]/35"
                                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Notes grid */}
                      {(() => {
                        const filteredNotes = workspaceNotes.filter(n => {
                          if (notebookTab === "all") return true;
                          return n.type === notebookTab;
                        });

                        if (filteredNotes.length === 0) {
                          return (
                            <div className={`p-10 text-center rounded-2xl ${glassStyle}`}>
                              <Sparkles size={32} className="mx-auto text-neutral-300 mb-2" />
                              <p className="text-[12px] text-neutral-500">No planning notes in this category. Write your first one!</p>
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredNotes.map(n => (
                              <div 
                                key={n.id} 
                                className={`p-4 rounded-xl flex flex-col justify-between text-left relative group ${glassStyle} ${cardHover}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className={`text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${
                                      n.type === "character" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300" :
                                      n.type === "world" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300" :
                                      n.type === "location" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" :
                                      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300"
                                    }`}>
                                      {n.type}
                                    </span>
                                    
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => handleTogglePinNote(n.id)}
                                        className={`p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer ${n.pinned ? "text-[#D4AF37]" : "text-neutral-400"}`}
                                      >
                                        <Bookmark size={12} />
                                      </button>
                                      <button 
                                        onClick={() => handleEditNote(n)}
                                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteNote(n.id)}
                                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-red-500 cursor-pointer"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <h4 className="text-[12.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins">{n.title}</h4>
                                  <p className="text-[10.5px] text-neutral-600 dark:text-neutral-400 mt-2 whitespace-pre-line leading-relaxed font-sans">{n.content}</p>
                                </div>

                                <div className="flex flex-wrap gap-1 mt-4 pt-2.5 border-t border-black/[0.03] dark:border-white/[0.04]">
                                  {n.tags?.map((t: string) => (
                                    <span key={t} className="text-[8.5px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800/40 px-1.5 py-0.5 rounded-sm">#{t}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: COMMUNITY (Placeholder) */}
              {/* ============================================================== */}
              {activeView === "community" && (
                <div className={`p-8 rounded-2xl text-center max-w-lg mx-auto ${glassStyle}`}>
                  <Globe size={48} className="mx-auto text-[#D4AF37] mb-4 animate-spin" style={{ animationDuration: "12s" }} />
                  <h1 className="text-xl font-bold font-poppins text-neutral-900 dark:text-white">Lumora Writing Community</h1>
                  <p className="text-[12px] text-neutral-500 mt-2 leading-relaxed">
                    Connect with featured authors, join weekly writing challenges, share drafts, and read stories created inside Lumora. This feature is in beta and will launch in the next version.
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    <div className="p-3.5 rounded-xl bg-black/[0.01] dark:bg-white/[0.02] text-left border border-black/5 dark:border-white/5">
                      <span className="text-[9px] uppercase font-bold text-amber-500">Upcoming Challenge</span>
                      <h4 className="text-[11.5px] font-bold text-neutral-800 dark:text-neutral-100 mt-0.5">50k Words Autumn Novel Sprint</h4>
                      <p className="text-[9.5px] text-neutral-500 mt-1">Starts Oct 1. Get ready to sprint with 1,500 authors worldwide.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: TEMPLATES */}
              {/* ============================================================== */}
              {activeView === "templates" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-poppins text-neutral-900 dark:text-white">
                      Book Design Templates
                    </h1>
                    <p className="text-[11.5px] text-neutral-500 mt-0.5">
                      Explore editorial layouts, custom font pairings, and borders crafted for various genres.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { id: "fantasy", name: "Epic Fantasy", desc: "Ornate borders, Cinzel headings, rich historical vibe.", cover: "fantasy" },
                      { id: "romance", name: "Floral Romance", desc: "Soft pastel covers, elegant serif fonts, whimsical dividers.", cover: "romance" },
                      { id: "sci-fi", name: "Cosmic Sci-Fi", desc: "Minimal grids, Orbitron/Inter monospace futuristic type.", cover: "sci-fi" },
                      { id: "classic", name: "Leather Classic", desc: "Deep woodtones, gold filigree frames, Playfair body text.", cover: "classic" }
                    ].map(t => (
                      <div 
                        key={t.id} 
                        className={`p-4 rounded-2xl flex flex-col justify-between cursor-pointer ${glassStyle} ${cardHover}`}
                        onClick={() => {
                          setNewBookTitle(`${t.name} Project`);
                          setNewBookGenre(t.name.split(" ")[1]);
                          setNewBookTemplate(t.id);
                          setOpenNewBookModal(true);
                        }}
                      >
                        <div>
                          <div className="h-40 rounded-xl mb-3 flex items-center justify-center font-bold text-white text-[12px] font-cinzel shadow-sm bg-gradient-to-br from-[#1E293B] to-[#1E3A8A]">
                            {t.name}
                          </div>
                          <h3 className="text-[12.5px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins">{t.name}</h3>
                          <p className="text-[10px] text-neutral-500 mt-1.5 leading-relaxed">{t.desc}</p>
                        </div>
                        <button className="w-full mt-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-white font-bold rounded-xl text-[10.5px] transition-all cursor-pointer">
                          Use Template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: FAVORITES */}
              {/* ============================================================== */}
              {activeView === "favorites" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-poppins text-neutral-900 dark:text-white">
                      Your Pinned & Favorites
                    </h1>
                    <p className="text-[11.5px] text-neutral-500 mt-0.5">
                      Quick access to favorited novels and pinned outline notes.
                    </p>
                  </div>

                  {books.filter(b => b.favorite).length === 0 && workspaceNotes.filter(n => n.pinned).length === 0 ? (
                    <div className={`p-12 text-center rounded-2xl max-w-md mx-auto ${glassStyle}`}>
                      <Heart size={36} className="mx-auto text-neutral-300 mb-2" />
                      <p className="text-[12px] text-neutral-500">Nothing favorited or pinned yet. Pin books and notes for quick reference!</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Bookshelf of favorites */}
                      {books.filter(b => b.favorite).length > 0 && (
                        <div className={`p-5 rounded-2xl ${glassStyle}`}>
                          <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider mb-6">
                            Favorite Novels
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                            {books.filter(b => b.favorite).map(b => (
                              <BookshelfBook 
                                key={b.id} 
                                book={b} 
                                onClick={() => {
                                  setSelectedBookId(b.id);
                                  setActiveView("book-details");
                                }}
                                onDoubleClick={() => handleOpenStudio(b)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pinned notes */}
                      {workspaceNotes.filter(n => n.pinned).length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider">
                            Pinned Notebook Outlines
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {workspaceNotes.filter(n => n.pinned).map(n => (
                              <div key={n.id} className={`p-4 rounded-xl text-left relative ${glassStyle}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-[#D4AF37] font-bold">
                                    Pinned {n.type}
                                  </span>
                                  <button 
                                    onClick={() => handleTogglePinNote(n.id)}
                                    className="p-1 text-[#D4AF37] hover:text-neutral-400 cursor-pointer"
                                  >
                                    <Bookmark size={12} />
                                  </button>
                                </div>
                                <h4 className="text-[12px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins">{n.title}</h4>
                                <p className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-1 whitespace-pre-line leading-relaxed font-sans">{n.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: DISCOVER (Writing Tips & Inspiration Feed) */}
              {/* ============================================================== */}
              {activeView === "discover" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-poppins text-neutral-900 dark:text-white">
                      Discover Inspiration
                    </h1>
                    <p className="text-[11.5px] text-neutral-500 mt-0.5">
                      Explore industry articles, layout design tips, and releases from the Lumora editorial team.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "Mastering the Drop Cap", category: "Typography", read: "3 min read", desc: "How to use decorative initial letters to open chapters without disrupting grid alignment.", date: "Today" },
                      { title: "Choosing Margin Widths", category: "Layout Guide", read: "5 min read", desc: "Understanding the balance between inside gutter binding margins and clean outer whitespace.", date: "Yesterday" },
                      { title: "The Art of Plot Outlining", category: "Creative Writing", read: "8 min read", desc: "Fleshing out antagonist motivations and setting worldbuilding rules prior to drafting.", date: "3 days ago" }
                    ].map(post => (
                      <div key={post.title} className={`p-5 rounded-2xl flex flex-col justify-between text-left ${glassStyle} ${cardHover}`}>
                        <div>
                          <div className="flex items-center justify-between text-[8.5px] uppercase font-bold text-[#D4AF37] mb-2.5">
                            <span>{post.category}</span>
                            <span className="text-neutral-400">{post.read}</span>
                          </div>
                          <h3 className="text-[13px] font-bold text-neutral-800 dark:text-neutral-100 font-poppins">{post.title}</h3>
                          <p className="text-[10.5px] text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">{post.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-3 border-t border-black/[0.03] dark:border-white/[0.04]">
                          <span className="text-[9px] text-neutral-400">{post.date}</span>
                          <button className="text-[10px] font-bold text-[#D4AF37] hover:underline flex items-center gap-0.5">
                            Read article <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: SETTINGS & PROFILE (Basic UI) */}
              {/* ============================================================== */}
              {(activeView === "settings" || activeView === "profile") && (
                <div className={`p-6 rounded-2xl text-left max-w-lg mx-auto ${glassStyle}`}>
                  <h1 className="text-lg font-bold font-poppins text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                    {activeView === "profile" ? "Author Profile" : "Account Settings"}
                  </h1>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-base">
                        AV
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-neutral-800 dark:text-neutral-100">{user.name}</h3>
                        <p className="text-[10.5px] text-neutral-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                      <div className="flex flex-col">
                        <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 mb-1">Author Pen Name</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                          className="px-3 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                          className="px-3 py-1.5 text-[11px] rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: TRASH */}
              {/* ============================================================== */}
              {activeView === "trash" && (
                <div className={`p-8 rounded-2xl text-center max-w-md mx-auto ${glassStyle}`}>
                  <Trash2 size={40} className="mx-auto text-neutral-400 mb-3" />
                  <h1 className="text-base font-bold font-poppins text-neutral-900 dark:text-white">Trash Bin is Empty</h1>
                  <p className="text-[11.5px] text-neutral-500 mt-2 leading-relaxed">
                    Deleted books and discarded outlines will reside here. Items are automatically cleaned after 30 days.
                  </p>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW: BOOK DETAILS PAGE */}
              {/* ============================================================== */}
              {activeView === "book-details" && activeBook && (
                <div className="space-y-6">
                  {/* Back button */}
                  <button 
                    onClick={() => setActiveView("dashboard")}
                    className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    Back to Dashboard
                  </button>

                  <div className={`p-6 rounded-2xl ${glassStyle}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      {/* Left: Book Cover preview block */}
                      <div className="relative w-44 h-64 rounded-xl overflow-hidden shadow-xl flex bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E3A8A] border border-neutral-700/10 shrink-0">
                        <div className="w-[12px] h-full bg-[#0B0F19]" />
                        <div className="flex-1 h-full p-4 flex flex-col justify-between">
                          <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold text-center">{activeBook.genre || "Novel"}</span>
                          <span className="text-[12px] font-bold font-cinzel text-white leading-tight text-center mt-6">{activeBook.title}</span>
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-[0.5px] bg-[#D4AF37] opacity-60 mb-1" />
                            <span className="text-[8px] text-white/70 font-mono">{activeBook.wordCount?.toLocaleString() || "0"} words</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Book Details & Actions */}
                      <div className="flex-1 flex flex-col justify-between h-full space-y-6 text-left">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold font-cinzel text-neutral-900 dark:text-white">
                              {activeBook.title}
                            </h1>
                            <button 
                              onClick={() => handleToggleFavoriteBook(activeBook.id)}
                              className={`p-1.5 rounded-lg border border-black/5 dark:border-white/10 hover:bg-black/[0.02] transition-colors cursor-pointer ${
                                activeBook.favorite ? "text-red-500" : "text-neutral-400"
                              }`}
                            >
                              <Heart size={14} fill={activeBook.favorite ? "currentColor" : "none"} />
                            </button>
                          </div>
                          
                          <p className="text-[11px] text-neutral-500 mt-1">
                            Created on {activeBook.createdDate || "May 10, 2026"} • Last edited {activeBook.lastEdited}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] uppercase">
                              {activeBook.genre}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 uppercase">
                              {activeBook.status}
                            </span>
                            {activeBook.tags?.map(t => (
                              <span key={t} className="px-2.5 py-0.5 rounded-full text-[9px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-neutral-400">
                                {t}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="p-3.5 rounded-xl bg-black/[0.01] dark:bg-white/[0.015] border border-black/5 dark:border-white/5">
                              <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 block">Word Count</span>
                              <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-100 mt-1 block font-poppins">{activeBook.wordCount?.toLocaleString() || "0"}</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-black/[0.01] dark:bg-white/[0.015] border border-black/5 dark:border-white/5">
                              <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 block">Reading Time</span>
                              <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-100 mt-1 block font-poppins">{activeBook.readingTime || "1h 45m"}</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-black/[0.01] dark:bg-white/[0.015] border border-black/5 dark:border-white/5">
                              <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 block">Total Chapters</span>
                              <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-100 mt-1 block font-poppins">{activeBook.chapterCount || "50"}</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-black/[0.01] dark:bg-white/[0.015] border border-black/5 dark:border-white/5">
                              <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 block">Page Count</span>
                              <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-100 mt-1 block font-poppins">{activeBook.pages?.length || "50"}</span>
                            </div>
                          </div>

                          <div className="mt-6">
                            <span className="text-[10px] font-bold text-neutral-400 block mb-1.5 uppercase tracking-wider">Synopsis / Back Cover Outline</span>
                            <p className="text-[11.5px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                              {activeBook.id === "the-lost-kingdom" 
                                ? "In a realm lit by two suns, an ancient portal stone remains locked. When Aurelia, a scholar from the outer citadels, discovers a glowing runic inscription on the Obsidian Cliffs, she triggers a cosmic alignment that threatens to tear the fabric of the kingdom. She must venture through the Silver Gate to retrieve a lost heritage before the shadow lord claim the relic."
                                : "No synopsis written yet. Use the book settings panel in the Studio editor to write a summary of your manuscript."}
                            </p>
                          </div>
                        </div>

                        {/* Details Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-black/5 dark:border-white/5">
                          <button 
                            onClick={() => handleOpenStudio(activeBook)}
                            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C19B34] text-white font-bold rounded-xl text-[12px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Play size={13} />
                            Open in Book Studio
                          </button>
                          
                          <button 
                            onClick={() => handleDuplicateBook(activeBook)}
                            className="px-4 py-2.5 border border-black/5 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Copy size={13} />
                            Duplicate
                          </button>
                          
                          <button 
                            onClick={() => {
                              const nextStatus = activeBook.status === "Completed" ? "Draft" : "Completed";
                              setBooks(prev => prev.map(b => b.id === activeBook.id ? { ...b, status: nextStatus } : b));
                            }}
                            className="px-4 py-2.5 border border-black/5 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Archive size={13} />
                            {activeBook.status === "Completed" ? "Mark as Draft" : "Mark as Completed"}
                          </button>

                          <button 
                            onClick={() => handleDeleteBook(activeBook.id)}
                            className="px-4 py-2.5 border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer ml-auto"
                          >
                            <Trash2 size={13} />
                            Delete Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ============================================================== */}
      {/* 3. NEW BOOK FLOW MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {openNewBookModal && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl p-6 relative text-left shadow-2xl ${glassStyle}`}
            >
              <button 
                onClick={() => setOpenNewBookModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>

              <h2 className="text-lg font-bold font-poppins text-neutral-900 dark:text-white mb-4">
                Create a New Book
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Book Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Whispers of the Star Gate..."
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-[12px] rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37] text-neutral-800 dark:text-neutral-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Genre</label>
                    <select
                      value={newBookGenre}
                      onChange={(e) => {
                        setNewBookGenre(e.target.value);
                        setNewBookTemplate(e.target.value.toLowerCase());
                      }}
                      className="w-full px-3.5 py-2 text-[12px] rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none text-neutral-700 dark:text-neutral-300"
                    >
                      <option value="Fantasy">Fantasy</option>
                      <option value="Romance">Romance</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Classic">Classic</option>
                      <option value="Mystery">Mystery</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Cover Style</label>
                    <select
                      value={newBookTemplate}
                      onChange={(e) => setNewBookTemplate(e.target.value)}
                      className="w-full px-3.5 py-2 text-[12px] rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none text-neutral-700 dark:text-neutral-300"
                    >
                      <option value="fantasy">Gold Filigree (Fantasy)</option>
                      <option value="romance">Pink Floral (Romance)</option>
                      <option value="sci-fi">Cyber Neon (Sci-Fi)</option>
                      <option value="classic">Brown Leather (Classic)</option>
                    </select>
                  </div>
                </div>

                {/* Import manuscript file selector */}
                <div className="flex flex-col border-t border-black/5 dark:border-white/5 pt-4">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                    <FileUp size={13} />
                    Import Manuscript (Optional)
                  </label>
                  
                  {importFileName ? (
                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center justify-between">
                      <span className="text-[11px] text-green-600 dark:text-green-400 font-medium truncate">
                        ✓ {importFileName}
                      </span>
                      <button 
                        onClick={() => {
                          setImportFileName("");
                          setImportText("");
                        }}
                        className="text-[10px] text-neutral-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <textarea
                        placeholder="Paste manuscript paragraphs here, separated by double lines..."
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        rows={4}
                        className="w-full px-3.5 py-2 text-[11px] rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] focus:outline-none focus:border-[#D4AF37] text-neutral-800 dark:text-neutral-100"
                      />
                      <div className="flex items-center justify-between text-[9.5px] text-neutral-400">
                        <span>Or select a file (.txt, .md, .docx supported)</span>
                        <button 
                          onClick={() => {
                            setImportFileName("manuscript_draft_final.md");
                            setImportText("Chapter 1: The Runic Whispers\n\nThe stones hummed in the dark night. Aurelia reached out a finger, touching the glowing runic script engraved into the cold obsidian slab. As her skin met the stone, a shock of pure blue electricity surged up her arm, knocking her backward onto the violet sands.\n\nShe looked up at the twin suns beginning to align in the sky above. The gate was unlocking.");
                          }}
                          className="text-[#D4AF37] hover:underline"
                        >
                          Simulate File Upload
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-black/5 dark:border-white/5 mt-6">
                <button 
                  onClick={() => handleCreateBook(importText ? "import" : "blank")}
                  className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#C19B34] text-white font-bold rounded-xl text-[12px] transition-all cursor-pointer shadow-xs"
                >
                  {importText ? "Import & Start Writing" : "Create Empty Book"}
                </button>
                <button 
                  onClick={() => setOpenNewBookModal(false)}
                  className="px-4 py-2.5 border border-black/5 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] text-neutral-500 rounded-xl text-[12px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
