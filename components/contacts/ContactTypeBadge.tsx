"use client";

// =========================
// TYPES
// =========================

interface ContactTypeBadgeProps {
  type?: string | null;

  size?: "sm" | "md";

  className?: string;

  showDot?: boolean;
}

// =========================
// GET STYLE
// =========================

function getContactTypeStyle(
  type?: string | null
) {
  switch (type) {
    // =========================
    // VENDOR
    // =========================

    case "Vendor":
      return {
        label: "Vendor",

        dot: "bg-blue-500",

        className: `
          border-blue-100
          bg-blue-50
          text-blue-700
        `,
      };

    // =========================
    // BUYER
    // =========================

    case "Buyer":
      return {
        label: "Buyer",

        dot: "bg-green-500",

        className: `
          border-green-100
          bg-green-50
          text-green-700
        `,
      };

    // =========================
    // RENTER
    // =========================

    case "Renter":
      return {
        label: "Renter",

        dot: "bg-orange-500",

        className: `
          border-orange-100
          bg-orange-50
          text-orange-700
        `,
      };

    // =========================
    // AGENT
    // =========================

    case "Agent":
      return {
        label: "Agent",

        dot: "bg-purple-500",

        className: `
          border-purple-100
          bg-purple-50
          text-purple-700
        `,
      };

    // =========================
    // OWNER
    // =========================

    case "Owner":
      return {
        label: "Owner",

        dot: "bg-cyan-500",

        className: `
          border-cyan-100
          bg-cyan-50
          text-cyan-700
        `,
      };

    // =========================
    // DEFAULT
    // =========================

    default:
      return {
        label:
          type || "Unknown",

        dot: "bg-slate-400",

        className: `
          border-slate-200
          bg-slate-100
          text-slate-600
        `,
      };
  }
}

// =========================
// COMPONENT
// =========================

export default function ContactTypeBadge({
  type,
  size = "md",
  className = "",
  showDot = true,
}: ContactTypeBadgeProps) {
  // =========================
  // STYLE
  // =========================

  const style =
    getContactTypeStyle(
      type
    );

  // =========================
  // SIZE
  // =========================

  const sizeClass =
    size === "sm"
      ? `
        px-2.5
        py-1

        text-[11px]
      `
      : `
        px-3
        py-1.5

        text-xs
      `;

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-1.5

        rounded-full

        border

        font-semibold

        whitespace-nowrap

        transition-all
        duration-200

        ${sizeClass}

        ${style.className}

        ${className}
      `}
    >
      {/* DOT */}
      {showDot && (
        <div
          className={`
            h-2
            w-2

            rounded-full

            shrink-0

            ${style.dot}
          `}
        />
      )}

      {/* LABEL */}
      <span>
        {style.label}
      </span>
    </div>
  );
}