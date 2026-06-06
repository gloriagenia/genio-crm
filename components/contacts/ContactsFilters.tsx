"use client";

import { useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// =========================
// TYPES
// =========================

interface ContactsFiltersProps {
  search: string;
  setSearch: (
    value: string
  ) => void;

  filterStatus: string;
  setFilterStatus: (
    value: string
  ) => void;

  filterPriority: string;
  setFilterPriority: (
    value: string
  ) => void;

  filterFollowup: string;
  setFilterFollowup: (
    value: string
  ) => void;

  sortOrder: string;
  setSortOrder: (
    value: string
  ) => void;

  onReset: () => void;

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
  const [expanded, setExpanded] =
    useState(false);

  const activeFilters =
    useMemo(() => {
      let count = 0;

      if (filterStatus) count++;
      if (filterPriority) count++;
      if (filterFollowup)
        count++;

      return count;
    }, [
      filterStatus,
      filterPriority,
      filterFollowup,
    ]);

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
      {/* HEADER */}
      <div
        className="
          px-4
          py-4

          border-b
          border-slate-100
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div>
            <h2
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >
              Contacts
            </h2>

            <p
              className="
                mt-0.5

                text-xs
                text-slate-500
              "
            >
              {typeof totalData ===
              "number"
                ? `${totalData} contacts`
                : "Manage contacts"}
            </p>
          </div>

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
            "
          >
            <RotateCcw
              size={14}
            />

            Reset
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-4">
        <div className="relative">
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

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="
              Search name,
              phone,
              company...
            "
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

              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-100
            "
          />
        </div>

        {/* FILTER TOGGLE */}
        <button
          onClick={() =>
            setExpanded(
              !expanded
            )
          }
          className="
            mt-4

            flex
            w-full
            items-center
            justify-between

            rounded-2xl

            border
            border-slate-200

            px-4
            py-3

            text-sm
            font-semibold

            text-slate-700

            hover:bg-slate-50

            transition-all
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <SlidersHorizontal
              size={16}
            />

            Filters

            {activeFilters >
              0 && (
              <span
                className="
                  rounded-full

                  bg-yellow-100

                  px-2
                  py-0.5

                  text-[11px]
                  font-bold

                  text-yellow-700
                "
              >
                {
                  activeFilters
                }
              </span>
            )}
          </div>

          {expanded ? (
            <ChevronUp
              size={18}
            />
          ) : (
            <ChevronDown
              size={18}
            />
          )}
        </button>
      </div>

      {/* EXPANDABLE FILTERS */}
      {expanded && (
        <div
          className="
            px-4
            pb-4
          "
        >
          <div
            className="
              grid
              grid-cols-1

              gap-3
            "
          >
            {/* STATUS */}
            <select
              value={
                filterStatus
              }
              onChange={(e) =>
                setFilterStatus(
                  e.target.value
                )
              }
              className="
                h-12

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-4

                text-sm

                outline-none

                focus:border-yellow-400
                focus:ring-4
                focus:ring-yellow-100
              "
            >
              <option value="">
                All Status
              </option>

              {CONTACT_STATUS.map(
                (
                  status
                ) => (
                  <option
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {status}
                  </option>
                )
              )}
            </select>

            {/* PRIORITY */}
            <select
              value={
                filterPriority
              }
              onChange={(e) =>
                setFilterPriority(
                  e.target.value
                )
              }
              className="
                h-12

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-4

                text-sm

                outline-none

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
                    key={
                      priority
                    }
                    value={
                      priority
                    }
                  >
                    {priority}
                  </option>
                )
              )}
            </select>

            {/* FOLLOWUP */}
            <select
              value={
                filterFollowup
              }
              onChange={(e) =>
                setFilterFollowup(
                  e.target.value
                )
              }
              className="
                h-12

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-4

                text-sm

                outline-none

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
                    key={
                      option
                    }
                    value={
                      option
                    }
                  >
                    {option}
                  </option>
                )
              )}
            </select>

            {/* SORT */}
            <select
              value={
                sortOrder
              }
              onChange={(e) =>
                setSortOrder(
                  e.target.value
                )
              }
              className="
                h-12

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-4

                text-sm

                outline-none

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
      )}
    </div>
  );
}