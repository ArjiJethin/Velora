import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Cinzel,
  Orbitron,
  Creepster,
  Alex_Brush,
  Special_Elite,
  Cormorant_Garamond,
  Fredoka,
  Poppins,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-creepster",
});

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alex",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Lumora Book Studio — Transform Stories into Masterpieces",
  description: "A premium creative platform that transforms stories into beautifully designed digital books.",
};

import { StudioProvider } from "@/context/StudioContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = [
    inter.variable,
    playfair.variable,
    cinzel.variable,
    orbitron.variable,
    creepster.variable,
    alexBrush.variable,
    specialElite.variable,
    cormorant.variable,
    fredoka.variable,
    poppins.variable,
  ].join(" ");

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#FAF6EE] dark:bg-[#0B0F15] text-[#2D2824] dark:text-[#F3F4F6] selection:bg-[#D4AF37]/30 selection:text-white" suppressHydrationWarning>
        <StudioProvider>
          {children}
        </StudioProvider>
      </body>
    </html>
  );
}
