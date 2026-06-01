"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  /**
   * DESKTOP
   * false = full sidebar
   * true = collapse icon only
   */
  const [collapsed, setCollapsed] =
    useState(false);

  /**
   * MOBILE
   * false = icon only
   * true = expanded
   */
  const [mobileExpanded, setMobileExpanded] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileExpanded={mobileExpanded}
        setMobileExpanded={setMobileExpanded}
      />

      {/* MAIN WRAPPER */}
      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ease-in-out

          /* MOBILE */
          ${
            mobileExpanded
              ? "ml-[240px]"
              : "ml-[72px]"
          }

          /* DESKTOP */
          ${
            collapsed
              ? "lg:ml-[90px]"
              : "lg:ml-[260px]"
          }
        `}
      >
        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main
          className="
            p-4
            lg:p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}