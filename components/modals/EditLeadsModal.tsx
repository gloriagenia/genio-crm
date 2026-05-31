"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type EditLeadModalProps = {
  open: boolean;

  data?: any;

  onClose: () => void;

  onSuccess: () => void;
};

export default function EditLeadModal({
  open,
  data,
  onClose,
  onSuccess,
}: EditLeadModalProps) {

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
  ] = useState<any>({

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

    last_contact: "",

    next_followup: "",

    lost_reason: "",
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

  }, [open]);

  // =========================
  // AUTO FILL
  // =========================

  useEffect(() => {

    if (!data) return;

    setFormData({

      contact_id:
        data.contact_id
          ? String(
              data.contact_id
            )
          : "",

      requirements:
        data.requirements || "",

      lead_status_id:
        data.lead_status_id
          ? String(
              data.lead_status_id
            )
          : "",

      budget_min:
        data.budget_min || "",

      budget_max:
        data.budget_max || "",

      source_id:
        data.source_id
          ? String(
              data.source_id
            )
          : "",

      priority:
        data.priority || "WARM",

      property_type_id:
        data.property_type_id
          ? String(
              data.property_type_id
            )
          : "",

      market_type:
        data.market_type || "Sale",

      timeline:
        data.timeline || "",

      district:
        data.district || "",

      city:
        data.city || "",

      land_size_min:
        data.land_size_min || "",

      building_size_min:
        data.building_size_min || "",

      last_contact:
        data.last_contact
          ? new Date(
              data.last_contact
            )
              .toISOString()
              .slice(0, 16)
          : "",

      next_followup:
        data.next_followup
          ? new Date(
              data.next_followup
            )
              .toISOString()
              .slice(0, 16)
          : "",

      lost_reason:
        data.lost_reason || "",
    });

  }, [data]);

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
  // SAVE
  // =========================

  async function handleSave() {

    try {

      if (!data?.leads_id) {

        alert(
          "Lead ID not found"
        );

        return;
      }

      setSaving(true);

      const payload = {

        contact_id:
          formData.contact_id
            ? Number(
                formData.contact_id
              )
            : null,

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
          formData.priority ||
          null,

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

        last_contact:
          formData.last_contact ||
          null,

        next_followup:
          formData.next_followup ||
          null,

        lost_reason:
          formData.lost_reason ||
          null,

        updated_at:
          new Date(),
      };

      const {
        error,
      } = await supabase

        .from("leads")

        .update(payload)

        .eq(
          "leads_id",
          data.leads_id
        );

      if (error) {

        console.log(error);

        alert(
          "Failed update lead"
        );

        return;
      }

      // =========================
      // DELETE OLD MATCHES
      // =========================

      await supabase

        .from(
          "property_matches"
        )

        .delete()

        .eq(
          "match_id",
          data.leads_id
        );

      // =========================
      // AUTO REMATCH
      // =========================

      if (
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

        // PROPERTY TYPE

        propertyQuery =
          propertyQuery.eq(
            "property_type_id",
            Number(
              formData.property_type_id
            )
          );

        // MIN BUDGET

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

        // MAX BUDGET

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

        // DISTRICT

        if (
          formData.district
        ) {

          propertyQuery =
            propertyQuery.ilike(
              "district",
              `%${formData.district}%`
            );
        }

        // CITY

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

        // INSERT MATCHES

        if (
          matchedProperties &&
          matchedProperties.length > 0
        ) {

          const matches =
            matchedProperties.map(
              (property) => ({

                match_id:
                  data.leads_id,

                property_id:
                  property.property_id,

                matching_score:
                  80,

                matching_status:
                  "MATCHED",

                notes:
                  "Auto regenerated after lead update",
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
        "Lead updated successfully"
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
            Edit Lead
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

              <Section title="Client Information">

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <SelectField
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

                  <SelectField
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

              </Section>

              {/* REQUIREMENT */}

              <Section title="Property Requirement">

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <SelectField
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

                  <SelectField
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

                  <InputField
                    label="District"
                    name="district"
                    value={
                      formData.district
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <InputField
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

              </Section>

              {/* FINANCIAL */}

              <Section title="Financial Information">

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <InputField
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

                  <InputField
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

                  <InputField
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

                  <InputField
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

              </Section>

              {/* EXTRA */}

              <Section title="Additional Information">

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <SelectField
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

                  <SelectField
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

                  <InputField
                    label="Timeline"
                    name="timeline"
                    value={
                      formData.timeline
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <InputField
                    label="Lost Reason"
                    name="lost_reason"
                    value={
                      formData.lost_reason
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <InputField
                    type="datetime-local"
                    label="Last Contact"
                    name="last_contact"
                    value={
                      formData.last_contact
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <InputField
                    type="datetime-local"
                    label="Next Followup"
                    name="next_followup"
                    value={
                      formData.next_followup
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <div className="md:col-span-2">

                    <TextareaField
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

              </Section>

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
              : "Update Lead"}
          </button>

        </div>

      </div>

    </div>
  );
}

// =========================
// SECTION
// =========================

function Section({
  title,
  children,
}: any) {

  return (

    <div className="space-y-4">

      <h3
        className="
          text-lg
          font-semibold
        "
      >
        {title}
      </h3>

      {children}

    </div>
  );
}

// =========================
// INPUT
// =========================

function InputField({
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

function SelectField({
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

function TextareaField({
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