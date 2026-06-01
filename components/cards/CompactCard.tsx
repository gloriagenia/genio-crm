"use client";

import {
  ChevronRight,
} from "lucide-react";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

import Badge from "@/components/ui/Badge";

// =========================
// TYPES
// =========================

type CompactCardVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

type CompactCardProps = {
  title: string;

  subtitle?: string;

  description?: string;

  badge?: string;

  badgeVariant?: CompactCardVariant;

  icon?: ReactNode;

  rightContent?: ReactNode;

  clickable?: boolean;

  onClick?: () => void;

  compact?: boolean;

  className?: string;
};

// =========================
// COMPONENT
// =========================

export default function CompactCard({
  title,

  subtitle,

  description,

  badge,

  badgeVariant =
    "default",

  icon,

  rightContent,

  clickable = false,

  onClick,

  compact = false,

  className,
}: CompactCardProps) {
  // =========================
  // WRAPPER
  // =========================

  const Wrapper = clickable
    ? "button"
    : "div";

  // =========================
  // RENDER
  // =========================

  return (
    <Wrapper
      onClick={onClick}
      className={clsx(
        // BASE

        "w-full",

        "rounded-2xl",

        "border",
        "border-slate-200",

        "bg-white",

        "text-left",

        // SPACING

        compact
          ? "p-3"
          : "p-4",

        // INTERACTION

        clickable &&
          clsx(
            "hover:bg-slate-50",
            "transition-all",
            "cursor-pointer"
          ),

        // CUSTOM

        className
      )}
    >
      {/* CONTAINER */}

      <div
        className="
          flex
          items-start
          justify-between

          gap-3
        "
      >
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

                shrink-0

                text-slate-400
              "
            >
              {icon}
            </div>
          )}

          {/* CONTENT */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            {/* TOP */}

            <div
              className="
                flex
                items-start
                flex-wrap

                gap-2
              "
            >
              {/* TITLE */}

              <div
                className="
                  text-sm
                  xl:text-[15px]

                  font-semibold

                  text-slate-900

                  break-words
                "
              >
                {title}
              </div>

              {/* BADGE */}

              {badge && (
                <Badge
                  text={badge}
                  size="sm"
                  variant={
                    badgeVariant
                  }
                />
              )}
            </div>

            {/* SUBTITLE */}

            {subtitle && (
              <div
                className="
                  mt-1

                  text-sm

                  text-slate-500

                  break-words
                "
              >
                {subtitle}
              </div>
            )}

            {/* DESCRIPTION */}

            {description && (
              <div
                className="
                  mt-2

                  text-sm

                  text-slate-600

                  leading-6

                  line-clamp-2

                  break-words
                "
              >
                {description}
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
          {/* CUSTOM */}

          {rightContent}

          {/* CLICKABLE */}

          {clickable && (
            <ChevronRight
              size={16}
              className="
                text-slate-300
              "
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
}