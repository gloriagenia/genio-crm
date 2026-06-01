"use client";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

// =========================
// TYPES
// =========================

type SnapshotCardVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

type SnapshotCardProps = {
  label: string;

  value: string | number;

  icon?: ReactNode;

  subtitle?: string;

  variant?: SnapshotCardVariant;

  align?:
    | "left"
    | "center";

  compact?: boolean;

  className?: string;
};

// =========================
// VARIANTS
// =========================

const variantStyles = {
  default: clsx(
    "bg-white",
    "border-slate-200"
  ),

  success: clsx(
    "bg-emerald-50",
    "border-emerald-100"
  ),

  warning: clsx(
    "bg-amber-50",
    "border-amber-100"
  ),

  danger: clsx(
    "bg-red-50",
    "border-red-100"
  ),

  info: clsx(
    "bg-blue-50",
    "border-blue-100"
  ),
};

// =========================
// COMPONENT
// =========================

export default function SnapshotCard({
  label,

  value,

  icon,

  subtitle,

  variant = "default",

  align = "left",

  compact = false,

  className,
}: SnapshotCardProps) {
  return (
    <div
      className={clsx(
        // BASE

        "rounded-2xl",

        "border",

        "transition-all",

        // VARIANT

        variantStyles[
          variant
        ],

        // SPACING

        compact
          ? "p-3"
          : "p-4",

        // ALIGN

        align ===
          "center" &&
          "text-center",

        // CUSTOM

        className
      )}
    >
      {/* TOP */}

      {(icon ||
        label) && (
        <div
          className={clsx(
            // LAYOUT

            "flex",
            "items-center",

            "gap-2",

            align ===
              "center" &&
              "justify-center"
          )}
        >
          {/* ICON */}

          {icon && (
            <div
              className="
                text-slate-400

                shrink-0
              "
            >
              {icon}
            </div>
          )}

          {/* LABEL */}

          <div
            className="
              text-sm

              font-medium

              text-slate-500

              break-words
            "
          >
            {label}
          </div>
        </div>
      )}

      {/* VALUE */}

      <div
        className={clsx(
          // TYPOGRAPHY

          compact
            ? "text-2xl"
            : "text-3xl",

          "font-bold",

          "text-slate-900",

          // SPACING

          icon || label
            ? "mt-3"
            : "",

          // WRAP

          "break-words"
        )}
      >
        {value}
      </div>

      {/* SUBTITLE */}

      {subtitle && (
        <div
          className="
            mt-1

            text-xs

            text-slate-400

            break-words
          "
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}