"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import { normalizePhone }
from "@/src/utils/normalizePhone";

import { normalizeText }
from "@/src/utils/normalizeText";

type CanvassingModalProps = {
  open: boolean;

  data?: any;

  onClose: () => void;

  onSuccess?: () => void;
};

const initialForm = {

  canvassing_date: "",

  property_type: "",

  property_type_id: "",

  name: "",

  phone: "",

  district: "",

  city: "",

  land_size: "",

  building_size: "",

  latitude: "",

  longitude: "",

  street: "",

  address: "",

  photo_url: "",

  notes: "",

  status: "New",
};

export default function CanvassingModal({
  open,
  data,
  onClose,
  onSuccess,
}: CanvassingModalProps) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<any>(initialForm);

  const isEditMode = !!data;

  // =========================
  // FORMAT NUMBER
  // =========================

  function formatNumber(
    value: string
  ) {

    const number =
      value.replace(/\D/g, "");

    if (!number) return "";

    return new Intl.NumberFormat(
      "id-ID"
    ).format(Number(number));
  }

  function unformatNumber(
    value: string
  ) {

    return value.replace(/\./g, "");
  }

  // =========================
  // AUTO FILL
  // =========================

  useEffect(() => {

    if (data) {

      setFormData({

        canvassing_date:
          data.canvassing_date || "",

        property_type:
          data.property_type || "",

        property_type_id:
          data.property_type_id || "",

        name:
          data.name || "",

        phone:
          data.phone || "",

        district:
          data.district || "",

        city:
          data.city || "",

        land_size:
          data.land_size
            ? formatNumber(
                String(data.land_size)
              )
            : "",

        building_size:
          data.building_size
            ? formatNumber(
                String(
                  data.building_size
                )
              )
            : "",

        latitude:
          data.latitude || "",

        longitude:
          data.longitude || "",

        street:
          data.street || "",

        address:
          data.address || "",

        photo_url:
          data.photo_url || "",

        notes:
          data.notes || "",

        status:
          data.status || "New",
      });

    } else {

      setFormData(initialForm);
    }

  }, [data, open]);

  if (!open) return null;

  // =========================
  // HANDLE CHANGE
  // =========================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  }

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit() {

    try {

      setLoading(true);

      // =========================
      // NORMALIZE PHONE
      // =========================

      const normalizedPhone =
        normalizePhone(
          formData.phone
        );

      // =========================
      // PROPERTY TYPE
      // =========================

      let propertyTypeId =
        null;

      if (formData.property_type) {

        const normalizedName =
          normalizeText(
            formData.property_type
          );

        const {
          data: propertyTypes,
        } = await supabase

          .from("property_type")

          .select("*");

        const existingType =
          propertyTypes?.find(
            (item: any) =>

              normalizeText(
                item.property_type_name
              ) === normalizedName
          );

        // =========================
        // EXISTING
        // =========================

        if (existingType) {

          propertyTypeId =
            existingType.property_type_id;
        }

        // =========================
        // CREATE NEW
        // =========================

        else {

          const {
            data: newType,
            error: newTypeError,
          } = await supabase

            .from("property_type")

            .insert([
              {
                property_type_name:
                  formData.property_type.trim(),
              },
            ])

            .select()

            .single();

          if (newTypeError) {

            console.log(
              newTypeError
            );

            alert(
              "Failed create property type"
            );

            return;
          }

          propertyTypeId =
            newType.property_type_id;
        }
      }

      // =========================
      // PAYLOAD
      // =========================

      const payload = {

        canvassing_date:
          formData.canvassing_date || null,

        property_type:
          formData.property_type || null,

        property_type_id:
          propertyTypeId,

        name:
          formData.name || null,

        phone:
          normalizedPhone || null,

        district:
          formData.district || null,

        city:
          formData.city || null,

        land_size:
          formData.land_size
            ? Number(
                unformatNumber(
                  formData.land_size
                )
              )
            : null,

        building_size:
          formData.building_size
            ? Number(
                unformatNumber(
                  formData.building_size
                )
              )
            : null,

        latitude:
          formData.latitude || null,

        longitude:
          formData.longitude || null,

        street:
          formData.street || null,

        address:
          formData.address || null,

        photo_url:
          formData.photo_url || null,

        notes:
          formData.notes || null,

        status:
          formData.status || "New",
      };

      // =========================
      // UPDATE
      // =========================

      if (isEditMode) {

        const { error } =
          await supabase

            .from("canvassing")

            .update(payload)

            .eq(
              "canvassing_id",
              data.canvassing_id
            );

        if (error) {

          console.log(error);

          alert(error.message);

          return;
        }
      }

      // =========================
      // INSERT
      // =========================

      else {

        const { error } =
          await supabase

            .from("canvassing")

            .insert([payload]);

        if (error) {

          console.log(error);

          alert(error.message);

          return;
        }
      }

      alert(
        isEditMode
          ? "Canvassing updated successfully"
          : "Canvassing saved successfully"
      );

      setFormData(initialForm);

      onSuccess?.();

      onClose();

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-5xl
          p-6
          space-y-6
          max-h-[90vh]
          overflow-y-auto
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-2xl
              font-bold
            "
          >

            {isEditMode
              ? "Edit Canvassing"
              : "Add Canvassing"}

          </h2>

          <button
            onClick={onClose}
            className="
              text-2xl
              cursor-pointer
            "
          >
            ✕
          </button>

        </div>

        {/* FORM */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >

          {/* ROW 1 */}

          <Input
            label="Canvassing Date"
            name="canvassing_date"
            type="date"
            value={formData.canvassing_date}
            onChange={handleChange}
          />

          <Input
            label="Property Type"
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
          />

          {/* ROW 2 */}

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* ROW 3 */}

          <Input
            label="District"
            name="district"
            value={formData.district}
            onChange={handleChange}
          />

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />

          {/* ROW 4 */}

          <NumberInput
            label="Land Size"
            name="land_size"
            value={formData.land_size}
            formData={formData}
            setFormData={setFormData}
            formatNumber={formatNumber}
          />

          <NumberInput
            label="Building Size"
            name="building_size"
            value={formData.building_size}
            formData={formData}
            setFormData={setFormData}
            formatNumber={formatNumber}
          />

          {/* ROW 5 */}

          <Input
            label="Latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />

          <Input
            label="Longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />

          {/* ROW 6 */}

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              "New",
              "Need Review",
              "Ready to Contact",
              "No Response",
              "Interested",
              "Rejected",
              "Invalid Number",
            ]}
          />

          <Input
            label="Photo URL"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
          />

        </div>

        {/* FULL WIDTH */}

        <Textarea
          label="Street"
          name="street"
          value={formData.street}
          onChange={handleChange}
        />

        <Textarea
          label="Full Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />

        {/* ACTION */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
          "
        >

          <button
            onClick={onClose}
            className="
              border
              rounded-xl
              px-4
              py-2
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              bg-black
              text-white
              rounded-xl
              px-5
              py-2
              disabled:opacity-50
            "
          >

            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Canvassing"
              : "Save Canvassing"}

          </button>

        </div>

      </div>

    </div>
  );
}

// =========================
// REUSABLE COMPONENTS
// =========================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: any) {

  return (

    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="
          border
          rounded-xl
          px-4
          py-3
          w-full
        "
      />

    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
}: any) {

  return (

    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          min-h-[120px]
        "
      />

    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: any) {

  return (

    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          border
          rounded-xl
          px-4
          py-3
          w-full
        "
      >

        {options.map(
          (item: string) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          )
        )}

      </select>

    </div>
  );
}

function NumberInput({
  label,
  name,
  value,
  formData,
  setFormData,
  formatNumber,
}: any) {

  return (

    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <div className="relative">

        <input
          name={name}
          value={value}
          onChange={(e) => {

            setFormData({

              ...formData,

              [name]:
                formatNumber(
                  e.target.value
                ),
            });
          }}
          className="
            border
            rounded-xl
            px-4
            pr-14
            py-3
            w-full
          "
        />

        <div
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-500
          "
        >
          m²
        </div>

      </div>

    </div>
  );
}