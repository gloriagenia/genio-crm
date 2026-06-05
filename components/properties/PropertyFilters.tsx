"use client";

type PropertyFiltersProps = {
  propertyTypes: string[];

  filterPropertyType: string;
  setFilterPropertyType: (
    value: string
  ) => void;

  filterMarketType: string;
  setFilterMarketType: (
    value: string
  ) => void;

  filterStatus: string;
  setFilterStatus: (
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

  minPrice: string;
  setMinPrice: (
    value: string
  ) => void;

  maxPrice: string;
  setMaxPrice: (
    value: string
  ) => void;

  onReset: () => void;
};

export default function PropertyFilters({
  propertyTypes,

  filterPropertyType,
  setFilterPropertyType,

  filterMarketType,
  setFilterMarketType,

  filterStatus,
  setFilterStatus,

  filterDistrict,
  setFilterDistrict,

  filterCity,
  setFilterCity,

  minPrice,
  setMinPrice,

  maxPrice,
  setMaxPrice,

  onReset,
}: PropertyFiltersProps) {
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
      {/* MOBILE FIRST */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-3
        "
      >
        {/* PROPERTY TYPE */}

        <select
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
        >
          <option value="">
            All Property Type
          </option>

          {propertyTypes.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>

        {/* MARKET TYPE */}

        <select
          value={filterMarketType}
          onChange={(e) =>
            setFilterMarketType(
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
            All Market Type
          </option>

          <option value="Sale">
            Sale
          </option>

          <option value="Rent">
            Rent
          </option>

          <option value="Sale & Rent">
            Sale & Rent
          </option>
        </select>

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
            border
            rounded-xl
            px-3
            w-full
          "
        >
          <option value="">
            All Status
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Exclusive">
            Exclusive
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Sold">
            Sold
          </option>

          <option value="Rented">
            Rented
          </option>

          <option value="Hold">
            Hold
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

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

        {/* MIN PRICE */}

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(
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

        {/* MAX PRICE */}

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(
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