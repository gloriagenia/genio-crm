"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

// =========================
// TYPES
// =========================

type AddInquiryModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedContact?: any;
};

// =========================
// COMPONENT
// =========================

export default function AddInquiryModal({
  open,
  onClose,
  onSuccess,
  selectedContact,
}: AddInquiryModalProps) {

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [sources, setSources] =
    useState<any[]>([]);

  const [statuses, setStatuses] =
    useState<any[]>([]);

  const [
    propertyTypes,
    setPropertyTypes,
  ] = useState<any[]>([]);

  // =========================
  // FORM
  // =========================

  const [
    formData,
    setFormData,
  ] = useState({

    contact_id: "",

    source_id: "",

    inquiry_status_id: "",

    inquiry_category: "Buy",

    property_type_id: "",

    market_type: "Sale",

    district: "",

    city: "",

    budget_min: "",

    budget_max: "",

    next_action: "",

    last_followup: "",

    next_followup_at: "",

    priority: "WARM",

    requirement_summary: "",

    notes: "",
  });

  // =========================
  // FETCH DROPDOWNS
  // =========================

  async function fetchDropdowns() {

    try {

      setLoading(true);

      const [

        sourcesRes,

        statusesRes,

        propertyTypesRes,

      ] = await Promise.all([

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
        selectedContact?.contact_id
          ? String(
              selectedContact.contact_id
            )
          : "",

      source_id:
        selectedContact?.source_id
          ? String(
              selectedContact.source_id
            )
          : "",

      inquiry_status_id: "",

      inquiry_category: "Buy",

      property_type_id: "",

      market_type: "Sale",

      district: "",

      city: "",

      budget_min: "",

      budget_max: "",

      next_action: "",

      last_followup: "",

      next_followup_at: "",

      priority: "WARM",

      requirement_summary: "",

      notes: "",
    });

  }, [
    open,
    selectedContact,
  ]);

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
              Number(
                formData.contact_id
              ),

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
      // PAYLOAD
      // =========================

      const payload = {

        contact_id:
          formData.contact_id
            ? Number(
                formData.contact_id
              )
            : null,

        source_id:
          formData.source_id
            ? Number(
                formData.source_id
              )
            : null,

        inquiry_status_id:
          formData.inquiry_status_id
            ? Number(
                formData.inquiry_status_id
              )
            : null,

        property_type_id:
          formData.property_type_id
            ? Number(
                formData.property_type_id
              )
            : null,

        budget_min:
          formData.budget_min
            ? Number(
                formData.budget_min
              )
            : null,

        budget_max:
          formData.budget_max
            ? Number(
                formData.budget_max
              )
            : null,

        inquiry_category:
          formData.inquiry_category,

        market_type:
          formData.market_type,

        district:
          formData.district ||

          null,

        city:
          formData.city ||

          null,

        next_action:
          formData.next_action ||

          null,

        last_followup:
          formData.last_followup ||

          null,

        next_followup_at:
          formData.next_followup_at ||

          null,

        priority:
          formData.priority ||

          null,

        requirement_summary:
          formData.requirement_summary ||

          null,

        notes:
          formData.notes ||

          null,

        inquiry_date:
          new Date(),

        created_at:
          new Date(),

        updated_at:
          new Date(),
      };

      // =========================
      // INSERT
      // =========================

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
      // ACTIVITY
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
        bg-black/50
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-5xl
          max-h-[90vh]
          overflow-y-auto

          rounded-3xl
          bg-white

          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            border-b
            px-6
            py-5

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
                mt-1
                text-sm
                text-gray-500
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

        {/* BODY */}

        <div className="p-6 space-y-6">

          {/* CONTACT */}

          <div
            className="
              rounded-2xl
              border
              bg-gray-50
              p-5
            "
          >

            <div
              className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Contact Information
            </div>

            {selectedContact ? (

              <div className="mt-3">

                <div
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  {
                    selectedContact.name
                  }
                </div>

                <div
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  {
                    selectedContact.phone
                  }
                </div>

              </div>

            ) : (

              <div
                className="
                  mt-3
                  text-sm
                  text-gray-400
                "
              >
                No contact selected
              </div>

            )}

          </div>

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

            <>

              {/* REQUIREMENT */}

              <div
                className="
                  rounded-2xl
                  border
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Requirement Overview
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

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

                  <PropertyTypeSelect
                    value={
                      formData.property_type_id
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      propertyTypes
                    }
                  />

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

                </div>

              </div>

              {/* LOCATION */}

              <div
                className="
                  rounded-2xl
                  border
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Location & Budget
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

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

                </div>

              </div>

              {/* WORKFLOW */}

              <div
                className="
                  rounded-2xl
                  border
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Workflow & Followup
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <FormInput
                    label="Next Action"
                    name="next_action"
                    value={
                      formData.next_action
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="
                      Send listing / Matching property
                    "
                  />

                  <StatusSelect
                    value={
                      formData.inquiry_status_id
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      statuses
                    }
                  />

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

                  <SourceSelect
                    value={
                      formData.source_id
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      sources
                    }
                  />

                </div>

              </div>

              {/* NOTES */}

              <div
                className="
                  rounded-2xl
                  border
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Requirement Notes
                </div>

                <div className="space-y-4">

                  <FormTextarea
                    label="
                      Requirement Summary
                    "
                    name="
                      requirement_summary
                    "
                    value={
                      formData.requirement_summary
                    }
                    onChange={
                      handleChange
                    }
                    rows={5}
                    placeholder="
                      Client requirement...
                    "
                  />

                  <FormTextarea
                    label="Notes"
                    name="notes"
                    value={
                      formData.notes
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                    placeholder="
                      Additional notes...
                    "
                  />

                </div>

              </div>

            </>

          )}

        </div>

        {/* FOOTER */}

        <div
          className="
            border-t
            p-6

            flex
            justify-end
            gap-3
          "
        >

          <button
            onClick={onClose}
            className="
              rounded-xl
              border
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
              rounded-xl
              bg-black
              px-5
              py-3
              text-white
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
// INPUT
// =========================

function FormInput({

  label,

  ...props

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
        {...props}
        className="
          w-full
          rounded-xl
          border
          px-4
          py-3
        "
      />

    </div>
  );
}

// =========================
// TEXTAREA
// =========================

function FormTextarea({

  label,

  ...props

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
        {...props}
        className="
          w-full
          rounded-xl
          border
          px-4
          py-3
        "
      />

    </div>
  );
}

// =========================
// SELECT
// =========================

function FormSelect({

  label,

  options,

  ...props

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
        {...props}
        className="
          w-full
          rounded-xl
          border
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
// PROPERTY TYPE
// =========================

function PropertyTypeSelect({

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
        Property Type
      </label>

      <select
        name="
          property_type_id
        "
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          px-4
          py-3
        "
      >

        <option value="">
          Select Property Type
        </option>

        {options.map(
          (item: any) => (

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
  );
}

// =========================
// STATUS
// =========================

function StatusSelect({

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
        Inquiry Status
      </label>

      <select
        name="
          inquiry_status_id
        "
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          px-4
          py-3
        "
      >

        <option value="">
          Select Status
        </option>

        {options.map(
          (item: any) => (

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
  );
}

// =========================
// SOURCE
// =========================

function SourceSelect({

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
        Source
      </label>

      <select
        name="source_id"
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          px-4
          py-3
        "
      >

        <option value="">
          Select Source
        </option>

        {options.map(
          (item: any) => (

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
  );
}

// =========================
// CURRENCY
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

  function formatShort(
    value: string
  ) {

    const number =
      Number(value);

    if (!number) return "";

    if (
      number >=
      1000000000
    ) {

      return `≈ ${(
        number /
        1000000000
      ).toFixed(2)} M`;
    }

    if (
      number >=
      1000000
    ) {

      return `≈ ${(
        number /
        1000000
      ).toFixed(0)} Jt`;
    }

    return `≈ ${new Intl.NumberFormat(
      "id-ID"
    ).format(number)}`;
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
            rounded-xl
            border
            pl-12
            pr-4
            py-3
          "
        />

      </div>

      {value && (

        <div
          className="
            text-xs
            text-gray-500
          "
        >
          {formatShort(
            value
          )}
        </div>

      )}

    </div>
  );
}