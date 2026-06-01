import Link from "next/link";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;

  value: string | number;

  subtitle?: string;

  icon: LucideIcon;

  href: string;

  trend?: string;

  trendType?: "positive" | "negative" | "neutral";
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
  trend,
  trendType = "neutral",
}: StatsCardProps) {
  return (
    <Link href={href}>
      <div
        className="
          group
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm

          p-5
          lg:p-6

          transition-all
          duration-300

          hover:shadow-lg
          hover:-translate-y-1
          hover:border-yellow-300

          cursor-pointer
        "
      >
        {/* TOP */}
        <div className="flex items-start justify-between gap-4">
          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0">
            {/* TITLE */}
            <p
              className="
                text-base
                lg:text-sm

                font-medium
                text-slate-500

                leading-snug
              "
            >
              {title}
            </p>

            {/* VALUE */}
            <h2
              className="
                mt-4

                text-5xl
                lg:text-5xl

                font-bold
                tracking-tight
                text-slate-900

                leading-none
              "
            >
              {value}
            </h2>

            {/* SUBTITLE */}
            {subtitle && (
              <p
                className="
                  mt-4

                  text-base
                  lg:text-sm

                  text-slate-500

                  leading-relaxed
                "
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* ICON */}
          <div
            className="
              w-16
              h-16

              lg:w-14
              lg:h-14

              rounded-2xl

              bg-yellow-50

              flex
              items-center
              justify-center

              shrink-0

              transition-all
              duration-300

              group-hover:bg-yellow-100
            "
          >
            <Icon
              className="
                w-8
                h-8

                lg:w-7
                lg:h-7

                text-yellow-500
              "
            />
          </div>
        </div>

        {/* FOOTER */}
        {trend && (
          <div className="mt-6">
            <div
              className={`
                inline-flex
                items-center
                rounded-full

                px-3
                py-1.5

                text-sm
                lg:text-xs

                font-semibold

                ${
                  trendType === "positive"
                    ? "bg-green-100 text-green-700"
                    : ""
                }

                ${
                  trendType === "negative"
                    ? "bg-red-100 text-red-700"
                    : ""
                }

                ${
                  trendType === "neutral"
                    ? "bg-slate-100 text-slate-600"
                    : ""
                }
              `}
            >
              {trend}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}