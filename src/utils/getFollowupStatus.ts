// =========================
// src/utils/getFollowupStatus.ts
// =========================

export type FollowupStatusType =
  | "NONE"
  | "OVERDUE"
  | "TODAY"
  | "TOMORROW"
  | "UPCOMING";

export interface FollowupStatusResult {
  status: FollowupStatusType;

  label: string;

  shortLabel: string;

  icon: string;

  textColor: string;

  bgColor: string;

  borderColor: string;

  badgeClassName: string;

  daysDiff: number | null;

  isUrgent: boolean;

  sortPriority: number;
}

// =========================
// MAIN FUNCTION
// =========================

export function getFollowupStatus(
  inputDate?: string | Date | null
): FollowupStatusResult {
  // =========================
  // EMPTY
  // =========================

  if (!inputDate) {
    return {
      status: "NONE",

      label: "No Follow Up",

      shortLabel: "-",

      icon: "📭",

      textColor:
        "text-slate-500",

      bgColor:
        "bg-slate-100",

      borderColor:
        "border-slate-200",

      badgeClassName: `
        bg-slate-100
        text-slate-500
        border-slate-200
      `,

      daysDiff: null,

      isUrgent: false,

      sortPriority: 5,
    };
  }

  // =========================
  // PARSE DATE
  // =========================

  const followupDate =
    inputDate instanceof Date
      ? inputDate
      : new Date(inputDate);

  // =========================
  // INVALID DATE
  // =========================

  if (
    isNaN(
      followupDate.getTime()
    )
  ) {
    return {
      status: "NONE",

      label: "Invalid Date",

      shortLabel: "-",

      icon: "⚠️",

      textColor:
        "text-slate-500",

      bgColor:
        "bg-slate-100",

      borderColor:
        "border-slate-200",

      badgeClassName: `
        bg-slate-100
        text-slate-500
        border-slate-200
      `,

      daysDiff: null,

      isUrgent: false,

      sortPriority: 5,
    };
  }

  // =========================
  // TODAY
  // =========================

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  followupDate.setHours(
    0,
    0,
    0,
    0
  );

  // =========================
  // DIFF DAYS
  // =========================

  const diffMs =
    followupDate.getTime() -
    today.getTime();

  const diffDays = Math.floor(
    diffMs /
      (1000 *
        60 *
        60 *
        24)
  );

  // =========================
  // OVERDUE
  // =========================

  if (diffDays < 0) {
    return {
      status: "OVERDUE",

      label: `Overdue ${Math.abs(
        diffDays
      )}d`,

      shortLabel: `-${Math.abs(
        diffDays
      )}d`,

      icon: "🚨",

      textColor:
        "text-red-700",

      bgColor:
        "bg-red-50",

      borderColor:
        "border-red-100",

      badgeClassName: `
        bg-red-50
        text-red-700
        border-red-100
      `,

      daysDiff: diffDays,

      isUrgent: true,

      sortPriority: 1,
    };
  }

  // =========================
  // TODAY
  // =========================

  if (diffDays === 0) {
    return {
      status: "TODAY",

      label:
        "Follow Up Today",

      shortLabel:
        "Today",

      icon: "⚠️",

      textColor:
        "text-orange-700",

      bgColor:
        "bg-orange-50",

      borderColor:
        "border-orange-100",

      badgeClassName: `
        bg-orange-50
        text-orange-700
        border-orange-100
      `,

      daysDiff: 0,

      isUrgent: true,

      sortPriority: 2,
    };
  }

  // =========================
  // TOMORROW
  // =========================

  if (diffDays === 1) {
    return {
      status: "TOMORROW",

      label:
        "Follow Up Tomorrow",

      shortLabel:
        "Tomorrow",

      icon: "📅",

      textColor:
        "text-blue-700",

      bgColor:
        "bg-blue-50",

      borderColor:
        "border-blue-100",

      badgeClassName: `
        bg-blue-50
        text-blue-700
        border-blue-100
      `,

      daysDiff: 1,

      isUrgent: false,

      sortPriority: 3,
    };
  }

  // =========================
  // UPCOMING
  // =========================

  return {
    status: "UPCOMING",

    label: `Follow Up in ${diffDays}d`,

    shortLabel: `+${diffDays}d`,

    icon: "📌",

    textColor:
      "text-sky-700",

    bgColor:
      "bg-sky-50",

    borderColor:
      "border-sky-100",

    badgeClassName: `
      bg-sky-50
      text-sky-700
      border-sky-100
    `,

    daysDiff: diffDays,

    isUrgent: false,

    sortPriority: 4,
  };
}

// =========================
// BOOLEAN HELPERS
// =========================

export function isFollowupToday(
  inputDate?: string | Date | null
) {
  return (
    getFollowupStatus(
      inputDate
    ).status === "TODAY"
  );
}

export function isFollowupOverdue(
  inputDate?: string | Date | null
) {
  return (
    getFollowupStatus(
      inputDate
    ).status ===
    "OVERDUE"
  );
}

export function isFollowupUrgent(
  inputDate?: string | Date | null
) {
  return (
    getFollowupStatus(
      inputDate
    ).isUrgent
  );
}

// =========================
// SORT HELPER
// =========================

export function sortContactsByFollowup(
  a: any,
  b: any
) {
  const aPriority =
    getFollowupStatus(
      a.next_followup_at
    ).sortPriority;

  const bPriority =
    getFollowupStatus(
      b.next_followup_at
    ).sortPriority;

  return (
    aPriority - bPriority
  );
}