"use client";

import Image from "next/image";

import clsx from "clsx";

import type {
  ReactNode,
} from "react";

// =========================
// TYPES
// =========================

type AvatarSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

type AvatarProps = {
  src?: string | null;

  alt?: string;

  name?: string;

  icon?: ReactNode;

  size?: AvatarSize;

  rounded?: boolean;

  className?: string;
};

// =========================
// SIZE STYLES
// =========================

const sizeStyles = {
  xs: {
    wrapper: "w-7 h-7",
    text: "text-[10px]",
    icon: 12,
  },

  sm: {
    wrapper: "w-9 h-9",
    text: "text-xs",
    icon: 14,
  },

  md: {
    wrapper: "w-11 h-11",
    text: "text-sm",
    icon: 16,
  },

  lg: {
    wrapper: "w-14 h-14",
    text: "text-lg",
    icon: 20,
  },

  xl: {
    wrapper: "w-20 h-20",
    text: "text-2xl",
    icon: 28,
  },
};

// =========================
// GET INITIALS
// =========================

function getInitials(
  name?: string
) {
  if (!name)
    return "?";

  const words =
    name.split(" ");

  if (
    words.length === 1
  ) {
    return words[0][0];
  }

  return (
    words[0][0] +
    words[
      words.length - 1
    ][0]
  ).toUpperCase();
}

// =========================
// COMPONENT
// =========================

export default function Avatar({
  src,

  alt,

  name,

  icon,

  size = "md",

  rounded = true,

  className,
}: AvatarProps) {
  const sizeStyle =
    sizeStyles[size];

  const initials =
    getInitials(name);

  return (
    <div
      className={clsx(
        // BASE

        "relative",

        "overflow-hidden",

        "bg-slate-200",

        "text-slate-700",

        "flex",
        "items-center",
        "justify-center",

        "font-semibold",

        "shrink-0",

        // SIZE

        sizeStyle.wrapper,

        // SHAPE

        rounded
          ? "rounded-full"
          : "rounded-2xl",

        // CUSTOM

        className
      )}
    >
      {/* IMAGE */}

      {src ? (
        <Image
          src={src}
          alt={
            alt ||
            name ||
            "Avatar"
          }
          fill
          className="
            object-cover
          "
        />
      ) : icon ? (
        // ICON

        <div
          className="
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>
      ) : (
        // INITIALS

        <span
          className={clsx(
            sizeStyle.text
          )}
        >
          {initials}
        </span>
      )}
    </div>
  );
}