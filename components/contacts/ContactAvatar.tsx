"use client";

import {
  Building2,
  User2,
} from "lucide-react";

// =========================
// TYPES
// =========================

interface ContactAvatarProps {
  name?: string | null;

  contactType?: string | null;

  size?: "sm" | "md" | "lg";

  showRing?: boolean;

  className?: string;
}

// =========================
// GET INITIALS
// =========================

function getInitials(
  name?: string | null
) {
  if (!name) {
    return "?";
  }

  const words = name
    .trim()
    .split(" ")
    .filter(Boolean);

  // =========================
  // SINGLE WORD
  // =========================

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  // =========================
  // MULTIPLE WORDS
  // =========================

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}

// =========================
// GET SIZE
// =========================

function getSizeClass(
  size: string
) {
  switch (size) {
    case "sm":
      return {
        wrapper: `
          h-10
          w-10
        `,

        text: `
          text-sm
        `,

        icon: 16,
      };

    case "lg":
      return {
        wrapper: `
          h-16
          w-16
        `,

        text: `
          text-xl
        `,

        icon: 24,
      };

    default:
      return {
        wrapper: `
          h-12
          w-12
        `,

        text: `
          text-base
        `,

        icon: 20,
      };
  }
}

// =========================
// GET STYLE
// =========================

function getAvatarStyle(
  contactType?: string | null
) {
  switch (contactType) {
    case "Vendor":
      return `
        bg-blue-50
        text-blue-700
        border-blue-100
      `;

    case "Buyer":
      return `
        bg-green-50
        text-green-700
        border-green-100
      `;

    case "Renter":
      return `
        bg-orange-50
        text-orange-700
        border-orange-100
      `;

    case "Agent":
      return `
        bg-purple-50
        text-purple-700
        border-purple-100
      `;

    default:
      return `
        bg-slate-100
        text-slate-700
        border-slate-200
      `;
  }
}

// =========================
// COMPONENT
// =========================

export default function ContactAvatar({
  name,
  contactType,
  size = "md",
  showRing = false,
  className = "",
}: ContactAvatarProps) {
  // =========================
  // INITIALS
  // =========================

  const initials =
    getInitials(name);

  // =========================
  // SIZE
  // =========================

  const sizeClass =
    getSizeClass(size);

  // =========================
  // STYLE
  // =========================

  const styleClass =
    getAvatarStyle(
      contactType
    );

  // =========================
  // ICON CONDITION
  // =========================

  const showBusinessIcon =
    contactType ===
      "Vendor" ||
    contactType === "Agent";

  return (
    <div
      className={`
        relative

        flex
        items-center
        justify-center

        rounded-2xl

        border

        font-bold

        shrink-0

        overflow-hidden

        transition-all
        duration-200

        ${sizeClass.wrapper}

        ${sizeClass.text}

        ${styleClass}

        ${
          showRing
            ? `
              ring-4
              ring-white
            `
            : ""
        }

        ${className}
      `}
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          inset-0

          opacity-40

          bg-gradient-to-br
          from-white/30
          to-transparent
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
        "
      >
        {name ? (
          initials
        ) : showBusinessIcon ? (
          <Building2
            size={
              sizeClass.icon
            }
          />
        ) : (
          <User2
            size={
              sizeClass.icon
            }
          />
        )}
      </div>
    </div>
  );
}