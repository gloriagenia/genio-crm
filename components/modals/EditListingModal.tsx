"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "@/lib/supabase";

type EditListingModalProps = {
  open: boolean;

  data?: any;

  onClose: () => void;

  onSuccess?: () => void;
};

const initialForm = {

  property_id: "",

  platform_id: "",

  listing_code: "",

  listing_title: "",

  market_type: "Sale",

  listing_price: "",

  listing_status: "Draft",

  featured: false,

  publish_date: "",

  expire_date: "",

  last_refresh_at: "",

  listing_link: "",

  caption: "",

  description: "",

  commission_percent: "",

  exclusive_until: "",

  views_count: "0",

  leads_count: "0",
};

export default function EditListingModal({
  open,
  data,
  onClose,
  onSuccess,
}: EditListingModalProps) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<any>(initialForm);

  const [properties, setProperties] =
    useState<any[]>([]);

  const [platform, setPlatform] =
    useState<any[]>([]);

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
  // FETCH DATA
  // =========================

  async function fetchDropdownData() {

    const {
      data: propertyData,
    } = await supabase

      .from("properties")

      .select(`
        property_id,
        property_type,
        district,
        city
      `)

      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    const {
      data: platformData,
    } = await supabase

      .from("platform")

      .select("*")

      .order(
        "platform_name",
        {
          ascending: true,
        }
      );

    setProperties(
      propertyData || []
    );

    setPlatform(
      platformData || []
    );
  }

  // =========================
  // AUTO FILL
  // =========================

  useEffect(() => {

    if (open) {

      fetchDropdownData();

      if (data) {

        setFormData({

          property_id:
            data.property_id || "",

          platform_id:
            data.platform_id || "",

          listing_code:
            data.listing_code || "",

          listing_title:
            data.listing_title || "",

          market_type:
            data.market_type || "Sale",

          listing_price:
            data.listing_price
              ? formatNumber(
                  String(
                    data.listing_price
                  )
                )
              : "",

          listing_status:
            data.listing_status || "Draft",

          featured:
            data.featured || false,

          publish_date:
            data.publish_date || "",

          expire_date:
            data.expire_date || "",

          last_refresh_at:
            data.last_refresh_at || "",

          listing_link:
            data.listing_link || "",

          caption:
            data.caption || "",

          description:
            data.description || "",

          commission_percent:
            data.commission_percent || "",

          exclusive_until:
            data.exclusive_until || "",

          views_count:
            data.views_count || "0",

          leads_count:
            data.leads_count || "0",
        });

      } else {

        setFormData(initialForm);
      }
    }

  }, [open, data]);

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

    const {
      name,
      value,
      type,
    } = e.target;

    setFormData({

      ...formData,

      [name]:

        type === "checkbox"

          ? (
              e.target as HTMLInputElement
            ).checked

          : value,
    });
  }

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit() {

    try {

      setLoading(true);

      const payload = {

        property_id:
          formData.property_id || null,

        platform_id:
          formData.platform_id || null,

        listing_code:
          formData.listing_code || null,

        listing_title:
          formData.listing_title || null,

        market_type:
          formData.market_type || null,

        listing_price:
          formData.listing_price

            ? Number(
                unformatNumber(
                  formData.listing_price
                )
              )

            : null,

        listing_status:
          formData.listing_status || "Draft",

        featured:
          formData.featured || false,

        publish_date:
          formData.publish_date || null,

        expire_date:
          formData.expire_date || null,

        last_refresh_at:
          formData.last_refresh_at || null,

        listing_link:
          formData.listing_link || null,

        caption:
          formData.caption || null,

        description:
          formData.description || null,

        commission_percent:
          formData.commission_percent

            ? Number(
                formData.commission_percent
              )

            : null,

        exclusive_until:
          formData.exclusive_until || null,

        views_count:
          formData.views_count

            ? Number(
                formData.views_count
              )

            : 0,

        leads_count:
          formData.leads_count

            ? Number(
                formData.leads_count
              )

            : 0,
      };

      const {
        error,
      } = await supabase

        .from("listing")

        .update(payload)

        .eq(
          "listing_id",
          data.listing_id
        );

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Listing updated successfully"
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
          max-w-6xl
          p-6
          space-y-6
          max-h-[92vh]
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
            Edit Listing
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

        {/* GRID */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >

          <Select
            label="Property"
            name="property_id"
            value={formData.property_id}
            onChange={handleChange}
            options={
              properties.map(
                (item) => ({
                  value:
                    item.property_id,

                  label:
                    `${item.property_type} - ${item.district || "-"}`
                })
              )
            }
          />

          <Select
            label="Platform"
            name="platform_id"
            value={formData.platform_id}
            onChange={handleChange}
            options={
              platform.map(
                (item) => ({
                  value:
                    item.platform_id,

                  label:
                    item.platform_name
                })
              )
            }
          />

          <Input
            label="Listing Code"
            name="listing_code"
            value={formData.listing_code}
            onChange={handleChange}
          />

          <Input
            label="Listing Title"
            name="listing_title"
            value={formData.listing_title}
            onChange={handleChange}
          />

          <Select
            label="Market Type"
            name="market_type"
            value={formData.market_type}
            onChange={handleChange}
            options={[
              {
                value: "Sale",
                label: "Sale",
              },
              {
                value: "Rent",
                label: "Rent",
              },
              {
                value: "Sale & Rent",
                label: "Sale & Rent",
              },
            ]}
          />

          <PriceInput
            value={formData.listing_price}
            formData={formData}
            setFormData={setFormData}
            formatNumber={formatNumber}
          />

          <Select
            label="Listing Status"
            name="listing_status"
            value={formData.listing_status}
            onChange={handleChange}
            options={[
              {
                value: "Draft",
                label: "Draft",
              },
              {
                value: "Published",
                label: "Published",
              },
              {
                value: "Featured",
                label: "Featured",
              },
              {
                value: "Pending",
                label: "Pending",
              },
              {
                value: "Sold",
                label: "Sold",
              },
              {
                value: "Rented",
                label: "Rented",
              },
              {
                value: "Expired",
                label: "Expired",
              },
              {
                value: "Archived",
                label: "Archived",
              },
            ]}
          />

          {/* FEATURED */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Featured
            </label>

            <label
              className="
                flex
                items-center
                gap-3
                h-[52px]
              "
            >

              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />

              <span className="text-sm">
                Featured Listing
              </span>

            </label>

          </div>

          <Input
            label="Publish Date"
            type="date"
            name="publish_date"
            value={formData.publish_date}
            onChange={handleChange}
          />

          <Input
            label="Expire Date"
            type="date"
            name="expire_date"
            value={formData.expire_date}
            onChange={handleChange}
          />

          <Input
            label="Last Refresh"
            type="date"
            name="last_refresh_at"
            value={formData.last_refresh_at}
            onChange={handleChange}
          />

          <Input
            label="Commission %"
            name="commission_percent"
            value={formData.commission_percent}
            onChange={handleChange}
          />

          <Input
            label="Exclusive Until"
            type="date"
            name="exclusive_until"
            value={formData.exclusive_until}
            onChange={handleChange}
          />

          <Input
            label="Views Count"
            name="views_count"
            value={formData.views_count}
            onChange={handleChange}
          />

          <Input
            label="Leads Count"
            name="leads_count"
            value={formData.leads_count}
            onChange={handleChange}
          />

        </div>

        {/* FULL WIDTH */}

        <Input
          label="Listing Link"
          name="listing_link"
          value={formData.listing_link}
          onChange={handleChange}
        />

        <Textarea
          label="Caption"
          name="caption"
          value={formData.caption}
          onChange={handleChange}
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
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
              : "Update Listing"}

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

        <option value="">
          Select
        </option>

        {options.map(
          (item: any) => (

            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          )
        )}

      </select>

    </div>
  );
}

function PriceInput({
  value,
  formData,
  setFormData,
  formatNumber,
}: any) {

  return (

    <div className="space-y-2">

      <label className="text-sm font-medium">
        Listing Price
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
          value={value}
          onChange={(e) => {

            setFormData({

              ...formData,

              listing_price:
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

    </div>
  );
}