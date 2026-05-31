"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type ContactModalProps = {
  open: boolean;

  data?: any;

  onClose: () => void;

  onSuccess?: () => void;
};

const initialForm = {
  name: "",

  phone: "",

  email: "",

  contact_type: "",

  company: "",

  notes: "",

  contact_address: "",
};

export default function ContactModal({
  open,
  data,
  onClose,
  onSuccess,
}: ContactModalProps) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  const isEditMode = !!data;

  useEffect(() => {

    if (data) {

      setFormData({
        name:
          data.name || "",

        phone:
          data.phone || "",

        email:
          data.email || "",

        contact_type:
          data.contact_type || "",

        company:
          data.company || "",

        notes:
          data.notes || "",

        contact_address:
          data.contact_address || "",
      });

    } else {

      setFormData(initialForm);

    }

  }, [data, open]);

  if (!open) return null;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });

  }

  async function handleSubmit() {

    try {

      setLoading(true);

      if (isEditMode) {

        const { error } =
          await supabase

            .from("contacts")

            .update({
              ...formData,
            })

            .eq(
              "contact_id",
              data.contact_id
            );

        if (error) {

          console.log(error);

          return;
        }

      } else {

        const { error } =
          await supabase

            .from("contacts")

            .insert([
              {
                ...formData,
              },
            ]);

        if (error) {

          console.log(error);

          return;
        }
      }

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
        p-4
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

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            {isEditMode
              ? "Edit Contact"
              : "Add Contact"}
          </h2>

          <button
            onClick={onClose}

            className="
              text-2xl
            "
          >
            ✕
          </button>

        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >

          <div>
            <label>
              Name
            </label>

            <input
              name="name"

              value={
                formData.name
              }

              onChange={
                handleChange
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
              "
            />
          </div>

          <div>
            <label>
              Phone
            </label>

            <input
              name="phone"

              value={
                formData.phone
              }

              onChange={
                handleChange
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
              "
            />
          </div>

          <div>
            <label>
              Email
            </label>

            <input
              name="email"

              value={
                formData.email
              }

              onChange={
                handleChange
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
              "
            />
          </div>

          <div>
            <label>
              Contact Type
            </label>

            <input
              name="
                contact_type
              "

              value={
                formData.contact_type
              }

              onChange={
                handleChange
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
              "
            />
          </div>

          <div>
            <label>
              Company
            </label>

            <input
              name="company"

              value={
                formData.company
              }

              onChange={
                handleChange
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
              "
            />
          </div>

        </div>

        <div>
          <label>
            Address
          </label>

          <textarea
            name="
              contact_address
            "

            value={
              formData.contact_address
            }

            onChange={
              handleChange
            }

            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              min-h-[100px]
            "
          />
        </div>

        <div>
          <label>
            Notes
          </label>

          <textarea
            name="notes"

            value={
              formData.notes
            }

            onChange={
              handleChange
            }

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

        <div
          className="
            flex
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
            onClick={
              handleSubmit
            }

            disabled={loading}

            className="
              bg-black
              text-white
              rounded-xl
              px-5
              py-2
            "
          >

            {loading
              ? "Saving..."
              : isEditMode
              ? "Update"
              : "Save"}

          </button>

        </div>

      </div>

    </div>
  );
}