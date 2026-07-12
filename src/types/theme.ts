export type WorkspaceThemeId =
  | "warm-ivory"
  | "soft-linen"
  | "pearl-white"
  | "alabaster"
  | "midnight-gold"
  | "ocean-blue"
  | "emerald"
  | "crimson"
  | "violet"
  | "graphite"
  | "slate";

export interface WorkspaceTheme {
  id: WorkspaceThemeId;
  name: string;
  accentColor: string; // hex
  accentGlow: string; // rgba glow
  accentGlowStrong: string; // rgba glow strong
  glassBorder: string; // glass style border color
  hoverBg: string; // button hover class
  selectionColor: string; // visual element selection border
  highlightColor: string; // active editor highlights
  isDark?: boolean;
}

export type BookTemplateId =
  | "fantasy"
  | "scifi"
  | "horror"
  | "romance"
  | "adventure"
  | "children"
  | "classic"
  | "minimal"
  | "fairytale"
  | "poetry";

export interface BookTemplate {
  id: BookTemplateId;
  name: string;
  category: "Fantasy" | "Romance" | "Adventure" | "Sci-Fi" | "Horror" | "Classic" | "Children" | "Minimal" | "Modern" | "Poetry";
  description: string;
  fonts: {
    title: string;
    body: string;
    subtitle: string;
  };
  colors: {
    paperTint: string;
    textDark: string; // Dark charcoal for readability
    textMuted: string;
    accent: string;
  };
  borders: {
    borderStyle: string; // border decoration classes
    decorativeCorners: boolean;
  };
  decorations: {
    ornaments: boolean;
    dividerStyle: string;
  };
  paperTexture?: string; // CSS bg gradient/filters
  margins: "normal" | "wide" | "narrow";
  chapterStyle: {
    numberFont: string;
    titleFont: string;
    alignment: "left" | "center" | "right" | "justify";
  };
  dropCap: {
    enabled: boolean;
    style: string;
  };
  typography: {
    lineHeight: number;
    letterSpacing: number;
  };
}

// Legacy aliases for backward compatibility
export type ThemeId = BookTemplateId;
export type ThemeConfig = BookTemplate;
