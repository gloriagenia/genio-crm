"use client";

import {
  ChevronDown,
} from "lucide-react";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

// =========================
// TYPES
// =========================

type SectionHeaderProps = {
  title: string;

  subtitle?: string;

  icon?: ReactNode;

  badge?: ReactNode;

  collapsible?: boolean;

  open?: boolean;

  onToggle?: () => void;

  action?: ReactNode;

  className?: string;
};

// =========================
// COMPONENT
// =========================

export default function SectionHeader({
  title,

  subtitle,

  icon,

  badge,

  collapsible = false,

  open = true,

  onToggle,

  action,

  className,
}: SectionHeaderProps) {
  // =========================
  // CONTENT
  // =========================

  const content = (
    <>
      {/* LEFT */}

      <div
        className="
          min-w-0
          flex-1

          flex
          items-start

          gap-3
        "
      >
        {/* ICON */}

        {icon && (
          <div
            className="
              mt-0.5

              text-slate-400

              shrink-0
            "
          >
            {icon}
          </div>
        )}

        {/* TEXT */}

        <div
          className="
            min-w-0
          "
        >
          {/* TITLE ROW */}

          <div
            className="
              flex
              items-center
              flex-wrap

              gap-2
            "
          >
            {/* TITLE */}

            <div
              className="
                text-sm

                font-semibold

                text-slate-800

                break-words
              "
            >
              {title}
            </div>

            {/* BADGE */}

            {badge}
          </div>

          {/* SUBTITLE */}

          {subtitle && (
            <div
              className="
                mt-0.5

                text-xs

                text-slate-400

                break-words
              "
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}

      <div
        className="
          flex
          items-center

          gap-2

          shrink-0
        "
      >
        {/* ACTION */}

        {action}

        {/* COLLAPSE */}

        {collapsible && (
          <div
            className={clsx(
              "transition-transform",
              "duration-200",

              open &&
                "rotate-180"
            )}
          >
            <ChevronDown
              size={18}
              className="
                text-slate-400
              "
            />
          </div>
        )}
      </div>
    </>
  );

  // =========================
  // COLLAPSIBLE MODE
  // =========================

  if (collapsible) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          // BASE

          "w-full",

          "flex",
          "items-start",
          "justify-between",

          "gap-3",

          "px-4",
          "py-3",

          "bg-slate-50",

          "border-b",
          "border-slate-200",

          "text-left",

          "transition-colors",

          "hover:bg-slate-100",

          className
        )}
      >
        {content}
      </button>
    );
  }

  // =========================
  // NORMAL MODE
  // =========================

  return (
    <div
      className={clsx(
        // BASE

        "flex",
        "items-start",
        "justify-between",

        "gap-3",

        "px-4",
        "py-3",

        "bg-slate-50",

        "border-b",
        "border-slate-200",

        className
      )}
    >
      {content}
    </div>
  );
}