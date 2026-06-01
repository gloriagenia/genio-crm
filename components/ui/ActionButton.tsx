"use client";

import {
  Loader2,
} from "lucide-react";

import clsx from "clsx";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

// =========================
// TYPES
// =========================

type ActionButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "ghost";

type ActionButtonSize =
  | "sm"
  | "md"
  | "lg";

type ActionButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;

    icon?: ReactNode;

    variant?: ActionButtonVariant;

    size?: ActionButtonSize;

    fullWidth?: boolean;

    loading?: boolean;
  };

// =========================
// VARIANTS
// =========================

const variantStyles = {
  primary: clsx(
    "bg-slate-900",
    "text-white",

    "hover:bg-slate-800",

    "border",
    "border-slate-900"
  ),

  secondary: clsx(
    "bg-white",
    "text-slate-700",

    "hover:bg-slate-100",

    "border",
    "border-slate-200"
  ),

  success: clsx(
    "bg-green-600",
    "text-white",

    "hover:bg-green-700",

    "border",
    "border-green-600"
  ),

  danger: clsx(
    "bg-red-600",
    "text-white",

    "hover:bg-red-700",

    "border",
    "border-red-600"
  ),

  ghost: clsx(
    "bg-transparent",
    "text-slate-700",

    "hover:bg-slate-100",

    "border",
    "border-transparent"
  ),
};

// =========================
// SIZES
// =========================

const sizeStyles = {
  sm: clsx(
    "h-9",
    "px-3",

    "text-sm",

    "rounded-xl",

    "gap-1.5"
  ),

  md: clsx(
    "h-11",
    "px-4",

    "text-sm",

    "rounded-xl",

    "gap-2"
  ),

  lg: clsx(
    "h-12",
    "px-5",

    "text-base",

    "rounded-2xl",

    "gap-2.5"
  ),
};

// =========================
// COMPONENT
// =========================

export default function ActionButton({
  children,

  icon,

  variant = "primary",

  size = "md",

  fullWidth = false,

  loading = false,

  disabled,

  className,

  ...props
}: ActionButtonProps) {
  const isDisabled =
    disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        // BASE

        "inline-flex",
        "items-center",
        "justify-center",

        "font-medium",

        "transition-all",
        "duration-200",

        "select-none",

        "shrink-0",

        // ACTIVE

        "active:scale-[0.98]",

        // DISABLED

        isDisabled &&
          clsx(
            "opacity-60",
            "cursor-not-allowed"
          ),

        // FULL WIDTH

        fullWidth &&
          "w-full",

        // VARIANT

        variantStyles[
          variant
        ],

        // SIZE

        sizeStyles[size],

        // CUSTOM

        className
      )}
      {...props}
    >
      {/* LOADING */}

      {loading ? (
        <Loader2
          size={16}
          className="
            animate-spin
            shrink-0
          "
        />
      ) : (
        icon && (
          <span
            className="
              shrink-0

              flex
              items-center
              justify-center
            "
          >
            {icon}
          </span>
        )
      )}

      {/* LABEL */}

      <span
        className="
          truncate
        "
      >
        {children}
      </span>
    </button>
  );
}