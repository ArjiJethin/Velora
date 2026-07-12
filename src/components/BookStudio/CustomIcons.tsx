"use client";

import React from "react";

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// 1. Pages: Open book icon with page turn detail
export const PagesIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    <path d="M12 7v14" />
    <path d="M6 8h2" />
    <path d="M16 8h2" />
    <path d="M16 12h2" />
  </svg>
);

// 2. Templates: Decorated page with ornate double borders
export const TemplatesIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="6" y="6" width="12" height="12" rx="1" strokeDasharray="2 1.5" />
    <path d="M9 10h6" />
    <path d="M9 14h6" />
  </svg>
);

// 3. Typography: Elegant serif letter "A"
export const TypographyIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 4L6 20h2" />
    <path d="M12 4l6 16h-2" />
    <path d="M8 15h8" />
    {/* Elegant Base Serifs */}
    <path d="M5 20h3" />
    <path d="M16 20h3" />
    <path d="M10.5 4h3" />
  </svg>
);

// 4. Assets: Picture frame with corner mount details
export const AssetsIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="12" cy="11" r="3" />
    {/* Corner Mounts */}
    <path d="M3 7l4-4" />
    <path d="M17 3l4 4" />
    <path d="M3 17l4 4" />
    <path d="M17 21l4-4" />
  </svg>
);

// 5. Bookmarks/Chapters: Elegantly hanging ribbon
export const BookmarksIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 2H5a2 2 0 0 0-2 2v18l9-6 9 6V4a2 2 0 0 0-2-2z" />
    {/* Hanging Ribbon Detail */}
    <path d="M9 6h6" />
    <path d="M9 10h6" />
  </svg>
);

// 6. History/Versions: Turning page with clock detail
export const HistoryIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
    {/* Turning Page Corner */}
    <path d="M19 12a7 7 0 0 1-7 7" strokeDasharray="2 2" />
  </svg>
);

// 7. Publish: Premium hardcover book spine with ridges
export const PublishIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
    <path d="M6 14h10" />
    {/* Spine Ridges detail */}
    <path d="M4 6h2" />
    <path d="M4 10h2" />
    <path d="M4 14h2" />
  </svg>
);

// 8. Library: Bookshelf with book silhouettes
export const LibraryIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 21h18" />
    {/* Book 1 */}
    <path d="M5 21V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v14" />
    {/* Book 2 (slanted) */}
    <path d="M13.5 21l-3.5-12a1 1 0 0 1 .7-1.2l2.9-1a1 1 0 0 1 1.2.7l3.7 13.5" />
    {/* Book 3 */}
    <path d="M19 21v-7h2v7" />
  </svg>
);

// 9. Elements: Lead-type layout tray
export const ElementsIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
);

// 10. Settings: Printing press spoke wheel
export const SettingsIcon: React.FC<CustomIconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6" />
    <path d="M12 15v6" />
    <path d="M3 12h6" />
    <path d="M15 12h9" />
    <path d="M5.6 5.6l4.3 4.3" />
    <path d="M14.1 14.1l4.3 4.3" />
    <path d="M18.4 5.6l-4.3 4.3" />
    <path d="M9.9 14.1l-4.3 4.3" />
  </svg>
);
