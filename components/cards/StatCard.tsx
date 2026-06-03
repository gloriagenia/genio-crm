"use client";

import clsx from "clsx";

import {
  ArrowDownRight,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";

// =========================
// TYPES
// =========================

type StatCardProps = {

  // =========================
  // REQUIRED
  // =========================

  title: string;

  value: number | string;

  icon: LucideIcon;

  // =========================
  // OPTIONAL
  // =========================

  subtitle?: string;

  percentage?: number;

  trend?: "up" | "down" | "neutral";

  loading?: boolean;

  className?: string;

  iconColor?: string;

  iconBgColor?: string;

  valuePrefix?: string;

  valueSuffix?: string;

  onClick?: () => void;

  // =========================
  // DATABASE META
  // =========================

  // optional
  // supaya scalable nanti

  tableName?: string;

  filterLabel?: string;
};

// =========================
// COMPONENT
// =========================

export default function StatCard({
  title,
  value,
  icon: Icon,

  subtitle,

  percentage,

  trend = "neutral",

  loading = false,

  className,

  iconColor = "text-[#E0B100]",

  iconBgColor = "bg-[#FFF9E8]",

  valuePrefix = "",

  valueSuffix = "",

  onClick,

  tableName,

  filterLabel,
}: StatCardProps) {

  // =========================
  // TREND COLORS
  // =========================

  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
      ? "text-red-600"
      : "text-slate-500";

  // =========================
  // CARD
  // =========================

  return (

    <button
      type="button"

      disabled={!onClick}

      onClick={onClick}

      className={clsx(
        `
          group

          relative

          flex
          w-full
          flex-col

          overflow-hidden

          rounded-[28px]

          border
          border-slate-200

          bg-white

          p-5

          text-left

          shadow-sm

          transition-all
          duration-200

          hover:-translate-y-[2px]
          hover:shadow-md

          disabled:cursor-default
        `,
        className
      )}
    >

      {/* TOP */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          {/* TITLE */}

          <p
            className="
              text-sm
              font-medium

              text-slate-500
            "
          >
            {title}
          </p>

          {/* VALUE */}

          {loading ? (

            <div
              className="
                mt-4

                h-10
                w-24

                animate-pulse

                rounded-xl

                bg-slate-100
              "
            />

          ) : (

            <div
              className="
                mt-3

                flex
                items-end
                gap-2
              "
            >

              <h3
                className="
                  truncate

                  text-[34px]
                  font-bold
                  leading-none

                  tracking-tight

                  text-[#0F172A]
                "
              >

                {valuePrefix}

                {typeof value ===
                "number"
                  ? value.toLocaleString()
                  : value}

                {valueSuffix}

              </h3>

              {/* TREND */}

              {typeof percentage ===
                "number" && (

                <div
                  className={clsx(
                    `
                      mb-1

                      flex
                      items-center
                      gap-1

                      rounded-full

                      px-2
                      py-1

                      text-xs
                      font-semibold
                    `,
                    trend === "up" &&
                      `
                        bg-emerald-50
                        text-emerald-600
                      `,
                    trend ===
                      "down" &&
                      `
                        bg-red-50
                        text-red-600
                      `,
                    trend ===
                      "neutral" &&
                      `
                        bg-slate-100
                        text-slate-500
                      `
                  )}
                >

                  {trend === "up" && (

                    <ArrowUpRight
                      size={12}
                    />

                  )}

                  {trend ===
                    "down" && (

                    <ArrowDownRight
                      size={12}
                    />

                  )}

                  {percentage}%

                </div>

              )}

            </div>

          )}

        </div>

        {/* ICON */}

        <div
          className={clsx(
            `
              flex
              h-16
              w-16

              shrink-0

              items-center
              justify-center

              rounded-3xl
            `,
            iconBgColor
          )}
        >

          <Icon
            size={28}
            className={iconColor}
          />

        </div>

      </div>

      {/* BOTTOM */}

      {(subtitle ||
        filterLabel ||
        tableName) && (

        <div
          className="
            mt-5

            space-y-2
          "
        >

          {/* SUBTITLE */}

          {subtitle && (

            <p
              className="
                text-sm
                leading-relaxed

                text-slate-500
              "
            >
              {subtitle}
            </p>

          )}

          {/* META */}

          {(filterLabel ||
            tableName) && (

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              {tableName && (

                <span
                  className="
                    rounded-full

                    bg-slate-100

                    px-2.5
                    py-1

                    text-[11px]
                    font-medium

                    uppercase
                    tracking-wide

                    text-slate-500
                  "
                >
                  {tableName}
                </span>

              )}

              {filterLabel && (

                <span
                  className="
                    rounded-full

                    bg-[#FFF9E8]

                    px-2.5
                    py-1

                    text-[11px]
                    font-medium

                    text-[#B88900]
                  "
                >
                  {filterLabel}
                </span>

              )}

            </div>

          )}

        </div>

      )}

      {/* HOVER BORDER */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          rounded-[28px]

          ring-1
          ring-transparent

          transition-all

          group-hover:ring-[#F4C842]/30
        "
      />

    </button>
  );
}