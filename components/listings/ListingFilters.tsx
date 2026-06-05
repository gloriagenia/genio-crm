"use client";

type ListingFiltersProps = {
  platforms: any[];

  search: string;
  setSearch: (
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

  filterPlatform: string;
  setFilterPlatform: (
    value: string
  ) => void;

  onReset: () => void;
};

export default function ListingFilters({
  platforms,

  search,
  setSearch,

  filterMarketType,
  setFilterMarketType,

  filterStatus,
  setFilterStatus,

  filterPlatform,
  setFilterPlatform,

  onReset,
}: ListingFiltersProps) {
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
          xl:grid-cols-5
          gap-3
        "
      >
        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search Listing"
          value={search}
          onChange={(e) =>
            setSearch(
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

          <option value="Published">
            Published
          </option>

          <option value="Featured">
            Featured
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

          <option value="Expired">
            Expired
          </option>

          <option value="Archived">
            Archived
          </option>
        </select>

        {/* PLATFORM */}

        <select
          value={filterPlatform}
          onChange={(e) =>
            setFilterPlatform(
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
            All Platform
          </option>

          {platforms.map(
            (platform) => (
              <option
                key={
                  platform.platform_id
                }
                value={
                  platform.platform_id
                }
              >
                {
                  platform.platform_name
                }
              </option>
            )
          )}
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
            font-medium
          "
        >
          Reset
        </button>
      </div>
    </div>
  );
}