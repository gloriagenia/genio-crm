"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type AddContactModalProps = {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void;
};

// =========================
// CONSTANTS
// =========================

const CONTACT_STATUS = [
  "New",
  "Contacted",
  "Active",
  "Inactive",
  "Closed",
];

const CONTACT_PRIORITY = [
  "HOT",
  "WARM",
  "COLD",
];

export default function AddContactModal({
  open,
  onClose,
  onSuccess,
}: AddContactModalProps) {

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [sources, setSources] =
    useState<any[]>([]);

  // =========================
  // FORM
  // =========================

  const [formData, setFormData] =
    useState({

      name: "",

      phone: "",

      email: "",

      company: "",

      role: "",

      contact_type: "",

      contact_address: "",

      source_id: "",

      priority: "WARM",

      status: "New",

      tags: "",

      summary: "",

      notes: "",
    });

  // =========================
  // FETCH SOURCES
  // =========================

  async function fetchSources() {

    try {

      const {
        data,
        error,
      } = await supabase

        .from("sources")

        .select(`
          source_id,
          source_name
        `)

        .order(
          "source_name"
        );

      if (error) {

        console.log(error);

        return;
      }

      setSources(data || []);

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // INITIAL
  // =========================

  useEffect(() => {

    if (open) {

      fetchSources();
    }

  }, [open]);

  // =========================
  // CHANGE
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
  // RESET
  // =========================

  function handleReset() {

    setFormData({

      name: "",

      phone: "",

      email: "",

      company: "",

      role: "",

      contact_type: "",

      contact_address: "",

      source_id: "",

      priority: "WARM",

      status: "New",

      tags: "",

      summary: "",

      notes: "",
    });
  }

  // =========================
  // SAVE
  // =========================

  async function handleSave() {

    try {

      setLoading(true);

      // =========================
      // VALIDATION
      // =========================

      if (
        !formData.name
      ) {

        alert(
          "Name is required"
        );

        return;
      }

      if (
        !formData.phone
      ) {

        alert(
          "Phone is required"
        );

        return;
      }

      // =========================
      // CHECK DUPLICATE PHONE
      // =========================

      const {
        data: existingContact,
      } = await supabase

        .from("contacts")

        .select(`
          contact_id
        `)

        .eq(
          "phone",
          formData.phone
        )

        .maybeSingle();

      if (
        existingContact
      ) {

        alert(
          "Phone number already exists"
        );

        return;
      }

      // =========================
      // INSERT
      // =========================

      const {
        error,
      } = await supabase

        .from("contacts")

        .insert([{

          name:
            formData.name ||

            null,

          phone:
            formData.phone ||

            null,

          email:
            formData.email ||

            null,

          company:
            formData.company ||

            null,

          role:
            formData.role ||

            null,

          contact_type:
            formData.contact_type ||

            null,

          contact_address:
            formData.contact_address ||

            null,

          source_id:
            formData.source_id ||

            null,

          priority:
            formData.priority ||

            "WARM",

          status:
            formData.status ||

            "New",

          tags:
            formData.tags ||

            null,

          summary:
            formData.summary ||

            null,

          notes:
            formData.notes ||

            null,

          created_at:
            new Date(),

          updated_at:
            new Date(),

          last_followup_at:
            null,

          next_followup_at:
            null,
        }]);

      if (error) {

        console.log(error);

        alert(
          JSON.stringify(
            error, null, 2
          )
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Contact created"
      );

      handleReset();

      onSuccess();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // CLOSE
  // =========================

  function handleClose() {

    handleReset();

    onClose();
  }

  // =========================
  // HIDE
  // =========================

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          p-6
          space-y-6
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
            Add Contact
          </h2>

          <button
            onClick={
              handleClose
            }
            className="
              text-gray-500
              hover:text-black
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

          {/* NAME */}

          <InputField
            label="Name"
            name="name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            placeholder="Contact name"
          />

          {/* PHONE */}

          <InputField
            label="Phone"
            name="phone"
            value={
              formData.phone
            }
            onChange={
              handleChange
            }
            placeholder="08123456789"
          />

          {/* EMAIL */}

          <InputField
            label="Email"
            name="email"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            placeholder="email@gmail.com"
          />

          {/* COMPANY */}

          <InputField
            label="Company"
            name="company"
            value={
              formData.company
            }
            onChange={
              handleChange
            }
            placeholder="Company"
          />

          {/* ROLE */}

          <InputField
            label="Role"
            name="role"
            value={
              formData.role
            }
            onChange={
              handleChange
            }
            placeholder="Director / PIC"
          />

          {/* CONTACT TYPE */}

          <InputField
            label="Contact Type"
            name="contact_type"
            value={
              formData.contact_type
            }
            onChange={
              handleChange
            }
            placeholder="Buyer / Vendor / Investor"
          />

          {/* PRIORITY */}

          <SelectField
            label="Priority"
            name="priority"
            value={
              formData.priority
            }
            onChange={
              handleChange
            }
            options={
              CONTACT_PRIORITY
            }
          />

          {/* STATUS */}

          <SelectField
            label="Status"
            name="status"
            value={
              formData.status
            }
            onChange={
              handleChange
            }
            options={
              CONTACT_STATUS
            }
          />

          {/* SOURCE */}

          <div className="space-y-2">

            <label
              className="
                text-sm
                font-medium
              "
            >
              Source
            </label>

            <select
              name="source_id"
              value={
                formData.source_id
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
            >

              <option value="">
                Select Source
              </option>

              {sources.map(
                (item) => (

                  <option
                    key={
                      item.source_id
                    }
                    value={
                      item.source_id
                    }
                  >
                    {
                      item.source_name
                    }
                  </option>
                )
              )}

            </select>

          </div>

          {/* TAGS */}

          <InputField
            label="Tags"
            name="tags"
            value={
              formData.tags
            }
            onChange={
              handleChange
            }
            placeholder="Luxury, Investor, Hot Lead"
          />

          {/* ADDRESS */}

          <div className="md:col-span-2">

            <InputField
              label="Address"
              name="contact_address"
              value={
                formData.contact_address
              }
              onChange={
                handleChange
              }
              placeholder="Address"
            />

          </div>

          {/* SUMMARY */}

          <div className="md:col-span-2">

            <TextareaField
              label="Summary"
              name="summary"
              value={
                formData.summary
              }
              onChange={
                handleChange
              }
              placeholder="Quick operational summary..."
            />

          </div>

          {/* NOTES */}

          <div className="md:col-span-2">

            <TextareaField
              label="Notes"
              name="notes"
              value={
                formData.notes
              }
              onChange={
                handleChange
              }
              placeholder="Additional notes..."
            />

          </div>

        </div>

        {/* FOOTER */}

        <div
          className="
            flex
            justify-end
            gap-3
          "
        >

          <button
            onClick={
              handleClose
            }
            className="
              border
              rounded-xl
              px-5
              py-3
            "
          >
            Cancel
          </button>

          <button
            onClick={
              handleSave
            }
            disabled={loading}
            className="
              bg-black
              text-white
              rounded-xl
              px-5
              py-3
              disabled:opacity-50
            "
          >
            {loading
              ? "Saving..."
              : "Save Contact"}
          </button>

        </div>

      </div>

    </div>
  );
}

// =========================
// INPUT FIELD
// =========================

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
}: any) {

  return (

    <div className="space-y-2">

      <label
        className="
          text-sm
          font-medium
        "
      >
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "
      />

    </div>
  );
}

// =========================
// TEXTAREA FIELD
// =========================

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
}: any) {

  return (

    <div className="space-y-2">

      <label
        className="
          text-sm
          font-medium
        "
      >
        {label}
      </label>

      <textarea
        rows={5}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "
      />

    </div>
  );
}

// =========================
// SELECT FIELD
// =========================

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: any) {

  return (

    <div className="space-y-2">

      <label
        className="
          text-sm
          font-medium
        "
      >
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "
      >

        {options.map(
          (
            item: string
          ) => (

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