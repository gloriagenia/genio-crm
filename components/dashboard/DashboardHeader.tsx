"use client";

import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

export default function DashboardHeader() {
  return (
    <div
      className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
      "
    >
      {/* LEFT */}
      <div>
        <h1
          className="
            text-3xl
            lg:text-4xl
            font-bold
            text-slate-900
            tracking-tight
          "
        >
          Dashboard
        </h1>

        <p
          className="
            text-slate-500
            mt-2
            text-sm
            lg:text-base
          "
        >
          Pantau aktivitas, follow up,
          dan progress deal properti.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* DATE RANGE */}
        <button
          className="
            flex
            items-center
            gap-3

            h-12
            px-4

            rounded-2xl
            border
            border-slate-200

            bg-white
            hover:bg-slate-50

            transition-all
            duration-200

            shadow-sm
          "
        >
          {/* ICON */}
          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-yellow-50
              flex
              items-center
              justify-center
            "
          >
            <CalendarDays
              className="
                w-5
                h-5
                text-yellow-600
              "
            />
          </div>

          {/* TEXT */}
          <div className="text-left">
            <p
              className="
                text-xs
                text-slate-400
                leading-none
              "
            >
              Date Range
            </p>

            <p
              className="
                text-sm
                font-semibold
                text-slate-800
                mt-1
              "
            >
              This Month
            </p>
          </div>

          {/* DROPDOWN */}
          <ChevronDown
            className="
              w-4
              h-4
              text-slate-400
            "
          />
        </button>
      </div>
    </div>
  );
}