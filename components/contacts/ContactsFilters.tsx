"use client";

import {
  Search,
  SlidersHorizontal,
  Phone,
  RotateCcw,
} from "lucide-react";

// =========================
// TYPES
// =========================

interface ContactsFiltersProps {
  // SEARCH
  search: string;

  setSearch: (
    value: string
  ) => void;

  // STATUS
  filterStatus: string;

  setFilterStatus: (
    value: string
  ) => void;

  // PRIORITY
  filterPriority: string;

  setFilterPriority: (
    value: string
  ) => void;

  // FOLLOWUP
  filterFollowup: string;

  setFilterFollowup: (
    value: string
  ) => void;

  // SORT
  sortOrder: string;

  setSortOrder: (
    value: string
  ) => void;

  // RESET
  onReset: () => void;

  // OPTIONAL
  totalData?: number;
}

// =========================
// CONSTANTS
// =========================

const CONTACT_STATUS = [
  "New",
  "Contacted",
  "Active",
  "Inactive",
  "Closed",
];

const CONTACT_PRIORITY = [
  "HOT",
  "WARM",
  "COLD",
];

const FOLLOWUP_OPTIONS = [
  "TODAY",
  "OVERDUE",
  "UPCOMING",
];

// =========================
// COMPONENT
// =========================

export default function ContactsFilters({
  search,
  setSearch,

  filterStatus,
  setFilterStatus,

  filterPriority,
  setFilterPriority,

  filterFollowup,
  setFilterFollowup,

  sortOrder,
  setSortOrder,

  onReset,

  totalData,
}: ContactsFiltersProps) {
  return (
    <div
      className="
        sticky
        top-[72px]
        z-30

        rounded-3xl

        border
        border-slate-200

        bg-white/90

        backdrop-blur-md

        shadow-sm

        overflow-hidden
      "
    >
      {/* TOP BAR */}
      <div
        className="
          flex
          items-center
          justify-between

          px-4
          py-3

          border-b
          border-slate-100
        "
      >
        {/* LEFT */}
        <div>
          <h2
            className="
              text-sm
              font-bold
              text-slate-900
            "
          >
            Filters
          </h2>

          <p
            className="
              text-xs
              text-slate-500
              mt-0.5
            "
          >
            {typeof totalData ===
            "number"
              ? `${totalData} contacts`
              : "Manage contact list"}
          </p>
        </div>

        {/* RIGHT */}
        <button
          onClick={onReset}
          className="
            inline-flex
            items-center
            gap-2

            rounded-2xl

            border
            border-slate-200

            px-3
            py-2

            text-xs
            font-semibold

            text-slate-600

            hover:bg-slate-100

            transition-all
            duration-200
          "
        >
          <RotateCcw
            size={14}
          />

          Reset
        </button>
      </div>

      {/* CONTENT */}
      <div
        className="
          p-4

          space-y-4
        "
      >
        {/* SEARCH */}
        <div
          className="
            relative
          "
        >
          {/* ICON */}
          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2

              text-slate-400
            "
          />

          {/* INPUT */}
          <input
            type="text"
            placeholder="
              Search name,
              phone,
              company...
            "
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full

              h-12

              rounded-2xl

              border
              border-slate-200

              bg-white

              pl-11
              pr-4

              text-base
              lg:text-sm

              outline-none

              transition-all
              duration-200

              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-100
            "
          />
        </div>

        {/* QUICK FILTERS */}
        <div
          className="
            flex
            items-center
            gap-2

            overflow-x-auto

            pb-1

            scrollbar-hide
          "
        >
          {/* FILTER LABEL */}
          <div
            className="
              inline-flex
              items-center
              gap-2

              rounded-2xl

              border
              border-slate-200

              bg-slate-50

              px-3
              py-2

              text-xs
              font-semibold

              text-slate-500

              shrink-0
            "
          >
            <SlidersHorizontal
              size={14}
            />

            Filter
          </div>

          {/* TODAY */}
          <button
            onClick={() =>
              setFilterFollowup(
                filterFollowup ===
                  "TODAY"
                  ? ""
                  : "TODAY"
              )
            }
            className={`
              shrink-0

              rounded-2xl

              border

              px-3
              py-2

              text-xs
              font-semibold

              transition-all
              duration-200

              ${
                filterFollowup ===
                "TODAY"
                  ? `
                    border-orange-200
                    bg-orange-50
                    text-orange-700
                  `
                  : `
                    border-slate-200
                    bg-white
                    text-slate-600
                  `
              }
            `}
          >
            ⚠️ Today
          </button>

          {/* OVERDUE */}
          <button
            onClick={() =>
              setFilterFollowup(
                filterFollowup ===
                  "OVERDUE"
                  ? ""
                  : "OVERDUE"
              )
            }
            className={`
              shrink-0

              rounded-2xl

              border

              px-3
              py-2

              text-xs
              font-semibold

              transition-all
              duration-200

              ${
                filterFollowup ===
                "OVERDUE"
                  ? `
                    border-red-200
                    bg-red-50
                    text-red-700
                  `
                  : `
                    border-slate-200
                    bg-white
                    text-slate-600
                  `
              }
            `}
          >
            🚨 Overdue
          </button>

          {/* HOT */}
          <button
            onClick={() =>
              setFilterPriority(
                filterPriority ===
                  "HOT"
                  ? ""
                  : "HOT"
              )
            }
            className={`
              shrink-0

              rounded-2xl

              border

              px-3
              py-2

              text-xs
              font-semibold

              transition-all
              duration-200

              ${
                filterPriority ===
                "HOT"
                  ? `
                    border-red-200
                    bg-red-50
                    text-red-700
                  `
                  : `
                    border-slate-200
                    bg-white
                    text-slate-600
                  `
              }
            `}
          >
            🔥 HOT
          </button>
        </div>

        {/* SELECTS */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4

            gap-3
          "
        >
          {/* STATUS */}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value
              )
            }
            className="
              h-11

              rounded-2xl

              border
              border-slate-200

              bg-white

              px-4

              text-sm

              outline-none

              transition-all
              duration-200

              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-100
            "
          >
            <option value="">
              All Status
            </option>

            {CONTACT_STATUS.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>

          {/* PRIORITY */}
          <select
            value={filterPriority}
            onChange={(e) =>
              setFilterPriority(
                e.target.value
              )
            }
            className="
              h-11

              rounded-2xl

              border
              border-slate-200

              bg-white

              px-4

              text-sm

              outline-none

              transition-all
              duration-200

              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-100
            "
          >
            <option value="">
              All Priority
            </option>

            {CONTACT_PRIORITY.map(
              (
                priority
              ) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>
              )
            )}
          </select>

          {/* FOLLOWUP */}
          <select
            value={filterFollowup}
            onChange={(e) =>
              setFilterFollowup(
                e.target.value
              )
            }
            className="
              h-11

              rounded-2xl

              border
              border-slate-200

              bg-white

              px-4

              text-sm

              outline-none

              transition-all
              duration-200

              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-100
            "
          >
            <option value="">
              All Follow Up
            </option>

            {FOLLOWUP_OPTIONS.map(
              (
                option
              ) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>

          {/* SORT */}
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value
              )
            }
            className="
              h-11

              rounded-2xl

              border
              border-slate-200

              bg-white

              px-4

              text-sm

              outline-none

              transition-all
              duration-200

              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-100
            "
          >
            <option value="desc">
              Newest First
            </option>

            <option value="asc">
              Oldest First
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}