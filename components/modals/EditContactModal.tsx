"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type EditContactModalProps = {
  open: boolean;

  data?: any;

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

export default function EditContactModal({
  open,
  data,
  onClose,
  onSuccess,
}: EditContactModalProps) {

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

      last_followup_at: "",

      next_followup_at: "",
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
  // AUTO FILL
  // =========================

  useEffect(() => {

    if (data) {

      setFormData({

        name:
          data.name || "",

        phone:
          data.phone || "",

        email:
          data.email || "",

        company:
          data.company || "",

        role:
          data.role || "",

        contact_type:
          data.contact_type || "",

        contact_address:
          data.contact_address || "",

        source_id:
          data.source_id || "",

        priority:
          data.priority || "WARM",

        status:
          data.status || "New",

        tags:
          data.tags || "",

        summary:
          data.summary || "",

        notes:
          data.notes || "",

        last_followup_at:
          data.last_followup_at
            ? new Date(
                data.last_followup_at
              )
                .toISOString()
                .slice(0, 16)
            : "",

        next_followup_at:
  data.next_followup_at &&
  !isNaN(
    new Date(
      data.next_followup_at
    ).getTime()
  )
    ? new Date(
        data.next_followup_at
      )
        .toISOString()
        .slice(0, 16)
    : "",
      });
    }

  }, [data]);

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
        data: duplicatePhone,
      } = await supabase

        .from("contacts")

        .select(`
          contact_id
        `)

        .eq(
          "phone",
          formData.phone
        )

        .neq(
          "contact_id",
          data.contact_id
        )

        .maybeSingle();

      if (
        duplicatePhone
      ) {

        alert(
          "Phone number already exists"
        );

        return;
      }

      // =========================
      // UPDATE CONTACT
      // =========================

      const {
        error,
      } = await supabase

        .from("contacts")

        .update({

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

          last_followup_at:
            formData.last_followup_at ||

            null,

          next_followup_at:
            formData.next_followup_at ||

            null,

          updated_at:
            new Date(),
        })

        .eq(
          "contact_id",
          data.contact_id
        );

      if (error) {

        console.log(error);

        alert(
          "Failed update contact"
        );

        return;
      }

      // =========================
      // CREATE ACTIVITY
      // =========================

      await supabase

        .from("activities")

        .insert([{

          contact_id:
            data.contact_id,

          activity_type:
            "CONTACT_UPDATED",

          title:
            "Contact Updated",

          notes:
            "Contact information updated.",

          activity_date:
            new Date(),
        }]);

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Contact updated"
      );

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
            Edit Contact
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
          />

          {/* LAST FOLLOWUP */}

          <InputField
            label="Last Followup"
            name="last_followup_at"
            type="datetime-local"
            value={
              formData.last_followup_at
            }
            onChange={
              handleChange
            }
          />

          {/* NEXT FOLLOWUP */}

          <InputField
            label="Next Followup"
            name="next_followup_at"
            type="datetime-local"
            value={
              formData.next_followup_at
            }
            onChange={
              handleChange
            }
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
              : "Update Contact"}
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
  type = "text",
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
        type={type}
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