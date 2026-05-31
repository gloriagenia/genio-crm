"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type AddLeadsModalProps = {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void;

  selectedContact?: any;
};

export default function AddLeadsModal({
  open,
  onClose,
  onSuccess,
  selectedContact,
}: AddLeadsModalProps) {

  // =========================
  // STATES
  // =========================

  const [
    contacts,
    setContacts,
  ] = useState<any[]>([]);

  const [
    leadStatuses,
    setLeadStatuses,
  ] = useState<any[]>([]);

  const [
    sources,
    setSources,
  ] = useState<any[]>([]);

  const [
    propertyTypes,
    setPropertyTypes,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  // =========================
  // FORM
  // =========================

  const [
    formData,
    setFormData,
  ] = useState({

    contact_id: "",

    requirements: "",

    lead_status_id: "",

    budget_min: "",

    budget_max: "",

    source_id: "",

    priority: "WARM",

    property_type_id: "",

    market_type: "Sale",

    timeline: "",

    district: "",

    city: "",

    land_size_min: "",

    building_size_min: "",
  });

  // =========================
  // FETCH DROPDOWNS
  // =========================

  async function fetchDropdowns() {

    try {

      setLoading(true);

      const [

        contactsRes,

        statusesRes,

        sourcesRes,

        propertyTypesRes,

      ] = await Promise.all([

        supabase

          .from("contacts")

          .select(`
            contact_id,
            name,
            phone
          `)

          .order(
            "name",
            {
              ascending: true,
            }
          ),

        supabase

          .from(
            "leads_statuses"
          )

          .select(`
            lead_status_id,
            lead_status_name
          `)

          .order(
            "lead_status_name",
            {
              ascending: true,
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

      setContacts(
        contactsRes.data || []
      );

      setLeadStatuses(
        statusesRes.data || []
      );

      setSources(
        sourcesRes.data || []
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

      requirements: "",

      lead_status_id: "",

      budget_min: "",

      budget_max: "",

      source_id:
        selectedContact?.source_id
          ? String(
              selectedContact.source_id
            )
          : "",

      priority: "WARM",

      property_type_id: "",

      market_type: "Sale",

      timeline: "",

      district: "",

      city: "",

      land_size_min: "",

      building_size_min: "",
    });

  }, [open, selectedContact]);

  // =========================
  // HANDLE CHANGE
  // =========================

  function handleChange(
    e: any
  ) {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  }

  // =========================
  // AUTO PRIORITY
  // =========================

  function getPriority() {

    if (
      formData.timeline
        .toLowerCase()
        .includes("asap")
    ) {

      return "HOT";
    }

    if (
      formData.timeline
        .toLowerCase()
        .includes("1")
    ) {

      return "WARM";
    }

    return formData.priority;
  }

  // =========================
  // SAVE
  // =========================

  async function handleSave() {

    try {

      // =========================
      // VALIDATION
      // =========================

      if (
        !formData.contact_id
      ) {

        alert(
          "Contact is required"
        );

        return;
      }

      if (
        !formData.market_type
      ) {

        alert(
          "Market type is required"
        );

        return;
      }

      setSaving(true);

      // =========================
      // INSERT LEAD
      // =========================

      const payload = {

        contact_id:
          Number(
            formData.contact_id
          ),

        requirements:
          formData.requirements ||
          null,

        lead_status_id:
          formData.lead_status_id
            ? Number(
                formData.lead_status_id
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

        source_id:
          formData.source_id
            ? Number(
                formData.source_id
              )
            : null,

        priority:
          getPriority(),

        property_type_id:
          formData.property_type_id
            ? Number(
                formData.property_type_id
              )
            : null,

        market_type:
          formData.market_type ||
          null,

        timeline:
          formData.timeline ||
          null,

        district:
          formData.district ||
          null,

        city:
          formData.city ||
          null,

        land_size_min:
          formData.land_size_min
            ? Number(
                formData.land_size_min
              )
            : null,

        building_size_min:
          formData
            .building_size_min
            ? Number(
                formData
                  .building_size_min
              )
            : null,

        last_contact: null,

        next_followup:
          new Date(
            Date.now() +
              3 *
                24 *
                60 *
                60 *
                1000
          ),
      };

      const {
        data: leadData,
        error,
      } = await supabase

        .from("leads")

        .insert([payload])

        .select()

        .single();

      if (error) {

        console.log(error);

        alert(
          "Failed create lead"
        );

        return;
      }

      // =========================
      // AUTO PROPERTY MATCHING
      // =========================

      if (
        leadData &&
        formData.property_type_id
      ) {

        let propertyQuery =
          supabase

            .from("properties")

            .select(`
              property_id,
              price,
              district,
              city,
              property_type_id
            `);

        // =========================
        // FILTER PROPERTY TYPE
        // =========================

        propertyQuery =
          propertyQuery.eq(
            "property_type_id",
            Number(
              formData.property_type_id
            )
          );

        // =========================
        // FILTER MIN BUDGET
        // =========================

        if (
          formData.budget_min
        ) {

          propertyQuery =
            propertyQuery.gte(
              "price",
              Number(
                formData.budget_min
              )
            );
        }

        // =========================
        // FILTER MAX BUDGET
        // =========================

        if (
          formData.budget_max
        ) {

          propertyQuery =
            propertyQuery.lte(
              "price",
              Number(
                formData.budget_max
              )
            );
        }

        // =========================
        // FILTER DISTRICT
        // =========================

        if (
          formData.district
        ) {

          propertyQuery =
            propertyQuery.ilike(
              "district",
              `%${formData.district}%`
            );
        }

        // =========================
        // FILTER CITY
        // =========================

        if (
          formData.city
        ) {

          propertyQuery =
            propertyQuery.ilike(
              "city",
              `%${formData.city}%`
            );
        }

        const {
          data: matchedProperties,
        } = await propertyQuery.limit(
          20
        );

        // =========================
        // INSERT PROPERTY MATCHES
        // =========================

        if (
          matchedProperties &&
          matchedProperties.length > 0
        ) {

          const matches =
            matchedProperties.map(
              (property) => ({

                match_id:
                  leadData.leads_id,

                property_id:
                  property.property_id,

                matching_score:
                  80,

                matching_status:
                  "MATCHED",

                notes:
                  "Auto generated from lead",
              })
            );

          await supabase

            .from(
              "property_matches"
            )

            .insert(matches);
        }
      }

      alert(
        "Lead created successfully"
      );

      onSuccess();

      handleClose();

    } catch (error) {

      console.log(error);

    } finally {

      setSaving(false);
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
          max-w-5xl
          max-h-[90vh]
          overflow-y-auto
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            border-b
            p-6
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
            Add Lead
          </h2>

          <button
            onClick={handleClose}
            className="
              text-gray-500
              hover:text-black
            "
          >
            ✕
          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-8">

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

              {/* CLIENT */}

              <div className="space-y-4">

                <h3
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  Client Information
                </h3>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <FormSelect
                    label="Contact"
                    name="contact_id"
                    value={
                      formData.contact_id
                    }
                    onChange={
                      handleChange
                    }
                    options={contacts.map(
                      (item) => ({
                        value:
                          item.contact_id,
                        label:
                          `${item.name} - ${item.phone}`,
                      })
                    )}
                  />

                  <FormSelect
                    label="Lead Status"
                    name="lead_status_id"
                    value={
                      formData.lead_status_id
                    }
                    onChange={
                      handleChange
                    }
                    options={leadStatuses.map(
                      (item) => ({
                        value:
                          item.lead_status_id,
                        label:
                          item.lead_status_name,
                      })
                    )}
                  />

                </div>

              </div>

              {/* REQUIREMENT */}

              <div className="space-y-4">

                <h3
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  Property Requirement
                </h3>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <FormSelect
                    label="Property Type"
                    name="property_type_id"
                    value={
                      formData.property_type_id
                    }
                    onChange={
                      handleChange
                    }
                    options={propertyTypes.map(
                      (item) => ({
                        value:
                          item.property_type_id,
                        label:
                          item.property_type_name,
                      })
                    )}
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
                      {
                        value:
                          "Sale",
                        label:
                          "Sale",
                      },

                      {
                        value:
                          "Rent",
                        label:
                          "Rent",
                      },

                      {
                        value:
                          "Sale & Rent",
                        label:
                          "Sale & Rent",
                      },
                    ]}
                  />

                  <FormInput
                    label="District"
                    name="district"
                    value={
                      formData.district
                    }
                    onChange={
                      handleChange
                    }
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
                  />

                </div>

              </div>

              {/* FINANCIAL */}

              <div className="space-y-4">

                <h3
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  Financial Information
                </h3>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <FormInput
                    type="number"
                    label="Budget Min"
                    name="budget_min"
                    value={
                      formData.budget_min
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <FormInput
                    type="number"
                    label="Budget Max"
                    name="budget_max"
                    value={
                      formData.budget_max
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <FormInput
                    type="number"
                    label="Land Size Min"
                    name="land_size_min"
                    value={
                      formData.land_size_min
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <FormInput
                    type="number"
                    label="Building Size Min"
                    name="building_size_min"
                    value={
                      formData
                        .building_size_min
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              {/* EXTRA */}

              <div className="space-y-4">

                <h3
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  Additional Information
                </h3>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

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
                      {
                        value:
                          "HOT",
                        label:
                          "HOT",
                      },

                      {
                        value:
                          "WARM",
                        label:
                          "WARM",
                      },

                      {
                        value:
                          "COLD",
                        label:
                          "COLD",
                      },
                    ]}
                  />

                  <FormSelect
                    label="Source"
                    name="source_id"
                    value={
                      formData.source_id
                    }
                    onChange={
                      handleChange
                    }
                    options={sources.map(
                      (item) => ({
                        value:
                          item.source_id,
                        label:
                          item.source_name,
                      })
                    )}
                  />

                  <div className="md:col-span-2">

                    <FormInput
                      label="Timeline"
                      name="timeline"
                      value={
                        formData.timeline
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="md:col-span-2">

                    <FormTextarea
                      label="Requirements"
                      name="requirements"
                      value={
                        formData.requirements
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

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
            onClick={handleClose}
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
            onClick={handleSave}
            disabled={saving}
            className="
              bg-black
              text-white
              rounded-xl
              px-5
              py-3
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {saving
              ? "Saving..."
              : "Save Lead"}
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
          border
          rounded-xl
          px-4
          py-3
        "
      >

        <option value="">
          Select {label}
        </option>

        {options.map(
          (
            option: any,
            index: number
          ) => (

            <option
              key={index}
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}

      </select>

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
        rows={5}
        {...props}
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