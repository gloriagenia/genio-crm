"use client";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

// =========================
// TYPES
// =========================

type SectionContentPadding =
  | "none"
  | "sm"
  | "md"
  | "lg";

type SectionContentProps = {
  children: ReactNode;

  padding?: SectionContentPadding;

  scrollable?: boolean;

  className?: string;
};

// =========================
// PADDING STYLES
// =========================

const paddingStyles = {
  none: "",

  sm: "p-3",

  md: "p-4",

  lg: "p-5",
};

// =========================
// COMPONENT
// =========================

export default function SectionContent({
  children,

  padding = "md",

  scrollable = false,

  className,
}: SectionContentProps) {
  return (
    <div
      className={clsx(
        // BASE

        "bg-white",

        // PADDING

        paddingStyles[
          padding
        ],

        // SCROLL

        scrollable &&
          clsx(
            "overflow-y-auto",
            "max-h-[400px]",

            // OPTIONAL SCROLLBAR

            "scrollbar-thin",
            "scrollbar-thumb-slate-300",
            "scrollbar-track-transparent"
          ),

        // CUSTOM

        className
      )}
    >
      {children}
    </div>
  );
}