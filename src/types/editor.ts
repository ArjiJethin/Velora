export type ElementType = "text" | "image" | "shape" | "decoration";

export interface ElementStyle {
  // Advanced Typography Properties
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string; // "normal" | "bold" | "100" | "300" | "500" | "700" | "800" | "900"
  fontStyle?: string; // "normal" | "italic"
  textDecoration?: string; // "none" | "underline" | "line-through"
  color?: string; // text hexadecimal color
  highlightColor?: string; // highlight overlay color
  backgroundFill?: string; // text background fill
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
  letterSpacing?: number;
  wordSpacing?: number;
  paragraphSpacing?: number;
  smallCaps?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  dropCapEnabled?: boolean;
  textShadow?: string;
  outlineColor?: string;
  outlineWidth?: number; // in pixels

  // Shape / Border / Frame Properties
  shapeType?: "rectangle" | "circle" | "triangle" | "star";
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;
  boxShadow?: string;

  // Image Specifics
  imageCrop?: string; // crop bounding coordinates/scale

  // Shared Figma-style Paragraph Style IDs
  associatedStyleId?: string;
}

export interface PageElement {
  id: string;
  type: ElementType;
  x: number; // Pixels relative to standard page width (e.g. 390)
  y: number; // Pixels relative to standard page height (e.g. 480)
  width: number;
  height: number;
  rotation: number; // Degrees (0-360)
  opacity: number; // 0-100
  layer: number; // z-index ordering
  locked: boolean;
  hidden: boolean;
  style: ElementStyle;
  content: string; // Text string or Image URL source
}

export interface BookPage {
  id: number; // Page index (1, 2, 3...)
  title?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  elements: PageElement[];
  backgroundColor?: string;
}

export interface BookDocument {
  id: string;
  title: string;
  pages: BookPage[];
  genre?: string;
  wordCount?: number;
  targetWordCount?: number;
  chapterCount?: number;
  lastEdited?: string;
  createdDate?: string;
  status?: "In Progress" | "Draft" | "Completed" | "Archived";
  coverImage?: string;
  progress?: number;
  readingTime?: string;
  tags?: string[];
  favorite?: boolean;
  completedChapters?: number;
}

export interface TypographyStyle {
  id: string;
  name: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
  letterSpacing?: number;
  wordSpacing?: number;
  paragraphSpacing?: number;
  textShadow?: string;
  smallCaps?: boolean;
}
