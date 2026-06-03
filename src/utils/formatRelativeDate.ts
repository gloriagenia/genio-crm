// =========================
// src/utils/formatRelativeDate.ts
// =========================

type RelativeDateOptions = {
  withSuffix?: boolean;

  emptyLabel?: string;
};

// =========================
// FORMAT RELATIVE DATE
// =========================

export function formatRelativeDate(
  inputDate?: string | Date | null,
  options?: RelativeDateOptions
) {
  // =========================
  // OPTIONS
  // =========================

  const withSuffix =
    options?.withSuffix ??
    true;

  const emptyLabel =
    options?.emptyLabel ??
    "-";

  // =========================
  // EMPTY
  // =========================

  if (!inputDate) {
    return emptyLabel;
  }

  // =========================
  // PARSE DATE
  // =========================

  const date =
    inputDate instanceof Date
      ? inputDate
      : new Date(inputDate);

  // =========================
  // INVALID DATE
  // =========================

  if (
    isNaN(date.getTime())
  ) {
    return emptyLabel;
  }

  // =========================
  // NOW
  // =========================

  const now = new Date();

  // =========================
  // DIFFERENCE
  // =========================

  const diffMs =
    now.getTime() -
    date.getTime();

  const seconds = Math.floor(
    diffMs / 1000
  );

  const minutes = Math.floor(
    seconds / 60
  );

  const hours = Math.floor(
    minutes / 60
  );

  const days = Math.floor(
    hours / 24
  );

  const weeks = Math.floor(
    days / 7
  );

  const months = Math.floor(
    days / 30
  );

  const years = Math.floor(
    days / 365
  );

  // =========================
  // JUST NOW
  // =========================

  if (seconds < 60) {
    return withSuffix
      ? "just now"
      : "0m";
  }

  // =========================
  // MINUTES
  // =========================

  if (minutes < 60) {
    return withSuffix
      ? `${minutes}m ago`
      : `${minutes}m`;
  }

  // =========================
  // HOURS
  // =========================

  if (hours < 24) {
    return withSuffix
      ? `${hours}h ago`
      : `${hours}h`;
  }

  // =========================
  // DAYS
  // =========================

  if (days < 7) {
    return withSuffix
      ? `${days}d ago`
      : `${days}d`;
  }

  // =========================
  // WEEKS
  // =========================

  if (weeks < 5) {
    return withSuffix
      ? `${weeks}w ago`
      : `${weeks}w`;
  }

  // =========================
  // MONTHS
  // =========================

  if (months < 12) {
    return withSuffix
      ? `${months}mo ago`
      : `${months}mo`;
  }

  // =========================
  // YEARS
  // =========================

  return withSuffix
    ? `${years}y ago`
    : `${years}y`;
}

// =========================
// FORMAT FOLLOWUP LABEL
// =========================

export function formatFollowupLabel(
  inputDate?: string | Date | null
) {
  if (!inputDate) {
    return "No Follow Up";
  }

  const today = new Date();

  const followupDate =
    inputDate instanceof Date
      ? inputDate
      : new Date(inputDate);

  // reset jam
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

  const diffMs =
    followupDate.getTime() -
    today.getTime();

  const diffDays = Math.floor(
    diffMs /
      (1000 * 60 * 60 * 24)
  );

  // =========================
  // OVERDUE
  // =========================

  if (diffDays < 0) {
    return `Overdue ${Math.abs(
      diffDays
    )}d`;
  }

  // =========================
  // TODAY
  // =========================

  if (diffDays === 0) {
    return "Follow Up Today";
  }

  // =========================
  // TOMORROW
  // =========================

  if (diffDays === 1) {
    return "Follow Up Tomorrow";
  }

  // =========================
  // NEXT DAYS
  // =========================

  return `Follow Up in ${diffDays}d`;
}

// =========================
// FOLLOWUP COLOR
// =========================

export function getFollowupVariant(
  inputDate?: string | Date | null
) {
  if (!inputDate) {
    return {
      bg: "bg-slate-100",
      text: "text-slate-500",
      border:
        "border-slate-200",
    };
  }

  const today = new Date();

  const followupDate =
    inputDate instanceof Date
      ? inputDate
      : new Date(inputDate);

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

  const diffMs =
    followupDate.getTime() -
    today.getTime();

  const diffDays = Math.floor(
    diffMs /
      (1000 * 60 * 60 * 24)
  );

  // =========================
  // OVERDUE
  // =========================

  if (diffDays < 0) {
    return {
      bg: "bg-red-50",
      text: "text-red-600",
      border:
        "border-red-100",
    };
  }

  // =========================
  // TODAY
  // =========================

  if (diffDays === 0) {
    return {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border:
        "border-orange-100",
    };
  }

  // =========================
  // UPCOMING
  // =========================

  return {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border:
      "border-blue-100",
  };
}