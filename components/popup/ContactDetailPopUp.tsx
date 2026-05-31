"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  CalendarClock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Tag,
  User2,
  X,
  Clock3,
  CircleDot,
  Link2,
  StickyNote,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// =========================
// TYPES
// =========================

type ContactDetailPopUpProps = {

  open: boolean;

  data: any;

  onClose: () => void;

  onEdit?: () => void;
};

// =========================
// WHATSAPP UTILS
// =========================

function openWhatsApp(
  phone?: string
) {

  if (!phone) return;

  let cleanPhone = phone
    .replace(/\D/g, "");

  // =========================
  // 08xxx -> 628xxx
  // =========================

  if (
    cleanPhone.startsWith("0")
  ) {

    cleanPhone =
      "62" +
      cleanPhone.slice(1);
  }

  // =========================
  // 8xxx -> 628xxx
  // =========================

  if (
    cleanPhone.startsWith("8")
  ) {

    cleanPhone =
      "62" + cleanPhone;
  }

  // =========================
  // FALLBACK
  // =========================

  if (
    !cleanPhone.startsWith("62")
  ) {

    cleanPhone =
      "62" + cleanPhone;
  }

  window.open(
    `https://wa.me/${cleanPhone}`,
    "_blank"
  );
}

// =========================
// COMPONENT
// =========================

export default function ContactDetailPopUp({

  open,

  data,

  onClose,

  onEdit,
}: ContactDetailPopUpProps) {

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [sourceName, setSourceName] =
    useState("");

  const [leads, setLeads] =
    useState<any[]>([]);

  const [inquiries, setInquiries] =
    useState<any[]>([]);

  const [activities, setActivities] =
    useState<any[]>([]);

  // =========================
  // FETCH SOURCE
  // =========================

  async function fetchSource() {

    try {

      if (
        !data?.source_id
      ) {

        setSourceName("");

        return;
      }

      const {
        data: sourceData,
        error,
      } = await supabase

        .from("sources")

        .select(`
          source_name
        `)

        .eq(
          "source_id",
          data.source_id
        )

        .single();

      if (error) {

        console.log(error);

        return;
      }

      setSourceName(
        sourceData?.source_name || ""
      );

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // FETCH LEADS
  // =========================

  async function fetchLeads() {

    try {

      const {
        data: leadsData,
        error,
      } = await supabase

        .from("leads")

        .select(`
          *
        `)

        .eq(
          "contact_id",
          data.contact_id
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {

        console.log(error);

        return;
      }

      setLeads(
        leadsData || []
      );

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // FETCH INQUIRIES
  // =========================

  async function fetchInquiries() {

    try {

      const {
        data: inquiryData,
        error,
      } = await supabase

        .from("inquiries")

        .select(`
          *
        `)

        .eq(
          "contact_id",
          data.contact_id
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {

        console.log(error);

        return;
      }

      setInquiries(
        inquiryData || []
      );

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // FETCH ACTIVITIES
  // =========================

  async function fetchActivities() {

    try {

      const {
        data: activitiesData,
        error,
      } = await supabase

        .from("activities")

        .select(`
          *
        `)

        .eq(
          "contact_id",
          data.contact_id
        )

        .order(
          "activity_date",
          {
            ascending: false,
          }
        )

        .limit(10);

      if (error) {

        console.log(error);

        return;
      }

      setActivities(
        activitiesData || []
      );

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // INITIAL
  // =========================

  useEffect(() => {

    if (
      open &&
      data?.contact_id
    ) {

      handleInitialFetch();
    }

  }, [open, data]);

  // =========================
  // INITIAL FETCH
  // =========================

  async function handleInitialFetch() {

    try {

      setLoading(true);

      await Promise.all([

        fetchSource(),

        fetchLeads(),

        fetchInquiries(),

        fetchActivities(),
      ]);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // HIDE
  // =========================

  if (!open || !data)
    return null;

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
          max-h-[92vh]
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
            items-start
            justify-between
            gap-4
          "
        >

          <div className="space-y-4">

            {/* NAME */}

            <div>

              <h2
                className="
                  text-3xl
                  font-bold
                "
              >
                {data.name || "-"}
              </h2>

            </div>

            {/* BADGES */}

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >

              {data.contact_type && (

                <Badge
                  text={
                    data.contact_type
                  }
                  bg="bg-blue-100"
                  textColor="text-blue-700"
                />

              )}

              {data.priority && (

                <Badge
                  text={
                    data.priority
                  }
                  bg="bg-orange-100"
                  textColor="text-orange-700"
                />

              )}

              {data.status && (

                <Badge
                  text={
                    data.status
                  }
                  bg="bg-green-100"
                  textColor="text-green-700"
                />

              )}

              {data.company && (

                <Badge
                  text={
                    data.company
                  }
                  bg="bg-gray-100"
                  textColor="text-gray-700"
                />

              )}

            </div>

          </div>

          {/* CLOSE */}

          <button
            onClick={onClose}
            className="
              text-gray-500
              hover:text-black
            "
          >

            <X size={24} />

          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-6">

          {/* CONTACT INFORMATION */}

          <SectionCard
            title="Contact Information"
          >

            <InfoRow
              icon={
                <Phone size={18} />
              }
              label="Phone"
              value={
                data.phone || "-"
              }
            />

            <InfoRow
              icon={
                <Mail size={18} />
              }
              label="Email"
              value={
                data.email || "-"
              }
            />

            <InfoRow
              icon={
                <Building2 size={18} />
              }
              label="Company"
              value={
                data.company || "-"
              }
            />

            <InfoRow
              icon={
                <User2 size={18} />
              }
              label="Role"
              value={
                data.role || "-"
              }
            />

            <InfoRow
              icon={
                <MapPin size={18} />
              }
              label="Address"
              value={
                data.contact_address || "-"
              }
            />

          </SectionCard>

          {/* SOURCE */}

          <SectionCard
            title="Source Information"
          >

            <InfoRow
              icon={
                <Tag size={18} />
              }
              label="Source"
              value={
                loading
                  ? "Loading..."
                  : sourceName || "-"
              }
            />

          </SectionCard>

          {/* FOLLOWUP */}

          <SectionCard
            title="Follow Up Information"
          >

            <InfoRow
              icon={
                <CalendarClock size={18} />
              }
              label="Last Follow Up"
              value={
                data.last_followup_at

                  ? new Date(
                      data.last_followup_at
                    ).toLocaleString()

                  : "-"
              }
            />

            <InfoRow
              icon={
                <CalendarClock size={18} />
              }
              label="Next Follow Up"
              value={
                data.next_followup_at

                  ? new Date(
                      data.next_followup_at
                    ).toLocaleString()

                  : "-"
              }
            />

            <InfoRow
              icon={
                <Clock3 size={18} />
              }
              label="Last WhatsApp Opened"
              value={
                data.last_whatsapp_opened_at

                  ? new Date(
                      data.last_whatsapp_opened_at
                    ).toLocaleString()

                  : "-"
              }
            />

          </SectionCard>

          {/* SUMMARY */}

          <SectionCard
            title="Summary"
          >

            <div
              className="
                text-sm
                leading-7
                whitespace-pre-line
              "
            >
              {data.summary || "-"}
            </div>

          </SectionCard>

          {/* NOTES */}

          <SectionCard
            title="Notes"
          >

            <div
              className="
                text-sm
                leading-7
                whitespace-pre-line
              "
            >
              {data.notes || "-"}
            </div>

          </SectionCard>

          {/* TAGS */}

          <SectionCard
            title="Tags"
          >

            <div
              className="
                text-sm
                leading-7
              "
            >
              {data.tags || "-"}
            </div>

          </SectionCard>

          {/* LEADS */}

          <SectionCard
            title={`Leads (${leads.length})`}
          >

            {leads.length === 0 ? (

              <EmptyState
                text="No leads found"
              />

            ) : (

              <div className="space-y-3">

                {leads.map(
                  (item) => (

                    <div
                      key={
                        item.lead_id
                      }
                      className="
                        border
                        rounded-2xl
                        p-4
                        space-y-2
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >

                        <div
                          className="
                            font-semibold
                          "
                        >
                          {
                            item.requirements ||
                            "Lead"
                          }
                        </div>

                        <Badge
                          text={
                            item.priority || "-"
                          }
                          bg="bg-orange-100"
                          textColor="text-orange-700"
                        />

                      </div>

                      <div
                        className="
                          text-sm
                          text-gray-600
                        "
                      >
                        {item.city || "-"}
                        {" • "}
                        {item.district || "-"}
                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </SectionCard>

          {/* INQUIRIES */}

          <SectionCard
            title={`Inquiries (${inquiries.length})`}
          >

            {inquiries.length === 0 ? (

              <EmptyState
                text="No inquiries found"
              />

            ) : (

              <div className="space-y-3">

                {inquiries.map(
                  (item) => (

                    <div
                      key={
                        item.inquiry_id
                      }
                      className="
                        border
                        rounded-2xl
                        p-4
                        space-y-2
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div
                          className="
                            font-semibold
                          "
                        >
                          Inquiry #
                          {
                            item.inquiry_id
                          }
                        </div>

                        <Badge
                          text={
                            item.status || "Active"
                          }
                          bg="bg-blue-100"
                          textColor="text-blue-700"
                        />

                      </div>

                      <div
                        className="
                          text-sm
                          text-gray-600
                        "
                      >
                        {item.notes || "-"}
                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </SectionCard>

          {/* ACTIVITIES */}

          <SectionCard
            title={`Recent Activities (${activities.length})`}
          >

            {activities.length === 0 ? (

              <EmptyState
                text="No activities found"
              />

            ) : (

              <div className="space-y-3">

                {activities.map(
                  (item) => (

                    <div
                      key={
                        item.activity_id
                      }
                      className="
                        border
                        rounded-2xl
                        p-4
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <div
                        className="
                          mt-1
                          text-gray-500
                        "
                      >
                        <CircleDot
                          size={16}
                        />
                      </div>

                      <div className="space-y-1">

                        <div
                          className="
                            font-medium
                          "
                        >
                          {
                            item.title || "-"
                          }
                        </div>

                        <div
                          className="
                            text-sm
                            text-gray-600
                          "
                        >
                          {
                            item.notes || "-"
                          }
                        </div>

                        <div
                          className="
                            text-xs
                            text-gray-400
                          "
                        >
                          {item.activity_date

                            ? new Date(
                                item.activity_date
                              ).toLocaleString()

                            : "-"}
                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </SectionCard>

          {/* SYSTEM */}

          <SectionCard
            title="System Information"
          >

            <InfoRow
              icon={
                <FileText size={18} />
              }
              label="Created At"
              value={
                data.created_at

                  ? new Date(
                      data.created_at
                    ).toLocaleString()

                  : "-"
              }
            />

            <InfoRow
              icon={
                <FileText size={18} />
              }
              label="Updated At"
              value={
                data.updated_at

                  ? new Date(
                      data.updated_at
                    ).toLocaleString()

                  : "-"
              }
            />

            <InfoRow
              icon={
                <Link2 size={18} />
              }
              label="Contact ID"
              value={
                data.contact_id || "-"
              }
            />

          </SectionCard>

        </div>

        {/* FOOTER */}

        <div
          className="
            border-t
            p-6
            flex
            flex-wrap
            justify-end
            gap-3
          "
        >

          {/* WHATSAPP */}

          <button
            onClick={() =>
              openWhatsApp(
                data.phone
              )
            }
            className="
              flex
              items-center
              gap-2
              bg-green-600
              hover:bg-green-700
              text-white
              px-5
              py-3
              rounded-xl
              font-medium
            "
          >

            <MessageCircle
              size={18}
            />

            Chat WhatsApp

          </button>

          {/* EDIT */}

          <button
            onClick={onEdit}
            className="
              flex
              items-center
              gap-2
              border
              hover:bg-gray-100
              px-5
              py-3
              rounded-xl
              font-medium
            "
          >

            <Pencil
              size={18}
            />

            Edit Contact

          </button>

        </div>

      </div>

    </div>
  );
}

// =========================
// SECTION CARD
// =========================

function SectionCard({
  title,
  children,
}: any) {

  return (

    <div
      className="
        border
        rounded-2xl
        p-5
        space-y-4
      "
    >

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
// INFO ROW
// =========================

function InfoRow({
  icon,
  label,
  value,
}: any) {

  return (

    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      <div
        className="
          text-gray-500
          mt-1
        "
      >
        {icon}
      </div>

      <div>

        <div
          className="
            text-xs
            text-gray-500
          "
        >
          {label}
        </div>

        <div
          className="
            font-medium
            whitespace-pre-line
          "
        >
          {value}
        </div>

      </div>

    </div>
  );
}

// =========================
// BADGE
// =========================

function Badge({
  text,
  bg,
  textColor,
}: any) {

  return (

    <span
      className={`
        ${bg}
        ${textColor}
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
      `}
    >
      {text}
    </span>
  );
}

// =========================
// EMPTY STATE
// =========================

function EmptyState({
  text,
}: any) {

  return (

    <div
      className="
        border
        border-dashed
        rounded-2xl
        p-6
        text-center
        text-sm
        text-gray-500
      "
    >
      {text}
    </div>
  );
}