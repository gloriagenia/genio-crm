"use client";

import clsx from "clsx";

// =========================
// TYPES
// =========================

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

type BadgeSize =
  | "sm"
  | "md";

type BadgeProps = {
  text: string;

  variant?: BadgeVariant;

  size?: BadgeSize;

  className?: string;
};

// =========================
// VARIANTS
// =========================

const variantStyles = {
  default:
    "bg-slate-100 text-slate-700",

  success:
    "bg-emerald-100 text-emerald-700",

  warning:
    "bg-amber-100 text-amber-700",

  danger:
    "bg-red-100 text-red-700",

  info: "bg-blue-100 text-blue-700",

  purple:
    "bg-purple-100 text-purple-700",
};

// =========================
// SIZES
// =========================

const sizeStyles = {
  sm: "px-2 py-0.5 text-[11px]",

  md: "px-2.5 py-1 text-xs",
};

// =========================
// COMPONENT
// =========================

export default function Badge({
  text,

  variant = "default",

  size = "md",

  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        // BASE

        "inline-flex",
        "items-center",
        "justify-center",

        "rounded-full",

        "font-semibold",

        "whitespace-nowrap",

        "transition-all",

        // VARIANT

        variantStyles[
          variant
        ],

        // SIZE

        sizeStyles[size],

        // CUSTOM

        className
      )}
    >
      {text}
    </span>
  );
}