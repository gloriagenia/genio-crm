"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import clsx from "clsx";

import {
  ArrowRight,
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Clock3,
  Edit,
  Flame,
  MapPin,
  Phone,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type LeadDetailPopUpProps = {
  open: boolean;

  onClose: () => void;

  leadId: number | null;

  onEdit?: (
    lead: any
  ) => void;
};

export default function LeadDetailPopUp({
  open,
  onClose,
  leadId,
  onEdit,
}: LeadDetailPopUpProps) {

  // =========================
  // STATES
  // =========================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    lead,
    setLead,
  ] = useState<any>(null);

  const [
    propertyMatches,
    setPropertyMatches,
  ] = useState<any[]>([]);

  const [
    activities,
    setActivities,
  ] = useState<any[]>([]);

  const [
    mobileSections,
    setMobileSections,
  ] = useState({

    requirement: true,

    matches: true,

    activity: false,

    notes: false,
  });

  // =========================
  // FETCH
  // =========================

  async function fetchLeadDetail() {

    try {

      if (!leadId) return;

      setLoading(true);

      // =========================
      // LEAD
      // =========================

      const {
        data: leadData,
        error: leadError,
      } = await supabase

        .from("leads")

        .select(`
          *,
          contacts (
            contact_id,
            name,
            phone
          ),
          leads_statuses (
            lead_status_name
          ),
          property_type (
            property_type_name
          ),
          market_types (
            market_type_name
          ),
          sources (
            source_name
          )
        `)

        .eq(
          "leads_id",
          leadId
        )

        .single();

      if (leadError) {

        console.log(
          leadError
        );

        return;
      }

      setLead(leadData);

      // =========================
      // PROPERTY MATCHES
      // =========================

      const {
        data: matchesData,
      } = await supabase

        .from(
          "property_matches"
        )

        .select(`
          *,
          properties (
            property_id,
            property_name,
            title,
            price,
            district,
            city,
            thumbnail_url
          )
        `)

        .eq(
          "leads_id",
          leadId
        )

        .order(
          "matching_score",
          {
            ascending: false,
          }
        )

        .limit(10);

      setPropertyMatches(
        matchesData || []
      );

      // =========================
      // ACTIVITIES
      // =========================

      const {
        data: activityData,
      } = await supabase

        .from(
          "lead_activities"
        )

        .select(`*`)

        .eq(
          "leads_id",
          leadId
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        )

        .limit(10);

      setActivities(
        activityData || []
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

    if (
      open &&
      leadId
    ) {

      fetchLeadDetail();
    }

  }, [
    open,
    leadId,
  ]);

  // =========================
  // PRIORITY COLOR
  // =========================

  const priorityColor =
    useMemo(() => {

      if (
        lead?.priority ===
        "HOT"
      ) {

        return `
          bg-red-100
          text-red-700
        `;
      }

      if (
        lead?.priority ===
        "WARM"
      ) {

        return `
          bg-orange-100
          text-orange-700
        `;
      }

      return `
        bg-slate-100
        text-slate-700
      `;

    }, [lead]);

  // =========================
  // WHATSAPP
  // =========================

  function openWhatsApp() {

    if (
      !lead?.contacts?.phone
    )
      return;

    let cleanPhone =
      lead.contacts.phone.replace(
        /\D/g,
        ""
      );

    if (
      cleanPhone.startsWith(
        "0"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone.slice(1);
    }

    if (
      cleanPhone.startsWith(
        "8"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone;
    }

    if (
      !cleanPhone.startsWith(
        "62"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone;
    }

    window.open(
      `https://wa.me/${cleanPhone}`,
      "_blank"
    );
  }

  // =========================
  // EDIT HANDLER
  // =========================

  function handleEdit() {

    if (!lead) return;

    // IMPORTANT:
    // tutup popup dulu
    // supaya modal edit tidak nyangkut

    onClose();

    setTimeout(() => {

      onEdit?.(lead);

    }, 150);
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

            bg-slate-50

            md:h-[92vh]
            md:max-w-7xl

            md:rounded-[32px]
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              items-start
              justify-between

              border-b

              bg-white

              px-4
              py-4

              md:px-6
            "
          >

            <div
              className="
                min-w-0
                flex-1
              "
            >

              {/* TOP */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11

                    items-center
                    justify-center

                    rounded-2xl

                    bg-violet-100
                  "
                >

                  <UserRound
                    size={20}
                    className="
                      text-violet-700
                    "
                  />

                </div>

                <div
                  className="
                    min-w-0
                  "
                >

                  <h2
                    className="
                      truncate

                      text-lg
                      font-bold

                      text-slate-900

                      md:text-2xl
                    "
                  >
                    {
                      lead?.contacts
                        ?.name || "-"
                    }
                  </h2>

                  <div
                    className="
                      mt-1

                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-1

                        text-sm
                        text-slate-500
                      "
                    >

                      <Phone
                        size={14}
                      />

                      {
                        lead?.contacts
                          ?.phone || "-"
                      }

                    </div>

                    <span
                      className={clsx(
                        `
                          rounded-full

                          px-2.5
                          py-1

                          text-xs
                          font-semibold
                        `,
                        priorityColor
                      )}
                    >
                      {lead?.priority}
                    </span>

                    {lead
                      ?.leads_statuses
                      ?.lead_status_name && (

                      <span
                        className="
                          rounded-full

                          bg-violet-100

                          px-2.5
                          py-1

                          text-xs
                          font-medium

                          text-violet-700
                        "
                      >
                        {
                          lead
                            ?.leads_statuses
                            ?.lead_status_name
                        }
                      </span>

                    )}

                  </div>

                </div>

              </div>

              {/* META */}

              <div
                className="
                  mt-4

                  flex
                  flex-wrap
                  gap-2

                  md:gap-3
                "
              >

                <MetaItem
                  icon={
                    <CalendarClock
                      size={14}
                    />
                  }
                  label="Next Follow Up"
                  value={
                    lead?.next_followup
                      ? new Date(
                          lead.next_followup
                        ).toLocaleDateString()
                      : "-"
                  }
                />

                <MetaItem
                  icon={
                    <Clock3
                      size={14}
                    />
                  }
                  label="Last Contact"
                  value={
                    lead?.last_contact
                      ? new Date(
                          lead.last_contact
                        ).toLocaleDateString()
                      : "-"
                  }
                />

                <MetaItem
                  icon={
                    <Flame
                      size={14}
                    />
                  }
                  label="Source"
                  value={
                    lead?.sources
                      ?.source_name ||
                    "-"
                  }
                />

              </div>

            </div>

            {/* ACTION */}

            <div
              className="
                ml-3

                flex
                items-center
                gap-2
              "
            >

              <button
                onClick={
                  handleEdit
                }
                className="
                  hidden

                  items-center
                  gap-2

                  rounded-2xl

                  border

                  px-4
                  py-2.5

                  text-sm
                  font-medium

                  transition-all

                  hover:bg-slate-100

                  md:flex
                "
              >

                <Edit size={16} />

                Edit

              </button>

              <button
                onClick={onClose}
                className="
                  rounded-2xl

                  p-2.5

                  text-slate-500

                  transition-all

                  hover:bg-slate-100
                "
              >

                <X size={22} />

              </button>

            </div>

          </div>

          {/* BODY */}

          <div
            className="
              flex-1

              overflow-y-auto
            "
          >

            {loading ? (

              <div
                className="
                  flex
                  h-full

                  items-center
                  justify-center
                "
              >
                Loading...
              </div>

            ) : (

              <div
                className="
                  grid
                  grid-cols-1

                  gap-4

                  p-4

                  md:grid-cols-12
                  md:gap-6
                  md:p-6
                "
              >

                {/* LEFT */}

                <div
                  className="
                    space-y-4

                    md:col-span-8
                  "
                >

                  {/* REQUIREMENT */}

                  <MobileSection
                    title="Requirement"
                    open={
                      mobileSections.requirement
                    }
                    onToggle={() =>
                      setMobileSections({
                        ...mobileSections,
                        requirement:
                          !mobileSections.requirement,
                      })
                    }
                  >

                    <div
                      className="
                        grid
                        grid-cols-1

                        gap-3

                        md:grid-cols-2
                      "
                    >

                      <InfoCard
                        icon={
                          <Building2
                            size={16}
                          />
                        }
                        label="Property Type"
                        value={
                          lead
                            ?.property_type
                            ?.property_type_name ||
                          "-"
                        }
                      />

                      <InfoCard
                        icon={
                          <Wallet
                            size={16}
                          />
                        }
                        label="Market Type"
                        value={
                          lead
                            ?.market_types
                            ?.market_type_name ||
                          "-"
                        }
                      />

                      <InfoCard
                        icon={
                          <MapPin
                            size={16}
                          />
                        }
                        label="Location"
                        value={`${lead?.district || "-"}, ${lead?.city || "-"}`}
                      />

                      <InfoCard
                        icon={
                          <Wallet
                            size={16}
                          />
                        }
                        label="Budget"
                        value={
                          lead?.budget_min ||
                          lead?.budget_max
                            ? `Rp ${Number(
                                lead?.budget_min || 0
                              ).toLocaleString()} - Rp ${Number(
                                lead?.budget_max || 0
                              ).toLocaleString()}`
                            : "-"
                        }
                      />

                      <InfoCard
                        icon={
                          <Building2
                            size={16}
                          />
                        }
                        label="Land Size"
                        value={
                          lead?.land_size_min
                            ? `${lead.land_size_min} m²`
                            : "-"
                        }
                      />

                      <InfoCard
                        icon={
                          <Building2
                            size={16}
                          />
                        }
                        label="Building Size"
                        value={
                          lead?.building_size_min
                            ? `${lead.building_size_min} m²`
                            : "-"
                        }
                      />

                    </div>

                  </MobileSection>

                  {/* NOTES */}

                  <MobileSection
                    title="Requirements & Notes"
                    open={
                      mobileSections.notes
                    }
                    onToggle={() =>
                      setMobileSections({
                        ...mobileSections,
                        notes:
                          !mobileSections.notes,
                      })
                    }
                  >

                    <div
                      className="
                        rounded-3xl

                        border

                        bg-white

                        p-4

                        text-sm
                        leading-relaxed

                        text-slate-700
                      "
                    >
                      {lead?.requirements ||
                        "No notes"}
                    </div>

                  </MobileSection>

                  {/* ACTIVITY */}

                  <MobileSection
                    title="Activity Timeline"
                    open={
                      mobileSections.activity
                    }
                    onToggle={() =>
                      setMobileSections({
                        ...mobileSections,
                        activity:
                          !mobileSections.activity,
                      })
                    }
                  >

                    <div
                      className="
                        rounded-3xl

                        border

                        bg-white

                        p-4
                      "
                    >

                      <div
                        className="
                          space-y-4
                        "
                      >

                        {activities.length ===
                        0 ? (

                          <div
                            className="
                              text-sm
                              text-slate-500
                            "
                          >
                            No activity yet
                          </div>

                        ) : (

                          activities.map(
                            (
                              item,
                              index
                            ) => (

                              <div
                                key={index}
                                className="
                                  flex
                                  gap-3
                                "
                              >

                                <div
                                  className="
                                    mt-1

                                    h-2.5
                                    w-2.5

                                    rounded-full

                                    bg-violet-500
                                  "
                                />

                                <div>

                                  <p
                                    className="
                                      text-sm
                                      font-medium

                                      text-slate-900
                                    "
                                  >
                                    {
                                      item.activity_type
                                    }
                                  </p>

                                  <p
                                    className="
                                      mt-1

                                      text-sm

                                      text-slate-500
                                    "
                                  >
                                    {
                                      item.notes
                                    }
                                  </p>

                                  <p
                                    className="
                                      mt-1

                                      text-xs

                                      text-slate-400
                                    "
                                  >
                                    {new Date(
                                      item.created_at
                                    ).toLocaleString()}
                                  </p>

                                </div>

                              </div>

                            )
                          )

                        )}

                      </div>

                    </div>

                  </MobileSection>

                </div>

                {/* RIGHT */}

                <div
                  className="
                    space-y-4

                    md:col-span-4
                  "
                >

                  {/* QUICK ACTION */}

                  <div
                    className="
                      rounded-3xl

                      border

                      bg-white

                      p-4
                    "
                  >

                    <h3
                      className="
                        text-sm
                        font-semibold

                        text-slate-900
                      "
                    >
                      Quick Actions
                    </h3>

                    <div
                      className="
                        mt-3

                        space-y-2
                      "
                    >

                      {/* EDIT */}

                      <ActionButton
                        label="Edit Lead"
                        onClick={
                          handleEdit
                        }
                      />

                      {/* WHATSAPP */}

                      <ActionButton
                        label="Send WhatsApp"
                        onClick={
                          openWhatsApp
                        }
                      />

                      {/* ACTIVITY */}

                      <ActionButton
                        label="Add Activity"
                        onClick={() => {

                          alert(
                            "Add Activity coming soon"
                          );
                        }}
                      />

                      {/* CONVERT */}

                      <ActionButton
                        label="Convert to Inquiry"
                        onClick={() => {

                          alert(
                            "Convert to Inquiry coming soon"
                          );
                        }}
                      />

                    </div>

                  </div>

                  {/* MATCHES */}

                  <MobileSection
                    title="Suggested Matches"
                    open={
                      mobileSections.matches
                    }
                    onToggle={() =>
                      setMobileSections({
                        ...mobileSections,
                        matches:
                          !mobileSections.matches,
                      })
                    }
                  >

                    <div
                      className="
                        space-y-3
                      "
                    >

                      {propertyMatches.length ===
                      0 ? (

                        <div
                          className="
                            rounded-3xl

                            border

                            bg-white

                            p-4

                            text-sm
                            text-slate-500
                          "
                        >
                          No matching properties
                        </div>

                      ) : (

                        propertyMatches.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={index}
                              className="
                                overflow-hidden

                                rounded-3xl

                                border

                                bg-white
                              "
                            >

                              <div
                                className="
                                  flex
                                  gap-3

                                  p-3
                                "
                              >

                                <div
                                  className="
                                    h-20
                                    w-24

                                    shrink-0

                                    overflow-hidden

                                    rounded-2xl

                                    bg-slate-100
                                  "
                                >

                                  {item
                                    ?.properties
                                    ?.thumbnail_url ? (

                                    <img
                                      src={
                                        item
                                          ?.properties
                                          ?.thumbnail_url
                                      }
                                      alt=""
                                      className="
                                        h-full
                                        w-full

                                        object-cover
                                      "
                                    />

                                  ) : (

                                    <div
                                      className="
                                        flex
                                        h-full
                                        items-center
                                        justify-center
                                      "
                                    >

                                      <Building2
                                        size={
                                          20
                                        }
                                        className="
                                          text-slate-400
                                        "
                                      />

                                    </div>

                                  )}

                                </div>

                                <div
                                  className="
                                    min-w-0
                                    flex-1
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      items-start
                                      justify-between
                                      gap-2
                                    "
                                  >

                                    <h4
                                      className="
                                        line-clamp-2

                                        text-sm
                                        font-semibold

                                        text-slate-900
                                      "
                                    >
                                      {item
                                        ?.properties
                                        ?.title ||
                                        item
                                          ?.properties
                                          ?.property_name}
                                    </h4>

                                    <span
                                      className="
                                        shrink-0

                                        rounded-full

                                        bg-green-100

                                        px-2
                                        py-1

                                        text-xs
                                        font-semibold

                                        text-green-700
                                      "
                                    >
                                      {
                                        item.matching_score
                                      }
                                      %
                                    </span>

                                  </div>

                                  <p
                                    className="
                                      mt-2

                                      text-sm
                                      font-bold

                                      text-slate-900
                                    "
                                  >
                                    Rp{" "}
                                    {Number(
                                      item
                                        ?.properties
                                        ?.price || 0
                                    ).toLocaleString()}
                                  </p>

                                  <p
                                    className="
                                      mt-1

                                      text-xs

                                      text-slate-500
                                    "
                                  >
                                    {
                                      item
                                        ?.properties
                                        ?.district
                                    }
                                    ,{" "}
                                    {
                                      item
                                        ?.properties
                                        ?.city
                                    }
                                  </p>

                                  <button
                                    className="
                                      mt-3

                                      flex
                                      items-center
                                      gap-1

                                      text-sm
                                      font-medium

                                      text-violet-700
                                    "
                                  >

                                    View Detail

                                    <ArrowRight
                                      size={14}
                                    />

                                  </button>

                                </div>

                              </div>

                            </div>

                          )
                        )

                      )}

                    </div>

                  </MobileSection>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

// =========================
// MOBILE SECTION
// =========================

function MobileSection({
  title,
  children,
  open,
  onToggle,
}: any) {

  return (

    <div>

      <button
        onClick={onToggle}
        className="
          mb-3

          flex
          w-full
          items-center
          justify-between
        "
      >

        <h3
          className="
            text-sm
            font-semibold

            text-slate-900
          "
        >
          {title}
        </h3>

        {open ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}

      </button>

      {open && children}

    </div>
  );
}

// =========================
// INFO CARD
// =========================

function InfoCard({
  icon,
  label,
  value,
}: any) {

  return (

    <div
      className="
        rounded-3xl

        border

        bg-white

        p-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <div
          className="
            text-violet-600
          "
        >
          {icon}
        </div>

        <p
          className="
            text-xs
            font-medium

            text-slate-500
          "
        >
          {label}
        </p>

      </div>

      <p
        className="
          mt-3

          text-sm
          font-semibold

          text-slate-900
        "
      >
        {value}
      </p>

    </div>
  );
}

// =========================
// META ITEM
// =========================

function MetaItem({
  icon,
  label,
  value,
}: any) {

  return (

    <div
      className="
        flex
        items-center
        gap-2

        rounded-2xl

        border

        bg-slate-50

        px-3
        py-2
      "
    >

      <div
        className="
          text-slate-500
        "
      >
        {icon}
      </div>

      <div>

        <p
          className="
            text-[11px]

            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className="
            text-xs
            font-medium

            text-slate-900
          "
        >
          {value}
        </p>

      </div>

    </div>
  );
}

// =========================
// ACTION BUTTON
// =========================

function ActionButton({
  label,
  onClick,
}: any) {

  return (

    <button
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-between

        rounded-2xl

        border

        px-4
        py-3

        text-sm
        font-medium

        transition-all

        hover:bg-slate-50
      "
    >

      {label}

      <ArrowRight size={16} />

    </button>
  );
}