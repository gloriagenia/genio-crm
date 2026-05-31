"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "@/lib/supabase";

import { normalizePhone }
from "@/src/utils/normalizePhone";

type EditPropertyModalProps = {
  open: boolean;

  data?: any;

  onClose: () => void;

  onSuccess?: () => void;
};

const initialForm = {

  property_type: "",

  property_type_id: "",

  market_type: "Sale",

  status: "Draft",

  contact_name: "",

  phone: "",

  district: "",

  city: "",

  certificate: "",

  price: "",

  land_size: "",

  building_size: "",

  bedroom: "",

  bathroom: "",

  latitude: "",

  longitude: "",

  address: "",

  gps_address: "",

  photo_url: "",

  notes: "",
};

export default function EditPropertyModal({
  open,
  data,
  onClose,
  onSuccess,
}: EditPropertyModalProps) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<any>(initialForm);

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
  // FORMAT PRICE SHORT
  // =========================

  function formatPriceShort(
    value: string
  ) {

    const number =
      Number(
        unformatNumber(value)
      );

    if (!number) return "";

    if (
      number >=
      1_000_000_000_000
    ) {

      return `≈ ${(
        number /
        1_000_000_000_000
      ).toFixed(1)} T`;
    }

    if (
      number >=
      1_000_000_000
    ) {

      return `≈ ${(
        number /
        1_000_000_000
      ).toFixed(1)} M`;
    }

    if (
      number >=
      1_000_000
    ) {

      return `≈ ${(
        number /
        1_000_000
      ).toFixed(1)} Jt`;
    }

    return "";
  }

  // =========================
  // AUTO FILL
  // =========================

  useEffect(() => {

    if (data) {

      setFormData({

        property_type:
          data.property_type || "",

        property_type_id:
          data.property_type_id || "",

        market_type:
          data.market_type || "Sale",

        status:
          data.status || "Draft",

        contact_name:
          data.contact_name || "",

        phone:
          data.phone || "",

        district:
          data.district || "",

        city:
          data.city || "",

        certificate:
          data.certificate || "",

        price:
          data.price
            ? formatNumber(
                String(data.price)
              )
            : "",

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

        bedroom:
          data.bedroom || "",

        bathroom:
          data.bathroom || "",

        latitude:
          data.latitude || "",

        longitude:
          data.longitude || "",

        address:
          data.address || "",

        gps_address:
          data.gps_address || "",

        photo_url:
          data.photo_url || "",

        notes:
          data.notes || "",
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
      // UPDATE CONTACT
      // =========================

      if (
        data?.contact_id
      ) {

        await supabase

          .from("contacts")

          .update({

            name:
              formData.contact_name || null,

            phone:
              normalizedPhone || null,
          })

          .eq(
            "contact_id",
            data.contact_id
          );
      }

      // =========================
      // PAYLOAD
      // =========================

      const payload = {

        property_type:
          formData.property_type || null,

        property_type_id:
          formData.property_type_id || null,

        market_type:
          formData.market_type || null,

        status:
          formData.status || "Draft",

        contact_name:
          formData.contact_name || null,

        phone:
          normalizedPhone || null,

        district:
          formData.district || null,

        city:
          formData.city || null,

        certificate:
          formData.certificate || null,

        price:
          formData.price
            ? Number(
                unformatNumber(
                  formData.price
                )
              )
            : null,

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

        bedroom:
          formData.bedroom
            ? Number(
                formData.bedroom
              )
            : null,

        bathroom:
          formData.bathroom
            ? Number(
                formData.bathroom
              )
            : null,

        latitude:
          formData.latitude
            ? parseFloat(
                formData.latitude
              )
            : null,

        longitude:
          formData.longitude
            ? parseFloat(
                formData.longitude
              )
            : null,

        address:
          formData.address || null,

        gps_address:
          formData.gps_address || null,

        photo_url:
          formData.photo_url || null,

        notes:
          formData.notes || null,
      };

      // =========================
      // UPDATE PROPERTY
      // =========================

      const {
        error,
      } = await supabase

        .from("properties")

        .update(payload)

        .eq(
          "property_id",
          data.property_id
        );

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Property updated successfully"
      );

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
            Edit Property
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

          <Input
            label="Property Type"
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
          />

          <Select
            label="Market Type"
            name="market_type"
            value={formData.market_type}
            onChange={handleChange}
            options={[
              "Sale",
              "Rent",
              "Sale & Rent",
            ]}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              "Draft",
              "Active",
              "Exclusive",
              "Pending",
              "Sold",
              "Rented",
              "Hold",
              "Inactive",
            ]}
          />

          <Input
            label="Contact Name"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

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

          <Input
            label="Certificate"
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
          />

          <PriceInput
            value={formData.price}
            formData={formData}
            setFormData={setFormData}
            formatNumber={formatNumber}
            formatPriceShort={formatPriceShort}
          />

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

          <Input
            label="Bedroom"
            name="bedroom"
            type="number"
            value={formData.bedroom}
            onChange={handleChange}
          />

          <Input
            label="Bathroom"
            name="bathroom"
            type="number"
            value={formData.bathroom}
            onChange={handleChange}
          />

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

        </div>

        <Textarea
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <Textarea
          label="GPS Address"
          name="gps_address"
          value={formData.gps_address}
          onChange={handleChange}
        />

        <Input
          label="Photo URL"
          name="photo_url"
          value={formData.photo_url}
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
              ? "Updating..."
              : "Update Property"}

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

function PriceInput({
  value,
  formData,
  setFormData,
  formatNumber,
  formatPriceShort,
}: any) {

  return (

    <div className="space-y-2">

      <label className="text-sm font-medium">
        Price
      </label>

      <div className="relative">

        <div
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-500
          "
        >
          Rp
        </div>

        <input
          name="price"
          value={value}
          onChange={(e) => {

            setFormData({

              ...formData,

              price:
                formatNumber(
                  e.target.value
                ),
            });
          }}
          className="
            border
            rounded-xl
            pl-12
            pr-4
            py-3
            w-full
          "
        />

      </div>

      <p className="text-xs text-gray-500">
        {
          formatPriceShort(
            value
          )
        }
      </p>

    </div>
  );
}