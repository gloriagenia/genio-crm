"use client";

import clsx from "clsx";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

// =========================
// TYPES
// =========================

type FollowUpBadgeProps = {

  lastContact?: string | null;

  nextFollowup?: string | null;

  priority?: string;

  showNextDate?: boolean;

  className?: string;
};

// =========================
// HELPERS
// =========================

function getSLA(
  priority?: string
) {

  switch (priority) {

    case "HOT":
      return 1;

    case "WARM":
      return 3;

    case "COLD":
      return 7;

    default:
      return 3;
  }
}

function getDaysDiff(
  date?: string | null
) {

  if (!date) return null;

  const today =
    new Date();

  const target =
    new Date(date);

  const diff =
    today.getTime() -
    target.getTime();

  return Math.floor(
    diff /
      (1000 *
        60 *
        60 *
        24)
  );
}

function formatNextFollowup(
  date?: string | null
) {

  if (!date) return "-";

  return new Date(
    date
  ).toLocaleDateString(
    "en-GB",
    {

      day: "2-digit",

      month: "long",

      year: "numeric",
    }
  );
}

function getLastContactLabel(
  days: number | null
) {

  if (days === null) {

    return "No Follow Up";
  }

  if (days === 0) {

    return "Today";
  }

  if (days === 1) {

    return "1 day ago";
  }

  return `${days} days ago`;
}

// =========================
// COMPONENT
// =========================

export default function FollowUpBadge({

  lastContact,

  nextFollowup,

  priority = "WARM",

  showNextDate = true,

  className,

}: FollowUpBadgeProps) {

  // =========================
  // CALCULATE
  // =========================

  const days =
    getDaysDiff(
      lastContact
    );

  const sla =
    getSLA(
      priority
    );

  const isOverdue =
    days === null ||
    days > sla;

  const lastLabel =
    getLastContactLabel(
      days
    );

  const nextLabel =
    formatNextFollowup(
      nextFollowup
    );

  // =========================
  // RENDER
  // =========================

  return (

    <div
      className={clsx(
        `
          inline-flex
          min-w-[170px]
          flex-col
          gap-2
        `,
        className
      )}
    >

      {/* LAST */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        {/* ICON */}

        <div
          className={clsx(
            `
              flex
              h-7
              w-7

              items-center
              justify-center

              rounded-full
            `,

            isOverdue
              ? `
                  bg-red-100
                  text-red-600
                `
              : `
                  bg-emerald-100
                  text-emerald-600
                `
          )}
        >

          {isOverdue ? (

            <AlertTriangle
              size={14}
            />

          ) : (

            <CheckCircle2
              size={14}
            />

          )}

        </div>

        {/* TEXT */}

        <div
          className="
            min-w-0
          "
        >

          <p
            className="
              text-[11px]
              font-medium

              uppercase
              tracking-wide

              text-slate-400
            "
          >
            Last
          </p>

          <p
            className={clsx(
              `
                truncate

                text-sm
                font-semibold
              `,

              isOverdue
                ? `
                    text-red-600
                  `
                : `
                    text-slate-800
                  `
            )}
          >
            {lastLabel}
          </p>

        </div>

      </div>

      {/* NEXT */}

      {showNextDate && (

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* ICON */}

          <div
            className="
              flex
              h-7
              w-7

              items-center
              justify-center

              rounded-full

              bg-amber-100

              text-amber-600
            "
          >

            <Clock3
              size={14}
            />

          </div>

          {/* TEXT */}

          <div
            className="
              min-w-0
            "
          >

            <p
              className="
                text-[11px]
                font-medium

                uppercase
                tracking-wide

                text-slate-400
              "
            >
              Next
            </p>

            <p
              className="
                truncate

                text-sm
                font-semibold

                text-slate-800
              "
            >
              {nextLabel}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}