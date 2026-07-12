"use client";

import React from "react";
import { StudioProvider, useStudio } from "@/context/StudioContext";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { Workspace } from "./Workspace";
import { PropertiesPanel } from "./PropertiesPanel";

import DashboardLayout from "../Dashboard/DashboardLayout";

const StudioLayoutContent: React.FC = () => {
  const { readingMode, theme, activeView } = useStudio();

  if (activeView !== "studio") {
    return <DashboardLayout />;
  }

  if (readingMode) {
    return (
      <div className={`h-screen w-screen flex overflow-hidden theme-transition ${theme.isDark ? "dark-workspace bg-[#070A0F] text-[#F3F4F6]" : "bg-[#FAF6EE] text-[#2D2824]"}`}>
        <Workspace />
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden theme-transition ${theme.isDark ? "dark-workspace bg-[#0B0F15] text-[#F3F4F6]" : "bg-[#FAF6EE] text-[#2D2824]"}`}>
      {/* 1. Top Toolbar */}
      <Toolbar />

      {/* 2. Main Studio Work Area */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* Left Navigation (Collapsible) */}
        <Sidebar />

        {/* Center Area: Book Workspace */}
        <div className={`flex-1 flex flex-col overflow-hidden theme-transition ${theme.isDark ? "bg-[#0B0F15]" : "bg-[#FAF6EE]"}`}>
          {/* Book Canvas */}
          <Workspace />
        </div>

        {/* Right Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
};

export const StudioLayout: React.FC = () => {
  return <StudioLayoutContent />;
};

export default StudioLayout;
