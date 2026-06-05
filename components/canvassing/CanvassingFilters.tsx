"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type PropertyType = {
  property_type_id: string;
  property_type_name: string;
};

type CanvassingFiltersProps = {

  filterPropertyType: string;

  filterDistrict: string;

  filterCity: string;

  filterStatus: string;

  onPropertyTypeChange: (
    value: string
  ) => void;

  onDistrictChange: (
    value: string
  ) => void;

  onCityChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: string
  ) => void;

  onReset: () => void;
};

export default function CanvassingFilters({
  filterPropertyType,
  filterDistrict,
  filterCity,
  filterStatus,
  onPropertyTypeChange,
  onDistrictChange,
  onCityChange,
  onStatusChange,
  onReset,
}: CanvassingFiltersProps) {

  const [
    propertyTypes,
    setPropertyTypes,
  ] = useState<PropertyType[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // FETCH PROPERTY TYPE
  // =========================

  useEffect(() => {

    fetchPropertyTypes();

  }, []);

  async function fetchPropertyTypes() {

    try {

      setLoading(true);

      const {
        data,
        error,
      } = await supabase

        .from("property_type")

        .select(`
          property_type_id,
          property_type_name
        `)

        .order(
          "property_type_name",
          {
            ascending: true,
          }
        );

      if (error) {

        console.log(error);

        return;
      }

      setPropertyTypes(
        data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

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
          lg:grid-cols-5
          gap-3
        "
      >

        {/* PROPERTY TYPE */}

        <select
          value={filterPropertyType}
          onChange={(e) =>
            onPropertyTypeChange(
              e.target.value
            )
          }
          className="
            border
            rounded-xl
            px-4
            py-3
            text-sm
            w-full
          "
        >

          <option value="">
            All Property Type
          </option>

          {propertyTypes.map(
            (item) => (

              <option
                key={
                  item.property_type_id
                }
                value={
                  item.property_type_name
                }
              >
                {
                  item.property_type_name
                }
              </option>

            )
          )}

        </select>

        {/* DISTRICT */}

        <input
          type="text"
          placeholder="District"
          value={filterDistrict}
          onChange={(e) =>
            onDistrictChange(
              e.target.value
            )
          }
          className="
            border
            rounded-xl
            px-4
            py-3
            text-sm
            w-full
          "
        />

        {/* CITY */}

        <input
          type="text"
          placeholder="City"
          value={filterCity}
          onChange={(e) =>
            onCityChange(
              e.target.value
            )
          }
          className="
            border
            rounded-xl
            px-4
            py-3
            text-sm
            w-full
          "
        />

        {/* STATUS */}

        <select
          value={filterStatus}
          onChange={(e) =>
            onStatusChange(
              e.target.value
            )
          }
          className="
            border
            rounded-xl
            px-4
            py-3
            text-sm
            w-full
          "
        >

          <option value="">
            All Status
          </option>

          <option value="New">
            New
          </option>

          <option value="Need Review">
            Need Review
          </option>

          <option value="Ready to Contact">
            Ready to Contact
          </option>

          <option value="No Response">
            No Response
          </option>

          <option value="Interested">
            Interested
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Invalid Number">
            Invalid Number
          </option>

          <option value="Converted">
            Converted
          </option>

        </select>

        {/* RESET */}

        <button
          onClick={onReset}
          className="
            border
            rounded-xl
            px-4
            py-3
            text-sm
            font-medium
            hover:bg-gray-100
            transition
          "
        >
          Reset Filter
        </button>

      </div>

      {loading && (

        <div
          className="
            text-xs
            text-gray-400
          "
        >
          Loading property types...
        </div>

      )}

    </div>
  );
}