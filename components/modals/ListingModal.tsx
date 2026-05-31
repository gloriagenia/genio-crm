"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

type ListingModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ListingModal({
  open,
  onClose,
  onSuccess,
}: ListingModalProps) {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      property_id: "",
      listing_code: "",
      listing_title: "",
      listing_price: "",
      listing_type_id: "",
      listing_status_id: "",
      platform_id: "",
      listing_link: "",
      commission_scheme: "",
    });

  if (!open) return null;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("listing")
        .insert([
          {
            property_id: Number(
              formData.property_id
            ),

            listing_code:
              formData.listing_code,

            listing_title:
              formData.listing_title,

            listing_price: Number(
              formData.listing_price
            ),

            listing_type_id: Number(
              formData.listing_type_id
            ),

            listing_status_id: Number(
              formData.listing_status_id
            ),

            platform_id: Number(
              formData.platform_id
            ),

            listing_link:
              formData.listing_link,

            commission_scheme:
              formData.commission_scheme,
          },
        ]);

      if (error) {
        console.log(error);
        return;
      }

      setFormData({
        property_id: "",
        listing_code: "",
        listing_title: "",
        listing_price: "",
        listing_type_id: "",
        listing_status_id: "",
        platform_id: "",
        listing_link: "",
        commission_scheme: "",
      });

      onSuccess?.();

      onClose();

    } catch (error) {
      console.log(error);
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
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-3xl
          p-6
          space-y-5
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <h2 className="text-xl font-bold">
            Add Listing
          </h2>

          <button
            onClick={onClose}
            className="cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <input
            name="property_id"
            placeholder="Property ID"
            value={formData.property_id}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            name="listing_code"
            placeholder="Listing Code"
            value={formData.listing_code}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            name="listing_title"
            placeholder="Listing Title"
            value={formData.listing_title}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            name="listing_price"
            placeholder="Listing Price"
            value={formData.listing_price}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            name="listing_type_id"
            placeholder="Listing Type ID"
            value={formData.listing_type_id}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            name="listing_status_id"
            placeholder="Listing Status ID"
            value={formData.listing_status_id}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            name="platform_id"
            placeholder="Platform ID"
            value={formData.platform_id}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            name="commission_scheme"
            placeholder="Commission Scheme"
            value={formData.commission_scheme}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

        </div>

        <input
          name="listing_link"
          placeholder="Listing Link"
          value={formData.listing_link}
          onChange={handleChange}
          className="
            w-full
            border
            rounded-xl
            px-4
            py-3
          "
        />

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
              px-4
              py-2
              disabled:opacity-50
            "
          >
            {loading
              ? "Saving..."
              : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
}