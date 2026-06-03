"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  RotateCcw,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import SearchInput from "@/components/ui/SearchInput";

// =========================
// TYPES
// =========================

type LeadsFiltersProps = {

  // =========================
  // VALUES
  // =========================

  search: string;

  city: string;

  district: string;

  propertyType: string;

  marketType: string;

  // =========================
  // EVENTS
  // =========================

  onSearchChange: (
    value: string
  ) => void;

  onCityChange: (
    value: string
  ) => void;

  onDistrictChange: (
    value: string
  ) => void;

  onPropertyTypeChange: (
    value: string
  ) => void;

  onMarketTypeChange: (
    value: string
  ) => void;

  onReset: () => void;
};

// =========================
// COMPONENT
// =========================

export default function LeadsFilters({

  search,

  city,

  district,

  propertyType,

  marketType,

  onSearchChange,

  onCityChange,

  onDistrictChange,

  onPropertyTypeChange,

  onMarketTypeChange,

  onReset,

}: LeadsFiltersProps) {

  // =========================
  // STATES
  // =========================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    cityOptions,
    setCityOptions,
  ] = useState<string[]>([]);

  const [
    districtOptions,
    setDistrictOptions,
  ] = useState<string[]>([]);

  const [
    propertyTypeOptions,
    setPropertyTypeOptions,
  ] = useState<any[]>([]);

  const [
    marketTypeOptions,
    setMarketTypeOptions,
  ] = useState<any[]>([]);

  // =========================
  // FETCH FILTER OPTIONS
  // =========================

  async function fetchFilters() {

    try {

      setLoading(true);

      // =========================
      // CITY
      // =========================

      const {
        data: cityData,
      } = await supabase

        .from("leads")

        .select("city")

        .not(
          "city",
          "is",
          null
        );

      // =========================
      // DISTRICT
      // =========================

      const {
        data: districtData,
      } = await supabase

        .from("leads")

        .select("district")

        .not(
          "district",
          "is",
          null
        );

      // =========================
      // PROPERTY TYPE
      // =========================

      const {
        data:
          propertyTypeData,
      } = await supabase

        .from(
          "property_type"
        )

        .select(`
          property_type_id,
          property_type_name
        `)

        .order(
          "property_type_name"
        );

      // =========================
      // MARKET TYPE
      // =========================

      const {
        data:
          marketTypeData,
      } = await supabase

        .from(
          "market_types"
        )

        .select(`
          market_type_id,
          market_type_name
        `)

        .order(
          "market_type_name"
        );

      // =========================
      // FORMAT CITY
      // =========================

      const uniqueCities = [
        ...new Set(
          (
            cityData || []
          ).map(
            (
              item: any
            ) =>
              item.city
          )
        ),
      ]
        .filter(Boolean)
        .sort();

      // =========================
      // FORMAT DISTRICT
      // =========================

      const uniqueDistricts = [
        ...new Set(
          (
            districtData ||
            []
          ).map(
            (
              item: any
            ) =>
              item.district
          )
        ),
      ]
        .filter(Boolean)
        .sort();

      // =========================
      // SET STATES
      // =========================

      setCityOptions(
        uniqueCities as string[]
      );

      setDistrictOptions(
        uniqueDistricts as string[]
      );

      setPropertyTypeOptions(
        propertyTypeData ||
          []
      );

      setMarketTypeOptions(
        marketTypeData ||
          []
      );

    } catch (error) {

      console.error(
        "Fetch filter error:",
        error
      );

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {

    fetchFilters();

  }, []);

  // =========================
  // RENDER
  // =========================

  return (

    <div
      className="
        rounded-[28px]

        border
        border-slate-200

        bg-white

        p-4

        shadow-sm
      "
    >

      {/* ========================= */}
      {/* TOP */}
      {/* ========================= */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div>

          <h3
            className="
              text-sm
              font-semibold

              text-slate-900
            "
          >
            Filters
          </h3>

          <p
            className="
              mt-1

              text-xs

              text-slate-500
            "
          >
            Search and filter leads
          </p>

        </div>

        {/* RESET */}

        <button
          type="button"

          onClick={onReset}

          className="
            flex
            items-center
            gap-2

            rounded-2xl

            border
            border-slate-200

            px-4
            py-2.5

            text-sm
            font-medium

            text-slate-600

            transition-all

            hover:bg-slate-50
          "
        >

          <RotateCcw
            size={16}
          />

          Reset

        </button>

      </div>

      {/* ========================= */}
      {/* FILTERS */}
      {/* ========================= */}

      <div
        className="
          mt-5

          grid
          grid-cols-1
          gap-3

          md:grid-cols-2

          xl:grid-cols-5
        "
      >

        {/* SEARCH */}

        <div
          className="
            xl:col-span-2
          "
        >

          <SearchInput
            value={search}

            onChange={
              onSearchChange
            }

            placeholder="
              Contact, phone,
              city, district...
            "

            loading={loading}

            size="md"
          />

        </div>

        {/* CITY */}

        <select
          value={city}

          onChange={(e) =>
            onCityChange(
              e.target.value
            )
          }

          className="
            h-12
            w-full

            rounded-2xl

            border
            border-slate-200

            bg-white

            px-4

            text-sm
            font-medium

            text-slate-700

            outline-none

            transition-all

            focus:border-[#F4C842]
            focus:ring-4
            focus:ring-[#F4C842]/10
          "
        >

          <option value="">
            All City
          </option>

          {cityOptions.map(
            (
              item,
              index
            ) => (

              <option
                key={index}
                value={item}
              >
                {item}
              </option>

            )
          )}

        </select>

        {/* DISTRICT */}

        <select
          value={district}

          onChange={(e) =>
            onDistrictChange(
              e.target.value
            )
          }

          className="
            h-12
            w-full

            rounded-2xl

            border
            border-slate-200

            bg-white

            px-4

            text-sm
            font-medium

            text-slate-700

            outline-none

            transition-all

            focus:border-[#F4C842]
            focus:ring-4
            focus:ring-[#F4C842]/10
          "
        >

          <option value="">
            All District
          </option>

          {districtOptions.map(
            (
              item,
              index
            ) => (

              <option
                key={index}
                value={item}
              >
                {item}
              </option>

            )
          )}

        </select>

        {/* PROPERTY TYPE */}

        <select
          value={propertyType}

          onChange={(e) =>
            onPropertyTypeChange(
              e.target.value
            )
          }

          className="
            h-12
            w-full

            rounded-2xl

            border
            border-slate-200

            bg-white

            px-4

            text-sm
            font-medium

            text-slate-700

            outline-none

            transition-all

            focus:border-[#F4C842]
            focus:ring-4
            focus:ring-[#F4C842]/10
          "
        >

          <option value="">
            Property Type
          </option>

          {propertyTypeOptions.map(
            (
              item: any
            ) => (

              <option
                key={
                  item.property_type_id
                }

                value={
                  item.property_type_id
                }
              >
                {
                  item.property_type_name
                }
              </option>

            )
          )}

        </select>

        {/* MARKET TYPE */}

        <select
          value={marketType}

          onChange={(e) =>
            onMarketTypeChange(
              e.target.value
            )
          }

          className="
            h-12
            w-full

            rounded-2xl

            border
            border-slate-200

            bg-white

            px-4

            text-sm
            font-medium

            text-slate-700

            outline-none

            transition-all

            focus:border-[#F4C842]
            focus:ring-4
            focus:ring-[#F4C842]/10
          "
        >

          <option value="">
            Market Type
          </option>

          {marketTypeOptions.map(
            (
              item: any
            ) => (

              <option
                key={
                  item.market_type_id
                }

                value={
                  item.market_type_id
                }
              >
                {
                  item.market_type_name
                }
              </option>

            )
          )}

        </select>

      </div>

      {/* ========================= */}
      {/* ACTIVE FILTERS */}
      {/* ========================= */}

      {(search ||
        city ||
        district ||
        propertyType ||
        marketType) && (

        <div
          className="
            mt-4

            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <span
            className="
              text-xs
              font-medium

              text-slate-500
            "
          >
            Active Filters:
          </span>

          {search && (
            <FilterBadge
              label={`Search: ${search}`}
            />
          )}

          {city && (
            <FilterBadge
              label={`City: ${city}`}
            />
          )}

          {district && (
            <FilterBadge
              label={`District: ${district}`}
            />
          )}

          {propertyType && (
            <FilterBadge
              label="Property Type"
            />
          )}

          {marketType && (
            <FilterBadge
              label={`Market: ${marketType}`}
            />
          )}

        </div>

      )}

    </div>
  );
}

// =========================
// FILTER BADGE
// =========================

function FilterBadge({
  label,
}: {
  label: string;
}) {

  return (

    <div
      className="
        inline-flex
        items-center

        rounded-full

        bg-[#FFF6D8]

        px-3
        py-1

        text-xs
        font-medium

        text-[#A97700]
      "
    >
      {label}
    </div>
  );
}