"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type LeadModalProps = {
  open: boolean;

  data?: any;

  contacts: any[];

  leadStatuses: any[];

  sources: any[];

  onClose: () => void;

  onSuccess?: () => void;
};

const initialForm = {

  contact_id: "",

  requirements: "",

  lead_status_id: "",

  budget_min: "",

  budget_max: "",

  source_id: "",

  priority: "",

  next_followup: "",
};

export default function LeadModal({
  open,
  data,
  contacts,
  leadStatuses,
  sources,
  onClose,
  onSuccess,
}: LeadModalProps) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  const isEditMode = !!data;

  useEffect(() => {

    if (data) {

      setFormData({

        contact_id:
          data.contact_id || "",

        requirements:
          data.requirements || "",

        lead_status_id:
          data.lead_status_id || "",

        budget_min:
          data.budget_min || "",

        budget_max:
          data.budget_max || "",

        source_id:
          data.source_id || "",

        priority:
          data.priority || "",

        next_followup:
          data.next_followup
            ?.split("T")[0] || "",
      });

    } else {

      setFormData(initialForm);

    }

  }, [data, open]);

  if (!open) return null;

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
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

            .from("leads")

            .update({
              ...formData,
            })

            .eq(
              "leads_id",
              data.leads_id
            );

        if (error) {

          console.log(error);

          return;
        }

      } else {

        const { error } =
          await supabase

            .from("leads")

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
          max-w-4xl
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
              ? "Edit Lead"
              : "Add Lead"}
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
              Contact
            </label>

            <select
              name="contact_id"

              value={
                formData.contact_id
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
                Select Contact
              </option>

              {contacts.map(
                (contact) => (

                  <option
                    key={
                      contact.contact_id
                    }

                    value={
                      contact.contact_id
                    }
                  >
                    {contact.name}
                  </option>

                )
              )}

            </select>
          </div>

          <div>
            <label>
              Priority
            </label>

            <select
              name="priority"

              value={
                formData.priority
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
                Select Priority
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Urgent">
                Urgent
              </option>

            </select>
          </div>

          <div>
            <label>
              Budget Min
            </label>

            <input
              type="number"

              name="budget_min"

              value={
                formData.budget_min
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
              Budget Max
            </label>

            <input
              type="number"

              name="budget_max"

              value={
                formData.budget_max
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
              Lead Status
            </label>

            <select
              name="
                lead_status_id
              "

              value={
                formData.lead_status_id
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
                Select Status
              </option>

              {leadStatuses.map(
                (status) => (

                  <option
                    key={
                      status.lead_status_id
                    }

                    value={
                      status.lead_status_id
                    }
                  >
                    {status.name}
                  </option>

                )
              )}

            </select>
          </div>

          <div>
            <label>
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
                (source) => (

                  <option
                    key={
                      source.source_id
                    }

                    value={
                      source.source_id
                    }
                  >
                    {source.name}
                  </option>

                )
              )}

            </select>
          </div>

          <div className="col-span-2">
            <label>
              Next Follow Up
            </label>

            <input
              type="date"

              name="
                next_followup
              "

              value={
                formData.next_followup
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
            Requirements
          </label>

          <textarea
            name="
              requirements
            "

            value={
              formData.requirements
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
              min-h-[140px]
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