"use client";

import {
  Inbox,
} from "lucide-react";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

// =========================
// TYPES
// =========================

type EmptyStateSize =
  | "sm"
  | "md"
  | "lg";

type EmptyStateProps = {
  title?: string;

  description?: string;

  icon?: ReactNode;

  action?: ReactNode;

  size?: EmptyStateSize;

  className?: string;
};

// =========================
// SIZE STYLES
// =========================

const sizeStyles = {
  sm: {
    wrapper:
      "py-6 px-4 gap-2",

    iconWrapper:
      "w-10 h-10",

    icon: 18,

    title: "text-sm",

    description:
      "text-xs",
  },

  md: {
    wrapper:
      "py-8 px-5 gap-3",

    iconWrapper:
      "w-12 h-12",

    icon: 22,

    title: "text-base",

    description:
      "text-sm",
  },

  lg: {
    wrapper:
      "py-10 px-6 gap-4",

    iconWrapper:
      "w-14 h-14",

    icon: 26,

    title: "text-lg",

    description:
      "text-base",
  },
};

// =========================
// COMPONENT
// =========================

export default function EmptyState({
  title = "No data found",

  description,

  icon,

  action,

  size = "md",

  className,
}: EmptyStateProps) {
  const styles =
    sizeStyles[size];

  return (
    <div
      className={clsx(
        // BASE

        "flex",
        "flex-col",
        "items-center",
        "justify-center",

        "text-center",

        // SIZE

        styles.wrapper,

        // CUSTOM

        className
      )}
    >
      {/* ICON */}

      <div
        className={clsx(
          "rounded-full",

          "bg-slate-100",

          "flex",
          "items-center",
          "justify-center",

          "text-slate-400",

          styles.iconWrapper
        )}
      >
        {icon || (
          <Inbox
            size={
              styles.icon
            }
          />
        )}
      </div>

      {/* CONTENT */}

      <div
        className="
          space-y-1
        "
      >
        {/* TITLE */}

        <div
          className={clsx(
            "font-semibold",

            "text-slate-700",

            styles.title
          )}
        >
          {title}
        </div>

        {/* DESCRIPTION */}

        {description && (
          <div
            className={clsx(
              "text-slate-400",

              "leading-relaxed",

              styles.description
            )}
          >
            {description}
          </div>
        )}
      </div>

      {/* ACTION */}

      {action && (
        <div
          className="
            mt-2
          "
        >
          {action}
        </div>
      )}
    </div>
  );
}