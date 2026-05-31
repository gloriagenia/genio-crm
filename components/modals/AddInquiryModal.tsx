"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type AddInquiryModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contact?: any;
};

export default function AddInquiryModal({
  open,
  onClose,
  onSuccess,
  contact,
}: AddInquiryModalProps) {

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [leads, setLeads] =
    useState<any[]>([]);

  const [sources, setSources] =
    useState<any[]>([]);

  const [statuses, setStatuses] =
    useState<any[]>([]);

  const [
    propertyTypes,
    setPropertyTypes,
  ] = useState<any[]>([]);

  // =========================
  // FORM DATA
  // =========================

  const [
    formData,
    setFormData,
  ] = useState({

    contact_id: "",

    lead_id: "",

    source_id: "",

    inquiry_status_id: "",

    inquiry_category: "Buy",

    property_type_id: "",

    market_type: "Sale",

    requirement_summary: "",

    district: "",

    city: "",

    budget_min: "",

    budget_max: "",

    next_action: "",

    last_followup: "",

    next_followup_at: "",

    priority: "WARM",

    notes: "",
  });

  // =========================
  // FORMAT RUPIAH
  // =========================

  function formatRupiah(
    value: string
  ) {

    if (!value) return "";

    return new Intl.NumberFormat(
      "id-ID"
    ).format(
      Number(value)
    );
  }

  // =========================
  // FETCH DROPDOWNS
  // =========================

  async function fetchDropdowns() {

    try {

      setLoading(true);

      const [

        leadsRes,

        sourcesRes,

        statusesRes,

        propertyTypesRes,

      ] = await Promise.all([

        supabase

          .from("leads")

          .select(`
            leads_id,
            contacts (
              name,
              phone
            )
          `)

          .order(
            "created_at",
            {
              ascending: false,
            }
          ),

        supabase

          .from("sources")

          .select(`
            source_id,
            source_name
          `)

          .order(
            "source_name",
            {
              ascending: true,
            }
          ),

        supabase

          .from(
            "inquiry_status"
          )

          .select(`
            inquiry_status_id,
            inquiry_status_name
          `)

          .order(
            "inquiry_status_name",
            {
              ascending: true,
            }
          ),

        supabase

          .from(
            "property_type"
          )

          .select(`
            property_type_id,
            property_type_name
          `)

          .order(
            "property_type_name",
            {
              ascending: true,
            }
          ),
      ]);

      setLeads(
        leadsRes.data || []
      );

      setSources(
        sourcesRes.data || []
      );

      setStatuses(
        statusesRes.data || []
      );

      setPropertyTypes(
        propertyTypesRes.data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL
  // =========================

  useEffect(() => {

    if (!open) return;

    fetchDropdowns();

    setFormData({

      contact_id:
        contact?.contact_id || "",

      lead_id: "",

      source_id:
        contact?.source_id || "",

      inquiry_status_id: "",

      inquiry_category: "Buy",

      property_type_id: "",

      market_type: "Sale",

      requirement_summary: "",

      district: "",

      city: "",

      budget_min: "",

      budget_max: "",

      next_action: "",

      last_followup: "",

      next_followup_at: "",

      priority: "WARM",

      notes: "",
    });

  }, [open, contact]);

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
  // CREATE ACTIVITY
  // =========================

  async function createActivity(
    inquiryId: number
  ) {

    try {

      await supabase

        .from("activities")

        .insert([
          {

            contact_id:
              formData.contact_id,

            inquiry_id:
              inquiryId,

            activity_type:
              "INQUIRY_CREATED",

            title:
              "Inquiry Created",

            notes:
              formData.requirement_summary ||

              "New inquiry created.",

            activity_date:
              new Date(),
          },
        ]);

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit() {

    try {

      setSaving(true);

      // =========================
      // VALIDATION
      // =========================

      if (
        !formData.contact_id
      ) {

        alert(
          "Contact required"
        );

        return;
      }

      if (
        !formData.property_type_id
      ) {

        alert(
          "Property type required"
        );

        return;
      }

      if (
        !formData.requirement_summary
      ) {

        alert(
          "Requirement summary required"
        );

        return;
      }

      if (
        !formData.next_action
      ) {

        alert(
          "Next action required"
        );

        return;
      }

      // =========================
      // INSERT
      // =========================

      const payload = {

        contact_id:
          formData.contact_id || null,

        lead_id:
          formData.lead_id || null,

        source_id:
          formData.source_id || null,

        inquiry_status_id:
          formData.inquiry_status_id || null,

        inquiry_category:
          formData.inquiry_category || null,

        property_type_id:
          formData.property_type_id || null,

        market_type:
          formData.market_type || null,

        requirement_summary:
          formData.requirement_summary || null,

        district:
          formData.district || null,

        city:
          formData.city || null,

        budget_min:
          formData.budget_min || null,

        budget_max:
          formData.budget_max || null,

        next_action:
          formData.next_action || null,

        last_followup:
          formData.last_followup || null,

        next_followup_at:
          formData.next_followup_at || null,

        priority:
          formData.priority || null,

        notes:
          formData.notes || null,

        inquiry_date:
          new Date(),

        created_at:
          new Date(),

        updated_at:
          new Date(),
      };

      const {

        data,

        error,

      } = await supabase

        .from("inquiries")

        .insert([payload])

        .select()

        .single();

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      // =========================
      // CREATE ACTIVITY
      // =========================

      await createActivity(
        data.inquiry_id
      );

      alert(
        "Inquiry created"
      );

      onSuccess();

      onClose();

    } catch (error) {

      console.log(error);

    } finally {

      setSaving(false);
    }
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
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-4xl
          rounded-3xl
          bg-white
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

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Create Inquiry
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Create operational inquiry
              for this contact.
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              text-gray-500
              hover:text-black
            "
          >
            ✕
          </button>

        </div>

        {/* CONTACT */}

        <div
          className="
            border
            rounded-2xl
            p-4
            bg-gray-50
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            Contact
          </div>

          <div
            className="
              text-lg
              font-semibold
            "
          >
            {contact?.name || "-"}
          </div>

          <div
            className="
              text-sm
              text-gray-600
            "
          >
            {contact?.phone || "-"}
          </div>

        </div>

        {/* FORM */}

        {loading ? (

          <div
            className="
              py-10
              text-center
              text-gray-500
            "
          >
            Loading...
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >

            {/* CATEGORY */}

            <FormSelect
              label="Inquiry Category"
              name="inquiry_category"
              value={
                formData.inquiry_category
              }
              onChange={
                handleChange
              }
              options={[
                "Buy",
                "Rent",
                "Sell",
              ]}
            />

            {/* MARKET */}

            <FormSelect
              label="Market Type"
              name="market_type"
              value={
                formData.market_type
              }
              onChange={
                handleChange
              }
              options={[
                "Sale",
                "Rent",
              ]}
            />

            {/* PROPERTY TYPE */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                "
              >
                Property Type
              </label>

              <select
                name="property_type_id"
                value={
                  formData.property_type_id
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
                  Select Property Type
                </option>

                {propertyTypes.map(
                  (item) => (

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

            </div>

            {/* PRIORITY */}

            <FormSelect
              label="Priority"
              name="priority"
              value={
                formData.priority
              }
              onChange={
                handleChange
              }
              options={[
                "HOT",
                "WARM",
                "COLD",
              ]}
            />

            {/* DISTRICT */}

            <FormInput
              label="District"
              name="district"
              value={
                formData.district
              }
              onChange={
                handleChange
              }
              placeholder="Tebet"
            />

            {/* CITY */}

            <FormInput
              label="City"
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              placeholder="Jakarta Selatan"
            />

            {/* BUDGET MIN */}

            <CurrencyInput
              label="Budget Min"
              value={
                formData.budget_min
              }
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  budget_min: value,
                })
              }
            />

            {/* BUDGET MAX */}

            <CurrencyInput
              label="Budget Max"
              value={
                formData.budget_max
              }
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  budget_max: value,
                })
              }
            />

            {/* NEXT ACTION */}

            <FormInput
              label="Next Action"
              name="next_action"
              value={
                formData.next_action
              }
              onChange={
                handleChange
              }
              placeholder="Send listing / Matching property"
            />

            {/* LAST FOLLOWUP */}

            <FormInput
              label="Last Followup"
              name="last_followup"
              type="datetime-local"
              value={
                formData.last_followup
              }
              onChange={
                handleChange
              }
            />

            {/* NEXT FOLLOWUP */}

            <FormInput
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

            {/* STATUS */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                "
              >
                Inquiry Status
              </label>

              <select
                name="inquiry_status_id"
                value={
                  formData.inquiry_status_id
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

                {statuses.map(
                  (item) => (

                    <option
                      key={
                        item.inquiry_status_id
                      }
                      value={
                        item.inquiry_status_id
                      }
                    >
                      {
                        item.inquiry_status_name
                      }
                    </option>
                  )
                )}

              </select>

            </div>

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

            {/* REQUIREMENT */}

            <div
              className="
                md:col-span-2
                space-y-2
              "
            >

              <label
                className="
                  text-sm
                  font-medium
                "
              >
                Requirement Summary
              </label>

              <textarea
                rows={5}
                name="requirement_summary"
                value={
                  formData.requirement_summary
                }
                onChange={
                  handleChange
                }
                placeholder="
                  Client requirement...
                "
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              />

            </div>

            {/* NOTES */}

            <div
              className="
                md:col-span-2
                space-y-2
              "
            >

              <label
                className="
                  text-sm
                  font-medium
                "
              >
                Notes
              </label>

              <textarea
                rows={4}
                name="notes"
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                placeholder="
                  Additional notes...
                "
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

        )}

        {/* FOOTER */}

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
              px-5
              py-3
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          <button
            onClick={
              handleSubmit
            }
            disabled={saving}
            className="
              bg-black
              text-white
              rounded-xl
              px-5
              py-3
              disabled:opacity-50
            "
          >
            {saving
              ? "Saving..."
              : "Create Inquiry"}
          </button>

        </div>

      </div>

    </div>
  );
}

// =========================
// FORM INPUT
// =========================

function FormInput({

  label,

  name,

  value,

  onChange,

  type = "text",

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
        type={type}
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
// FORM SELECT
// =========================

function FormSelect({

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

// =========================
// CURRENCY INPUT
// =========================

function CurrencyInput({

  label,

  value,

  onChange,

}: any) {

  function formatRupiah(
    value: string
  ) {

    if (!value) return "";

    return new Intl.NumberFormat(
      "id-ID"
    ).format(
      Number(value)
    );
  }

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
          type="text"
          value={formatRupiah(
            value
          )}
          onChange={(e) => {

            const raw =
              e.target.value.replace(
                /\D/g,
                ""
              );

            onChange(raw);
          }}
          className="
            w-full
            border
            rounded-xl
            pl-12
            pr-4
            py-3
          "
        />

      </div>

      <div
        className="
          text-xs
          text-gray-500
        "
      >
        100.000.000 = 100 Jt
        <br />
        1.000.000.000 = 1 M
      </div>

    </div>
  );
}