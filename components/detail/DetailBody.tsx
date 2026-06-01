"use client";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

// =========================
// TYPES
// =========================

type DetailBodyProps = {
  children: ReactNode;

  sidebar?: ReactNode;

  className?: string;

  contentClassName?: string;

  sidebarClassName?: string;

  scrollable?: boolean;
};

// =========================
// COMPONENT
// =========================

export default function DetailBody({
  children,

  sidebar,

  className,

  contentClassName,

  sidebarClassName,

  scrollable = true,
}: DetailBodyProps) {
  return (
    <div
      className={clsx(
        // BASE

"flex-1",
"min-h-0",

// SCROLL

scrollable &&
  clsx(
    "overflow-y-auto",
    "overflow-x-hidden",

    // OPTIONAL SCROLLBAR

    "scrollbar-thin",
    "scrollbar-thumb-slate-300",
    "scrollbar-track-transparent"
  ),

        // SCROLL

        scrollable &&
          clsx(
            "overflow-y-auto",

            // OPTIONAL SCROLLBAR

            "scrollbar-thin",
            "scrollbar-thumb-slate-300",
            "scrollbar-track-transparent"
          ),

        // PADDING

        "p-3",
        "pb-28",
        "xl:p-5",
        "xl:pb-5",


        // CUSTOM

        className
      )}
    >
      {/* GRID */}

      <div
        className={clsx(
          // GRID

          "grid",

          "grid-cols-1",

          "xl:grid-cols-[1.5fr_0.9fr]",

          // GAP

          "gap-3",
          "xl:gap-5"
        )}
      >
        {/* MAIN CONTENT */}

        <div
          className={clsx(
            // LAYOUT

            "min-w-0",

            "space-y-3",
            "xl:space-y-5",

            // CUSTOM

            contentClassName
          )}
        >
          {children}
        </div>

        {/* SIDEBAR */}

        {sidebar && (
          <aside
            className={clsx(
              // LAYOUT

              "min-w-0",

              "space-y-3",
              "xl:space-y-5",

              // STICKY DESKTOP

              "xl:sticky",
              "xl:top-0",

              "h-fit",

              // CUSTOM

              sidebarClassName
            )}
          >
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}