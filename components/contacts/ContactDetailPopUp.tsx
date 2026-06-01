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
  Phone,
  Tag,
  User2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import DetailDrawer from "@/components/detail/DetailDrawer";
import DetailHeader from "@/components/detail/DetailHeader";
import DetailBody from "@/components/detail/DetailBody";
import DetailFooter from "@/components/detail/DetailFooter";

import ResponsiveSection from "@/components/sections/ResponsiveSection";

import ActivityItem from "@/components/cards/ActivityItem";
import CompactCard from "@/components/cards/CompactCard";
import SnapshotCard from "@/components/cards/SnapshotCard";

import Badge from "@/components/ui/Badge";
import ActionButton from "@/components/ui/ActionButton";
import EmptyState from "@/components/ui/EmptyState";

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
// WHATSAPP
// =========================

function openWhatsApp(
  phone?: string
) {
  if (!phone) return;

  let cleanPhone =
    phone.replace(
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
      "62" + cleanPhone;
  }

  if (
    !cleanPhone.startsWith(
      "62"
    )
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
      } = await supabase
        .from("sources")
        .select(
          "source_name"
        )
        .eq(
          "source_id",
          data.source_id
        )
        .single();

      setSourceName(
        sourceData?.source_name ||
          ""
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
      } = await supabase
        .from("leads")
        .select("*")
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
      } = await supabase
        .from("inquiries")
        .select("*")
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
        data:
          activitiesData,
      } = await supabase
        .from("activities")
        .select("*")
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

      setActivities(
        activitiesData ||
          []
      );
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {
    if (
      open &&
      data?.contact_id
    ) {
      handleInitialFetch();
    }
  }, [open, data]);

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

  // =========================
  // RENDER
  // =========================

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      showCloseButton={
        false
      }
    >
      {/* HEADER */}

      <DetailHeader
        title={
          data.name || "-"
        }
        subtitle={
          data.company ||
          "Contact Detail"
        }
        avatarName={
          data.name
        }
        onClose={onClose}
        badges={
          <>
            {data.priority && (
              <Badge
                text={
                  data.priority
                }
                variant="warning"
              />
            )}

            {data.status && (
              <Badge
                text={
                  data.status
                }
                variant="success"
              />
            )}

            {data.contact_type && (
              <Badge
                text={
                  data.contact_type
                }
                variant="info"
              />
            )}
          </>
        }
      />

      {/* BODY */}

      <DetailBody
        sidebar={
          <>
            {/* SNAPSHOT */}

            <ResponsiveSection
              title="Snapshot"
              icon={
                <CalendarClock
                  size={16}
                />
              }
            >
              <div
                className="
                  grid
                  grid-cols-2

                  gap-3
                "
              >
                <SnapshotCard
                  compact
                  label="Leads"
                  value={
                    leads.length
                  }
                />

                <SnapshotCard
                  compact
                  label="Inquiries"
                  value={
                    inquiries.length
                  }
                />

                <SnapshotCard
                  compact
                  label="Activities"
                  value={
                    activities.length
                  }
                />

                <SnapshotCard
                  compact
                  label="Source"
                  value={
                    sourceName ||
                    "-"
                  }
                />
              </div>
            </ResponsiveSection>

            {/* CONTACT INFO */}

            <ResponsiveSection
              title="Contact Information"
              icon={
                <Phone
                  size={16}
                />
              }
            >
              <div className="space-y-4">
                <InfoItem
                  icon={
                    <Phone
                      size={16}
                    />
                  }
                  label="Phone"
                  value={
                    data.phone ||
                    "-"
                  }
                />

                <InfoItem
                  icon={
                    <Mail
                      size={16}
                    />
                  }
                  label="Email"
                  value={
                    data.email ||
                    "-"
                  }
                />

                <InfoItem
                  icon={
                    <Building2
                      size={16}
                    />
                  }
                  label="Company"
                  value={
                    data.company ||
                    "-"
                  }
                />

                <InfoItem
                  icon={
                    <User2
                      size={16}
                    />
                  }
                  label="Role"
                  value={
                    data.role ||
                    "-"
                  }
                />

                <InfoItem
                  icon={
                    <MapPin
                      size={16}
                    />
                  }
                  label="Address"
                  value={
                    data.contact_address ||
                    "-"
                  }
                />
              </div>
            </ResponsiveSection>

            {/* NOTES */}

            <ResponsiveSection
              title="Notes"
              icon={
                <FileText
                  size={16}
                />
              }
              defaultOpen={
                false
              }
            >
              {data.notes ? (
                <div
                  className="
                    text-sm

                    text-slate-700

                    whitespace-pre-line

                    leading-7
                  "
                >
                  {data.notes}
                </div>
              ) : (
                <EmptyState
                  title="No notes"
                  size="sm"
                />
              )}
            </ResponsiveSection>

            {/* SYSTEM */}

            <ResponsiveSection
              title="System Information"
              icon={
                <Tag
                  size={16}
                />
              }
              defaultOpen={
                false
              }
            >
              <div className="space-y-4">
                <InfoItem
                  label="Created"
                  value={
                    data.created_at
                      ? new Date(
                          data.created_at
                        ).toLocaleString()
                      : "-"
                  }
                />

                <InfoItem
                  label="Updated"
                  value={
                    data.updated_at
                      ? new Date(
                          data.updated_at
                        ).toLocaleString()
                      : "-"
                  }
                />
              </div>
            </ResponsiveSection>
          </>
        }
      >
        {/* SUMMARY */}

        <ResponsiveSection
          title="Relationship Summary"
          icon={
            <User2
              size={16}
            />
          }
        >
          {data.summary ? (
            <div
              className="
                rounded-2xl

                bg-amber-50

                border
                border-amber-100

                p-4

                text-sm

                text-slate-700

                leading-7

                whitespace-pre-line
              "
            >
              {data.summary}
            </div>
          ) : (
            <EmptyState
              title="No summary"
              size="sm"
            />
          )}
        </ResponsiveSection>

        {/* PIPELINE */}

        <ResponsiveSection
          title="Pipeline"
          icon={
            <Building2
              size={16}
            />
          }
        >
          <div className="space-y-3">
            {/* LEADS */}

            <div>
              <div
                className="
                  mb-2

                  text-xs

                  font-semibold

                  uppercase

                  text-slate-400
                "
              >
                Leads
              </div>

              {leads.length ===
              0 ? (
                <EmptyState
                  title="No leads"
                  size="sm"
                />
              ) : (
                <div className="space-y-3">
                  {leads.map(
                    (
                      item
                    ) => (
                      <CompactCard
                        key={
                          item.lead_id
                        }
                        title={
                          item.requirements ||
                          "Lead"
                        }
                        subtitle={`${item.city || "-"} • ${item.district || "-"}`}
                        badge={
                          item.priority
                        }
                        badgeVariant="warning"
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* INQUIRIES */}

            <div>
              <div
                className="
                  mb-2
                  mt-5

                  text-xs

                  font-semibold

                  uppercase

                  text-slate-400
                "
              >
                Inquiries
              </div>

              {inquiries.length ===
              0 ? (
                <EmptyState
                  title="No inquiries"
                  size="sm"
                />
              ) : (
                <div className="space-y-3">
                  {inquiries.map(
                    (
                      item
                    ) => (
                      <CompactCard
                        key={
                          item.inquiry_id
                        }
                        title={`Inquiry #${item.inquiry_id}`}
                        description={
                          item.notes ||
                          "-"
                        }
                        badge={
                          item.status
                        }
                        badgeVariant="info"
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </ResponsiveSection>

        {/* ACTIVITIES */}

        <ResponsiveSection
          title="Recent Activities"
          icon={
            <CalendarClock
              size={16}
            />
          }
        >
          {activities.length ===
          0 ? (
            <EmptyState
              title="No activities"
              description="Activities will appear here."
            />
          ) : (
            <div className="space-y-3">
              {activities.map(
                (item) => (
                  <ActivityItem
                    key={
                      item.activity_id
                    }
                    title={
                      item.title ||
                      "-"
                    }
                    description={
                      item.notes ||
                      "-"
                    }
                    date={
                      item.activity_date
                        ? new Date(
                            item.activity_date
                          ).toLocaleString()
                        : "-"
                    }
                  />
                )
              )}
            </div>
          )}
        </ResponsiveSection>
      </DetailBody>

      {/* FOOTER */}

      <DetailFooter>
        <ActionButton
          variant="success"
          icon={
            <MessageCircle
              size={16}
            />
          }
          onClick={() =>
            openWhatsApp(
              data.phone
            )
          }
        >
          WhatsApp
        </ActionButton>

        <ActionButton
          variant="secondary"
          onClick={onEdit}
        >
          Edit
        </ActionButton>
      </DetailFooter>
    </DetailDrawer>
  );
}

// =========================
// INFO ITEM
// =========================

function InfoItem({
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
      {/* ICON */}

      {icon && (
        <div
          className="
            mt-0.5

            text-slate-400

            shrink-0
          "
        >
          {icon}
        </div>
      )}

      {/* CONTENT */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <div
          className="
            text-xs

            uppercase

            tracking-wide

            text-slate-400
          "
        >
          {label}
        </div>

        <div
          className="
            mt-1

            text-sm

            text-slate-800

            break-words
          "
        >
          {value}
        </div>
      </div>
    </div>
  );
}