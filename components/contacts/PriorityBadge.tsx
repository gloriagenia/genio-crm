"use client";

// =========================
// TYPES
// =========================

interface PriorityBadgeProps {
  priority?: string | null;

  size?: "sm" | "md";

  className?: string;

  showIcon?: boolean;
}

// =========================
// GET STYLE
// =========================

function getPriorityStyle(
  priority?: string | null
) {
  switch (priority) {
    // =========================
    // HOT
    // =========================

    case "HOT":
      return {
        label: "HOT",

        icon: "🔥",

        className: `
          border-red-100
          bg-red-50
          text-red-700
        `,
      };

    // =========================
    // WARM
    // =========================

    case "WARM":
      return {
        label: "WARM",

        icon: "🟠",

        className: `
          border-orange-100
          bg-orange-50
          text-orange-700
        `,
      };

    // =========================
    // COLD
    // =========================

    case "COLD":
      return {
        label: "COLD",

        icon: "⚪",

        className: `
          border-slate-200
          bg-slate-100
          text-slate-600
        `,
      };

    // =========================
    // DEFAULT
    // =========================

    default:
      return {
        label:
          priority || "UNKNOWN",

        icon: "⚪",

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

export default function PriorityBadge({
  priority,
  size = "md",
  className = "",
  showIcon = true,
}: PriorityBadgeProps) {
  // =========================
  // STYLE
  // =========================

  const style =
    getPriorityStyle(
      priority
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

        gap-1.5
      `
      : `
        px-3
        py-1.5

        text-xs

        gap-2
      `;

  return (
    <div
      className={`
        inline-flex
        items-center

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
      {/* ICON */}
      {showIcon && (
        <span>
          {style.icon}
        </span>
      )}

      {/* LABEL */}
      <span>
        {style.label}
      </span>
    </div>
  );
}