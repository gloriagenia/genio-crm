"use client";

import {
  CalendarClock,
  ChevronRight,
  CircleDot,
} from "lucide-react";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

import Badge from "@/components/ui/Badge";

// =========================
// TYPES
// =========================

type ActivityItemVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

type ActivityItemProps = {
  title: string;

  description?: string;

  date?: string;

  badge?: string;

  variant?: ActivityItemVariant;

  icon?: ReactNode;

  action?: ReactNode;

  clickable?: boolean;

  onClick?: () => void;

  compact?: boolean;

  className?: string;
};

// =========================
// VARIANT STYLES
// =========================

const variantStyles = {
  default:
    "text-slate-400",

  success:
    "text-emerald-500",

  warning:
    "text-amber-500",

  danger:
    "text-red-500",

  info: "text-blue-500",
};

// =========================
// COMPONENT
// =========================

export default function ActivityItem({
  title,

  description,

  date,

  badge,

  variant = "default",

  icon,

  action,

  clickable = false,

  onClick,

  compact = false,

  className,
}: ActivityItemProps) {
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

        "flex",
        "items-start",

        "gap-3",

        // SPACING

        compact
          ? "p-3"
          : "p-4",

        // STYLE

        "rounded-2xl",

        "border",
        "border-slate-200",

        "bg-white",

        // INTERACTION

        clickable &&
          clsx(
            "hover:bg-slate-50",
            "transition-colors",
            "cursor-pointer",
            "text-left"
          ),

        // CUSTOM

        className
      )}
    >
      {/* ICON */}

      <div
        className={clsx(
          // BASE

          "shrink-0",

          "mt-1",

          // COLOR

          variantStyles[
            variant
          ]
        )}
      >
        {icon || (
          <CircleDot
            size={16}
          />
        )}
      </div>

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
            justify-between

            gap-3
          "
        >
          {/* LEFT */}

          <div
            className="
              min-w-0
              flex-1
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

            {/* DESCRIPTION */}

            {description && (
              <div
                className="
                  mt-1

                  text-sm

                  text-slate-600

                  leading-6

                  break-words

                  line-clamp-2
                "
              >
                {description}
              </div>
            )}
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
            {/* BADGE */}

            {badge && (
              <Badge
                text={badge}
                size="sm"
                variant="info"
              />
            )}

            {/* ACTION */}

            {action}

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

        {/* DATE */}

        {date && (
          <div
            className="
              mt-2

              flex
              items-center

              gap-1.5

              text-xs

              text-slate-400
            "
          >
            <CalendarClock
              size={13}
            />

            <span>
              {date}
            </span>
          </div>
        )}
      </div>
    </Wrapper>
  );
}