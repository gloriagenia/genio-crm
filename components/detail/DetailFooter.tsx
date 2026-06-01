"use client";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

import useIsMobile from "@/components/hooks/useIsMobile";

// =========================
// TYPES
// =========================

type DetailFooterProps = {
  children: ReactNode;

  stickyMobile?: boolean;

  bordered?: boolean;

  className?: string;

  align?:
    | "left"
    | "center"
    | "right"
    | "between";
};

// =========================
// ALIGNMENT
// =========================

const alignStyles = {
  left: "justify-start",

  center:
    "justify-center",

  right: "justify-end",

  between:
    "justify-between",
};

// =========================
// COMPONENT
// =========================

export default function DetailFooter({
  children,

  stickyMobile = true,

  bordered = true,

  className,

  align = "right",
}: DetailFooterProps) {
  // =========================
  // HOOKS
  // =========================

  const isMobile =
    useIsMobile();

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className={clsx(
        // BASE

        "bg-white",

        "shrink-0",

        // BORDER

        bordered &&
          clsx(
            "border-t",
            "border-slate-200"
          ),

        // PADDING

        "px-3",
        "pt-3",

        // SAFE AREA

        "pb-[calc(env(safe-area-inset-bottom)+12px)]",

        "xl:px-5",
        "xl:py-4",

        // MOBILE STICKY

        stickyMobile &&
          isMobile &&
          clsx(
            "sticky",
            "bottom-0",
            "left-0",
            "right-0",
            "z-30",

            "bg-white/95",
            "backdrop-blur",

            "shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
          ),

        // DESKTOP

        !isMobile &&
          "bg-white",

        // CUSTOM

        className
      )}
    >
      {/* ACTIONS */}

      <div
        className={clsx(
          // MOBILE LAYOUT

          isMobile
            ? clsx(
                "grid",
                "grid-cols-2",

                "gap-2"
              )
            : clsx(
                // DESKTOP LAYOUT

                "flex",
                "items-center",

                "flex-wrap",

                "gap-2",

                alignStyles[
                  align
                ]
              )
        )}
      >
        {children}
      </div>
    </div>
  );
}