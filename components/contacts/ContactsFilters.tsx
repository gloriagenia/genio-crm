"use client";

interface ContactsFiltersProps {
  // SEARCH
  searchName: string;

  setSearchName: (
    value: string
  ) => void;

  searchPhone: string;

  setSearchPhone: (
    value: string
  ) => void;

  // STATUS
  filterStatus: string;

  setFilterStatus: (
    value: string
  ) => void;

  // SORT
  sortOrder: string;

  setSortOrder: (
    value: string
  ) => void;

  // RESET
  onReset: () => void;
}

const CONTACT_STATUS = [
  "New",
  "Contacted",
  "Active",
  "Inactive",
  "Closed",
];

export default function ContactsFilters({
  searchName,
  setSearchName,

  searchPhone,
  setSearchPhone,

  filterStatus,
  setFilterStatus,

  sortOrder,
  setSortOrder,

  onReset,
}: ContactsFiltersProps) {
  return (
    <div
      className="
        sticky
        top-[80px]
        z-30

        bg-white/90
        backdrop-blur-md

        border
        border-slate-200

        rounded-3xl

        p-4

        shadow-sm
      "
    >
      {/* WRAPPER */}
      <div
        className="
          flex
          flex-col
          lg:flex-row

          gap-3
        "
      >
        {/* SEARCH NAME */}
        <input
          type="text"
          placeholder="Search name"
          value={searchName}
          onChange={(e) =>
            setSearchName(
              e.target.value
            )
          }
          className="
            flex-1

            h-12

            rounded-2xl

            border
            border-slate-200

            px-4

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

        {/* SEARCH PHONE */}
        <input
          type="text"
          placeholder="Search phone"
          value={searchPhone}
          onChange={(e) =>
            setSearchPhone(
              e.target.value
            )
          }
          className="
            flex-1

            h-12

            rounded-2xl

            border
            border-slate-200

            px-4

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

        {/* STATUS */}
        <select
          value={filterStatus}
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

            px-4

            text-base
            lg:text-sm

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

        {/* SORT */}
        <select
          value={sortOrder}
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

            px-4

            text-base
            lg:text-sm

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

        {/* RESET */}
        <button
          onClick={onReset}
          className="
            h-12

            px-5

            rounded-2xl

            border
            border-slate-200

            bg-white

            hover:bg-slate-100

            text-base
            lg:text-sm

            font-semibold

            transition-all
            duration-200

            whitespace-nowrap
          "
        >
          Reset
        </button>
      </div>
    </div>
  );
}