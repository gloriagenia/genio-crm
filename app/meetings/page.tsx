"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";

import Badge from "@/components/ui/Badge";
import ActionButton from "@/components/ui/ActionButton";

import DetailDrawer from "@/components/detail/DetailDrawer";
import DetailHeader from "@/components/detail/DetailHeader";
import DetailBody from "@/components/detail/DetailBody";
import DetailFooter from "@/components/detail/DetailFooter";

import ResponsiveSection from "@/components/sections/ResponsiveSection";

import CompactCard from "@/components/cards/CompactCard";
import SnapshotCard from "@/components/cards/SnapshotCard";

// =========================
// MOCK DATA
// =========================

const meetingsData = [
  {
    id: 1,

    title:
      "Viewing Rumah Tebet",

    type: "Viewing",

    status: "Confirmed",

    time: "09:00 - 10:00",

    date: "23 Mei 2026",

    contact:
      "Budi Santoso",

    property:
      "Rumah Tebet",

    location:
      "Jl. Tebet Timur No. 45",

    notes:
      "Client tertarik dengan area living room dan taman belakang.",

    price: "Rp 2.1 M",
  },

  {
    id: 2,

    title:
      "Survey Apartemen Kuningan",

    type: "Survey",

    status: "Confirmed",

    time: "11:00 - 12:00",

    date: "23 Mei 2026",

    contact:
      "Dewi Lestari",

    property:
      "Apartemen Kuningan",

    location:
      "Kuningan City",

    notes:
      "Client mencari unit fully furnished.",

    price: "Rp 1.8 M",
  },

  {
    id: 3,

    title:
      "Follow-up Nego Harga",

    type: "Follow-up",

    status: "Scheduled",

    time: "14:00 - 15:00",

    date: "23 Mei 2026",

    contact:
      "Andi Wijaya",

    property:
      "Rumah Bintaro",

    location:
      "Phone Call",

    notes:
      "Masih nego harga final.",

    price: "Rp 2.5 M",
  },
];

// =========================
// PAGE
// =========================

export default function MeetingsPage() {
  // =========================
  // STATES
  // =========================

  const [
    selectedMeeting,
    setSelectedMeeting,
  ] = useState<any>(null);

  const [
    openDrawer,
    setOpenDrawer,
  ] = useState(false);

  // =========================
  // SUMMARY
  // =========================

  const summary =
    useMemo(() => {
      return {
        today:
          meetingsData.length,

        confirmed:
          meetingsData.filter(
            (item) =>
              item.status ===
              "Confirmed"
          ).length,

        scheduled:
          meetingsData.filter(
            (item) =>
              item.status ===
              "Scheduled"
          ).length,
      };
    }, []);

  // =========================
  // OPEN DETAIL
  // =========================

  function handleOpenDetail(
    meeting: any
  ) {
    setSelectedMeeting(
      meeting
    );

    setOpenDrawer(true);
  }

  // =========================
  // RENDER
  // =========================

  return (
    <MainLayout>
      <div
        className="
          min-h-screen

          bg-slate-50

          p-4
          xl:p-6
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            xl:flex-row

            xl:items-center
            xl:justify-between

            gap-4

            mb-5
          "
        >
          {/* LEFT */}

          <div>
            <h1
              className="
                text-2xl
                xl:text-3xl

                font-bold

                text-slate-900
              "
            >
              Meetings
            </h1>

            <div
              className="
                text-sm

                text-slate-500

                mt-1
              "
            >
              Kelola semua
              jadwal meeting
              properti Anda
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              items-center

              gap-2
            "
          >
            <ActionButton
              variant="secondary"
              icon={
                <ChevronLeft
                  size={16}
                />
              }
            />

            <ActionButton
              variant="secondary"
              icon={
                <ChevronRight
                  size={16}
                />
              }
            />

            <ActionButton
              variant="primary"
              icon={
                <Plus
                  size={16}
                />
              }
            >
              New Meeting
            </ActionButton>
          </div>
        </div>

        {/* SUMMARY */}

        <div
          className="
            grid
            grid-cols-2
            xl:grid-cols-4

            gap-3

            mb-5
          "
        >
          <SnapshotCard
            label="Meeting Hari Ini"
            value={
              summary.today
            }
            icon={
              <CalendarDays
                size={16}
              />
            }
          />

          <SnapshotCard
            label="Confirmed"
            value={
              summary.confirmed
            }
            variant="success"
            icon={
              <CheckCircle2
                size={16}
              />
            }
          />

          <SnapshotCard
            label="Scheduled"
            value={
              summary.scheduled
            }
            variant="warning"
            icon={
              <Clock3
                size={16}
              />
            }
          />

          <SnapshotCard
            label="Upcoming"
            value="12"
            variant="info"
            icon={
              <CalendarDays
                size={16}
              />
            }
          />
        </div>

        {/* BODY */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-[320px_1fr]

            gap-4
          "
        >
          {/* SIDEBAR */}

          <div
            className="
              space-y-4
            "
          >
            {/* SEARCH */}

            <ResponsiveSection
              title="Search"
            >
              <div
                className="
                  relative
                "
              >
                <Search
                  size={16}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2

                    text-slate-400
                  "
                />

                <input
                  placeholder="Cari meeting..."
                  className="
                    w-full

                    h-11

                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    pl-10
                    pr-4

                    text-sm

                    outline-none

                    focus:border-blue-500
                  "
                />
              </div>
            </ResponsiveSection>

            {/* FILTER */}

            <ResponsiveSection
              title="Filter"
            >
              <div className="space-y-3">
                <select
                  className="
                    w-full

                    h-11

                    rounded-xl

                    border
                    border-slate-200

                    px-3

                    text-sm
                  "
                >
                  <option>
                    Semua Status
                  </option>
                </select>

                <select
                  className="
                    w-full

                    h-11

                    rounded-xl

                    border
                    border-slate-200

                    px-3

                    text-sm
                  "
                >
                  <option>
                    Semua Tipe
                  </option>
                </select>
              </div>
            </ResponsiveSection>
          </div>

          {/* MEETING LIST */}

          <div
            className="
              space-y-4
            "
          >
            <ResponsiveSection
              title="Today's Agenda"
            >
              <div className="space-y-3">
                {meetingsData.map(
                  (
                    item
                  ) => (
                    <CompactCard
                      key={
                        item.id
                      }
                      clickable
                      onClick={() =>
                        handleOpenDetail(
                          item
                        )
                      }
                      title={
                        item.title
                      }
                      subtitle={`${item.contact} • ${item.location}`}
                      description={`${item.time} • ${item.property}`}
                      badge={
                        item.status
                      }
                      badgeVariant={
                        item.status ===
                        "Confirmed"
                          ? "success"
                          : "warning"
                      }
                      rightContent={
                        <div
                          className="
                            text-xs

                            text-slate-400
                          "
                        >
                          {
                            item.time
                          }
                        </div>
                      }
                    />
                  )
                )}
              </div>
            </ResponsiveSection>
          </div>
        </div>

        {/* DETAIL DRAWER */}

        <DetailDrawer
          open={openDrawer}
          onClose={() =>
            setOpenDrawer(
              false
            )
          }
        >
          {selectedMeeting && (
            <>
              <DetailHeader
                title={
                  selectedMeeting.title
                }
                subtitle={`${selectedMeeting.contact} • ${selectedMeeting.property}`}
                onClose={() =>
                  setOpenDrawer(
                    false
                  )
                }
                badges={
                  <Badge
                    text={
                      selectedMeeting.status
                    }
                    variant={
                      selectedMeeting.status ===
                      "Confirmed"
                        ? "success"
                        : "warning"
                    }
                  />
                }
              />

              <DetailBody>
                {/* INFO */}

                <ResponsiveSection
                  title="Meeting Information"
                >
                  <div className="space-y-4">
                    <InfoRow
                      label="Date"
                      value={
                        selectedMeeting.date
                      }
                    />

                    <InfoRow
                      label="Time"
                      value={
                        selectedMeeting.time
                      }
                    />

                    <InfoRow
                      label="Location"
                      value={
                        selectedMeeting.location
                      }
                    />

                    <InfoRow
                      label="Type"
                      value={
                        selectedMeeting.type
                      }
                    />
                  </div>
                </ResponsiveSection>

                {/* CONTACT */}

                <ResponsiveSection
                  title="Contact"
                >
                  <CompactCard
                    title={
                      selectedMeeting.contact
                    }
                    subtitle="Buyer"
                  />
                </ResponsiveSection>

                {/* PROPERTY */}

                <ResponsiveSection
                  title="Property"
                >
                  <CompactCard
                    title={
                      selectedMeeting.property
                    }
                    subtitle={
                      selectedMeeting.price
                    }
                    description={
                      selectedMeeting.location
                    }
                  />
                </ResponsiveSection>

                {/* NOTES */}

                <ResponsiveSection
                  title="Notes"
                >
                  <div
                    className="
                      text-sm

                      text-slate-700

                      leading-7
                    "
                  >
                    {
                      selectedMeeting.notes
                    }
                  </div>
                </ResponsiveSection>
              </DetailBody>

              {/* FOOTER */}

              <DetailFooter>
                <ActionButton
                  fullWidth
                  variant="success"
                  icon={
                    <MessageCircle
                      size={16}
                    />
                  }
                >
                  WhatsApp
                </ActionButton>

                <ActionButton
                  fullWidth
                  variant="primary"
                  icon={
                    <MapPin
                      size={16}
                    />
                  }
                >
                  Open Maps
                </ActionButton>
              </DetailFooter>
            </>
          )}
        </DetailDrawer>
      </div>
    </MainLayout>
  );
}

// =========================
// INFO ROW
// =========================

function InfoRow({
  label,
  value,
}: any) {
  return (
    <div>
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
        "
      >
        {value}
      </div>
    </div>
  );
}