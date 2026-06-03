"use client";

import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  Clock3,
} from "lucide-react";

import {
  getFollowupStatus,
} from "@/src/utils/getFollowupStatus";

// =========================
// TYPES
// =========================

interface FollowupBadgeProps {
  date?: string | Date | null;

  size?: "sm" | "md";

  className?: string;

  showIcon?: boolean;

  showLabel?: boolean;
}

// =========================
// GET ICON
// =========================

function getFollowupIcon(
  status: string,
  size: number
) {
  switch (status) {
    // =========================
    // OVERDUE
    // =========================

    case "OVERDUE":
      return (
        <AlertTriangle
          size={size}
        />
      );

    // =========================
    // TODAY
    // =========================

    case "TODAY":
      return (
        <Clock3
          size={size}
        />
      );

    // =========================
    // TOMORROW
    // =========================

    case "TOMORROW":
      return (
        <CalendarDays
          size={size}
        />
      );

    // =========================
    // UPCOMING
    // =========================

    default:
      return (
        <CalendarClock
          size={size}
        />
      );
  }
}

// =========================
// COMPONENT
// =========================

export default function FollowupBadge({
  date,
  size = "md",
  className = "",
  showIcon = true,
  showLabel = true,
}: FollowupBadgeProps) {
  // =========================
  // STATUS
  // =========================

  const followup =
    getFollowupStatus(
      date
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

  // =========================
  // ICON SIZE
  // =========================

  const iconSize =
    size === "sm"
      ? 12
      : 14;

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

        ${followup.badgeClassName}

        ${className}
      `}
    >
      {/* ICON */}
      {showIcon &&
        getFollowupIcon(
          followup.status,
          iconSize
        )}

      {/* LABEL */}
      {showLabel && (
        <span>
          {followup.label}
        </span>
      )}
    </div>
  );
}