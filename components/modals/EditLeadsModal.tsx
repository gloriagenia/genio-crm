"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Save,
  UserRound,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import ContactSearchInput from "@/components/leads/ContactSearchInput";

type EditLeadsModalProps = {
  open: boolean;

  data?: any;

  onClose: () => void;

  onSuccess: () => void;

};

export default function EditLeadsModal({
  open,
  data,
  onClose,
  onSuccess,
}: EditLeadsModalProps) {

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
    marketTypes,
    setMarketTypes,
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
  // MOBILE ACCORDION
  // =========================

  const [
    openSections,
    setOpenSections,
  ] = useState({

    client: true,

    requirement: true,

    additional: false,
  });

  // =========================
  // FORM
  // =========================

  const [
    formData,
    setFormData,
  ] = useState({

    contact_id: null as number | null,

    requirements: "",

    lead_status_id: "",

    budget_min: "",

    budget_max: "",

    source_id: "",

    priority: "WARM",

    property_type_id: "",

    market_type_id: "",

    timeline: "",

    district: "",

    city: "",

    land_size_min: "",

    building_size_min: "",
  });

  // =========================
  // FETCH
  // =========================

  async function fetchDropdowns() {

    try {

      setLoading(true);

      const [

        contactsRes,

        statusesRes,

        sourcesRes,

        propertyTypesRes,

        marketTypesRes,

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

        supabase

          .from(
            "market_types"
          )

          .select(`
            market_type_id,
            market_type_name
          `)

          .order(
            "market_type_name",
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

      setMarketTypes(
        marketTypesRes.data || []
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

    if (!open || !data)
      return;

    fetchDropdowns();

    setFormData({

      contact_id:
              data.contact_id || null,

      requirements:
        data.requirements ||
        "",

      lead_status_id:
        data.lead_status_id
          ? String(
              data.lead_status_id
            )
          : "",

      budget_min:
        data.budget_min
          ? String(
              data.budget_min
            )
          : "",

      budget_max:
        data.budget_max
          ? String(
              data.budget_max
            )
          : "",

      source_id:
        data.source_id
          ? String(
              data.source_id
            )
          : "",

      priority:
        data.priority ||
        "WARM",

      property_type_id:
        data.property_type_id
          ? String(
              data.property_type_id
            )
          : "",

      market_type_id:
        data.market_type_id
          ? String(
              data.market_type_id
            )
          : "",

      timeline:
        data.timeline ||
        "",

      district:
        data.district ||
        "",

      city:
        data.city ||
        "",

      land_size_min:
        data.land_size_min
          ? String(
              data.land_size_min
            )
          : "",

      building_size_min:
        data.building_size_min
          ? String(
              data.building_size_min
            )
          : "",
    });

  }, [
    open,
  ]);

  // =========================
  // CONTACT
  // =========================

  const selectedContactData =
    useMemo(() => {

      return contacts.find(
        (item) =>
          String(
            item.contact_id
          ) ===
          String(
            formData.contact_id
          )
      );

    }, [
      contacts,
      formData.contact_id,
    ]);

  // =========================
  // CHANGE
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
  // UPDATE
  // =========================

  async function handleSubmit() {

    try {

      if (
        !formData.contact_id
      ) {

        alert(
          "Contact is required"
        );

        return;
      }

      if (
        !formData.property_type_id
      ) {

        alert(
          "Property type is required"
        );

        return;
      }

      if (
        !formData.market_type_id
      ) {

        alert(
          "Market type is required"
        );

        return;
      }

      if (
        formData.budget_min &&
        formData.budget_max &&
        Number(
          formData.budget_max
        ) <
          Number(
            formData.budget_min
          )
      ) {

        alert(
          "Budget max cannot be smaller than budget min"
        );

        return;
      }

      setSaving(true);

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
          formData.priority,

        property_type_id:
          formData.property_type_id
            ? Number(
                formData.property_type_id
              )
            : null,

        market_type_id:
          formData.market_type_id
            ? Number(
                formData.market_type_id
              )
            : null,

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

        updated_at:
          new Date(),
      };

      const { error } =
        await supabase

          .from("leads")

          .update(payload)

          .eq(
            "leads_id",
            data.leads_id
          );

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Lead updated successfully"
      );

      onSuccess();

      onClose();

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

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
        backdrop-blur-sm
      "
    >

      <div
        className="
          flex
          min-h-screen

          items-end
          justify-center

          md:items-center
          md:p-6
        "
      >

        <div
          className="
            flex
            h-[100dvh]
            w-full
            flex-col

            overflow-hidden

            bg-white

            md:h-auto
            md:max-h-[90vh]
            md:max-w-4xl

            md:rounded-[28px]
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between

              border-b

              px-4
              py-4

              md:px-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10

                  items-center
                  justify-center

                  rounded-2xl

                  bg-violet-100
                "
              >
                <UserRound
                  size={20}
                  className="
                    text-violet-600
                  "
                />
              </div>

              <div>

                <h2
                  className="
                    text-xl
                    font-bold

                    text-slate-900
                  "
                >
                  Edit Lead
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Update lead information
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="
                rounded-xl

                p-2

                text-slate-400

                hover:bg-slate-100
              "
            >
              <X size={22} />
            </button>

          </div>

          {/* BODY */}

          <div
            className="
              flex-1

              space-y-4

              overflow-y-auto

              p-4

              md:p-6
            "
          >

            {loading ? (

              <div
                className="
                  flex
                  h-40

                  items-center
                  justify-center
                "
              >

                <Loader2
                  className="
                    animate-spin
                    text-violet-600
                  "
                />

              </div>

            ) : (

              <>

                {/* CLIENT */}

                <SectionCard
                  mobileOpen={
                    openSections.client
                  }
                  onToggle={() =>
                    setOpenSections({
                      ...openSections,
                      client:
                        !openSections.client,
                    })
                  }
                  icon={
                    <UserRound
                      size={18}
                    />
                  }
                  title="Client Information"
                >

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3

                      md:grid-cols-2
                    "
                  >

                    <div
                      className="
                        md:col-span-2
                      "
                    >

                      <ContactSearchInput
                        value={
                          formData.contact_id
                        }
                        onSelect={(
                          contact
                        ) => {

                          setFormData({

                            ...formData,

                            contact_id:
                                contact?.contact_id || null,
                          });
                        }}
                      />

                    </div>

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

                  </div>

                  {selectedContactData && (

                    <div
                      className="
                        mt-4

                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        border

                        bg-slate-50

                        p-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-10
                          w-10

                          items-center
                          justify-center

                          rounded-full

                          bg-violet-100

                          font-semibold

                          text-violet-700
                        "
                      >
                        {selectedContactData.name?.charAt(
                          0
                        )}
                      </div>

                      <div>

                        <p
                          className="
                            font-medium
                            text-slate-900
                          "
                        >
                          {
                            selectedContactData.name
                          }
                        </p>

                        <p
                          className="
                            text-sm
                            text-slate-500
                          "
                        >
                          {
                            selectedContactData.phone
                          }
                        </p>

                      </div>

                    </div>

                  )}

                </SectionCard>

                {/* REQUIREMENT */}

                <SectionCard
                  mobileOpen={
                    openSections.requirement
                  }
                  onToggle={() =>
                    setOpenSections({
                      ...openSections,
                      requirement:
                        !openSections.requirement,
                    })
                  }
                  icon={
                    <Building2
                      size={18}
                    />
                  }
                  title="Requirement"
                >

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3

                      md:grid-cols-2
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
                      name="market_type_id"
                      value={
                        formData.market_type_id
                      }
                      onChange={
                        handleChange
                      }
                      options={marketTypes.map(
                        (item) => ({
                          value:
                            item.market_type_id,

                          label:
                            item.market_type_name,
                        })
                      )}
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

                </SectionCard>

                {/* ADDITIONAL */}

                <SectionCard
                  mobileOpen={
                    openSections.additional
                  }
                  onToggle={() =>
                    setOpenSections({
                      ...openSections,
                      additional:
                        !openSections.additional,
                    })
                  }
                  icon={
                    <FileText
                      size={18}
                    />
                  }
                  title="Additional Notes"
                >

                  <div
                    className="
                      mb-3
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
                            "🔥 HOT",
                        },

                        {
                          value:
                            "WARM",
                          label:
                            "🌤️ WARM",
                        },

                        {
                          value:
                            "COLD",
                          label:
                            "❄️ COLD",
                        },
                      ]}
                    />

                  </div>

                  <FormTextarea
                    label="Requirements / Notes"
                    name="requirements"
                    value={
                      formData.requirements
                    }
                    onChange={
                      handleChange
                    }
                  />

                </SectionCard>

              </>

            )}

          </div>

          {/* FOOTER */}

          <div
            className="
              border-t

              bg-white

              p-4
            "
          >

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="
                flex
                h-12
                w-full

                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-violet-600

                px-5

                font-semibold
                text-white

                transition-all

                hover:bg-violet-700

                disabled:opacity-50
              "
            >

              {saving ? (

                <Loader2
                  size={18}
                  className="
                    animate-spin
                  "
                />

              ) : (

                <Save size={18} />

              )}

              {saving
                ? "Updating..."
                : "Update Lead"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

// =========================
// SECTION
// =========================

function SectionCard({
  icon,
  title,
  children,
  mobileOpen,
  onToggle,
}: any) {

  return (

    <div
      className="
        overflow-hidden

        rounded-3xl

        border
        border-slate-200

        bg-white
      "
    >

      <button
        onClick={onToggle}
        className="
          flex
          w-full
          items-center
          justify-between

          p-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10

              items-center
              justify-center

              rounded-2xl

              bg-violet-100

              text-violet-700
            "
          >
            {icon}
          </div>

          <h3
            className="
              text-base
              font-semibold

              text-slate-900
            "
          >
            {title}
          </h3>

        </div>

        {mobileOpen ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}

      </button>

      {mobileOpen && (

        <div
          className="
            border-t

            p-4
          "
        >
          {children}
        </div>

      )}

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

    <div
      className="
        space-y-1.5
      "
    >

      <label
        className="
          text-xs
          font-medium

          text-slate-500
        "
      >
        {label}
      </label>

      <input
        {...props}
        className="
          h-12
          w-full

          rounded-2xl

          border
          border-slate-200

          bg-white

          px-4

          text-[15px]

          outline-none

          transition-all

          focus:border-violet-400
          focus:ring-4
          focus:ring-violet-100
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

    <div
      className="
        space-y-1.5
      "
    >

      <label
        className="
          text-xs
          font-medium

          text-slate-500
        "
      >
        {label}
      </label>

      <select
        {...props}
        className="
          h-12
          w-full

          rounded-2xl

          border
          border-slate-200

          bg-white

          px-4

          text-[15px]

          outline-none

          transition-all

          focus:border-violet-400
          focus:ring-4
          focus:ring-violet-100
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

    <div
      className="
        space-y-1.5
      "
    >

      <label
        className="
          text-xs
          font-medium

          text-slate-500
        "
      >
        {label}
      </label>

      <textarea
        rows={4}
        {...props}
        className="
          w-full

          rounded-2xl

          border
          border-slate-200

          bg-white

          px-4
          py-3

          text-[15px]

          outline-none

          transition-all

          focus:border-violet-400
          focus:ring-4
          focus:ring-violet-100
        "
      />

    </div>
  );
}