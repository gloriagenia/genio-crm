"use client";

type InquiryFiltersProps = {
  filterName: string;
  setFilterName: (
    value: string
  ) => void;

  filterCategory: string;
  setFilterCategory: (
    value: string
  ) => void;

  filterPropertyType: string;
  setFilterPropertyType: (
    value: string
  ) => void;

  filterDistrict: string;
  setFilterDistrict: (
    value: string
  ) => void;

  filterCity: string;
  setFilterCity: (
    value: string
  ) => void;

  filterPriority: string;
  setFilterPriority: (
    value: string
  ) => void;

  onReset: () => void;
};

export default function InquiryFilters({
  filterName,
  setFilterName,

  filterCategory,
  setFilterCategory,

  filterPropertyType,
  setFilterPropertyType,

  filterDistrict,
  setFilterDistrict,

  filterCity,
  setFilterCity,

  filterPriority,
  setFilterPriority,

  onReset,
}: InquiryFiltersProps) {
  return (
    <div
      className="
        bg-white
        border
        rounded-2xl
        p-4
        space-y-3
      "
    >
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-3
        "
      >
        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search Requirement"
          value={filterName}
          onChange={(e) =>
            setFilterName(
              e.target.value
            )
          }
          className="
            h-11
            border
            rounded-xl
            px-3
            w-full
          "
        />

        {/* CATEGORY */}

        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(
              e.target.value
            )
          }
          className="
            h-11
            border
            rounded-xl
            px-3
            w-full
          "
        >
          <option value="">
            All Category
          </option>

          <option value="Buy">
            Buy
          </option>

          <option value="Rent">
            Rent
          </option>

          <option value="Sell">
            Sell
          </option>
        </select>

        {/* PROPERTY TYPE */}

        <input
          type="text"
          placeholder="Property Type"
          value={filterPropertyType}
          onChange={(e) =>
            setFilterPropertyType(
              e.target.value
            )
          }
          className="
            h-11
            border
            rounded-xl
            px-3
            w-full
          "
        />

        {/* DISTRICT */}

        <input
          type="text"
          placeholder="District"
          value={filterDistrict}
          onChange={(e) =>
            setFilterDistrict(
              e.target.value
            )
          }
          className="
            h-11
            border
            rounded-xl
            px-3
            w-full
          "
        />

        {/* CITY */}

        <input
          type="text"
          placeholder="City"
          value={filterCity}
          onChange={(e) =>
            setFilterCity(
              e.target.value
            )
          }
          className="
            h-11
            border
            rounded-xl
            px-3
            w-full
          "
        />

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
            border
            rounded-xl
            px-3
            w-full
          "
        >
          <option value="">
            All Priority
          </option>

          <option value="HOT">
            HOT
          </option>

          <option value="WARM">
            WARM
          </option>

          <option value="COLD">
            COLD
          </option>
        </select>

        {/* RESET */}

        <button
          onClick={onReset}
          className="
            h-11
            border
            rounded-xl
            px-4
            hover:bg-gray-100
            transition
          "
        >
          Reset
        </button>
      </div>
    </div>
  );
}
