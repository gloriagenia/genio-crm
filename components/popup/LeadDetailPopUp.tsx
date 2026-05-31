"use client";

import {
  AlertTriangle,
  Building2,
  CalendarClock,
  Clock3,
  DollarSign,
  MapPin,
  Phone,
  Tag,
  User2,
  X,
} from "lucide-react";

type LeadDetailPopUpProps = {
  open: boolean;

  data: any;

  onClose: () => void;
};

export default function LeadDetailPopUp({
  open,
  data,
  onClose,
}: LeadDetailPopUpProps) {

  // =========================
  // HIDE
  // =========================

  if (!open || !data)
    return null;

  // =========================
  // FORMAT CURRENCY
  // =========================

  function formatCurrency(
    value?: number
  ) {

    if (!value) return "-";

    return `Rp ${new Intl.NumberFormat(
      "id-ID"
    ).format(value)}`;
  }

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(
    value?: string
  ) {

    if (!value) return "-";

    return new Date(
      value
    ).toLocaleString(
      "id-ID"
    );
  }

  // =========================
  // AGING
  // =========================

  function calculateAging() {

    if (!data.last_contact)
      return "-";

    const today =
      new Date();

    const lastContact =
      new Date(
        data.last_contact
      );

    const diff =
      today.getTime() -
      lastContact.getTime();

    const days =
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );

    return `${days} Days`;
  }

  // =========================
  // SLA STATUS
  // =========================

  function getSLAStatus() {

    if (!data.last_contact) {

      return {

        text:
          "No Follow Up",

        className:
          "bg-red-100 text-red-700",
      };
    }

    const today =
      new Date();

    const lastContact =
      new Date(
        data.last_contact
      );

    const diff =
      today.getTime() -
      lastContact.getTime();

    const days =
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );

    if (days <= 1) {

      return {

        text: "Good",

        className:
          "bg-green-100 text-green-700",
      };
    }

    if (days <= 3) {

      return {

        text:
          "Warning",

        className:
          "bg-yellow-100 text-yellow-700",
      };
    }

    return {

      text:
        "Over SLA",

      className:
        "bg-red-100 text-red-700",
    };
  }

  const sla =
    getSLAStatus();

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
          max-w-6xl
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
            items-start
            justify-between
            gap-4
          "
        >

          <div className="space-y-3">

            <div>

              <h2
                className="
                  text-3xl
                  font-bold
                "
              >
                Lead Detail
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Complete lead information
              </p>

            </div>

            {/* BADGES */}

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >

              {data.priority && (

                <Badge
                  text={
                    data.priority
                  }
                  bg="bg-orange-100"
                  textColor="text-orange-700"
                />

              )}

              {data.market_type && (

                <Badge
                  text={
                    data.market_type
                  }
                  bg="bg-blue-100"
                  textColor="text-blue-700"
                />

              )}

              {data.lead_statuses
                ?.lead_status_name && (

                <Badge
                  text={
                    data
                      .lead_statuses
                      ?.lead_status_name
                  }
                  bg="bg-green-100"
                  textColor="text-green-700"
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

            <X size={26} />

          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-6">

          {/* SUMMARY */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
            "
          >

            {/* PRIORITY */}

            <SummaryCard
              title="Priority"
              value={
                data.priority ||
                "-"
              }
            />

            {/* AGING */}

            <SummaryCard
              title="Aging Leads"
              value={
                calculateAging()
              }
            />

            {/* SLA */}

            <div
              className="
                border
                rounded-2xl
                p-5
                space-y-3
              "
            >

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                SLA Status
              </div>

              <div>

                <span
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    px-3
                    py-1
                    text-sm
                    font-semibold

                    ${sla.className}
                  `}
                >
                  {sla.text}
                </span>

              </div>

            </div>

          </div>

          {/* CONTACT */}

          <SectionCard
            title="Contact Information"
          >

            <InfoRow
              icon={
                <User2 size={18} />
              }
              label="Contact Name"
              value={
                data.contacts
                  ?.name || "-"
              }
            />

            <InfoRow
              icon={
                <Phone size={18} />
              }
              label="Phone"
              value={
                data.contacts
                  ?.phone || "-"
              }
            />

            <InfoRow
              icon={
                <Tag size={18} />
              }
              label="Lead Status"
              value={
                data
                  .lead_statuses
                  ?.lead_status_name ||
                "-"
              }
            />

            <InfoRow
              icon={
                <Tag size={18} />
              }
              label="Source"
              value={
                data.sources
                  ?.source_name ||
                "-"
              }
            />

          </SectionCard>

          {/* PROPERTY */}

          <SectionCard
            title="Property Requirement"
          >

            <InfoRow
              icon={
                <Building2 size={18} />
              }
              label="Property Type"
              value={
                data
                  .property_type
                  ?.property_type_name ||

                data.property_type_id ||

                "-"
              }
            />

            <InfoRow
              icon={
                <Tag size={18} />
              }
              label="Market Type"
              value={
                data.market_type ||
                "-"
              }
            />

            <InfoRow
              icon={
                <MapPin size={18} />
              }
              label="District"
              value={
                data.district ||
                "-"
              }
            />

            <InfoRow
              icon={
                <MapPin size={18} />
              }
              label="City"
              value={
                data.city || "-"
              }
            />

            <InfoRow
              icon={
                <DollarSign size={18} />
              }
              label="Budget Min"
              value={formatCurrency(
                data.budget_min
              )}
            />

            <InfoRow
              icon={
                <DollarSign size={18} />
              }
              label="Budget Max"
              value={formatCurrency(
                data.budget_max
              )}
            />

            <InfoRow
              icon={
                <Building2 size={18} />
              }
              label="Land Size Min"
              value={
                data.land_size_min
                  ? `${data.land_size_min} m²`
                  : "-"
              }
            />

            <InfoRow
              icon={
                <Building2 size={18} />
              }
              label="Building Size Min"
              value={
                data.building_size_min
                  ? `${data.building_size_min} m²`
                  : "-"
              }
            />

            <InfoRow
              icon={
                <Clock3 size={18} />
              }
              label="Timeline"
              value={
                data.timeline ||
                "-"
              }
            />

          </SectionCard>

          {/* FOLLOW UP */}

          <SectionCard
            title="Follow Up Information"
          >

            <InfoRow
              icon={
                <CalendarClock size={18} />
              }
              label="Last Contact"
              value={formatDate(
                data.last_contact
              )}
            />

            <InfoRow
              icon={
                <CalendarClock size={18} />
              }
              label="Next Follow Up"
              value={formatDate(
                data.next_followup
              )}
            />

            <InfoRow
              icon={
                <CalendarClock size={18} />
              }
              label="Created At"
              value={formatDate(
                data.created_at
              )}
            />

            <InfoRow
              icon={
                <CalendarClock size={18} />
              }
              label="Updated At"
              value={formatDate(
                data.updated_at
              )}
            />

          </SectionCard>

          {/* REQUIREMENTS */}

          <SectionCard
            title="Requirements"
          >

            <div
              className="
                whitespace-pre-wrap
                text-sm
                leading-7
                text-gray-700
              "
            >
              {data.requirements ||
                "-"}
            </div>

          </SectionCard>

          {/* LOST REASON */}

          {data.lost_reason && (

            <div
              className="
                border
                border-red-200
                bg-red-50
                rounded-2xl
                p-5
                space-y-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <AlertTriangle
                  size={18}
                  className="
                    text-red-700
                  "
                />

                <h3
                  className="
                    font-semibold
                    text-lg
                    text-red-700
                  "
                >
                  Lost Reason
                </h3>

              </div>

              <div
                className="
                  whitespace-pre-wrap
                  text-sm
                  leading-7
                  text-red-700
                "
              >
                {
                  data.lost_reason
                }
              </div>

            </div>

          )}

        </div>

        {/* FOOTER */}

        <div
          className="
            border-t
            p-6
            flex
            justify-end
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
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

// =========================
// SUMMARY CARD
// =========================

function SummaryCard({
  title,
  value,
}: any) {

  return (

    <div
      className="
        border
        rounded-2xl
        p-5
        space-y-3
      "
    >

      <div
        className="
          text-sm
          text-gray-500
        "
      >
        {title}
      </div>

      <div
        className="
          text-xl
          font-bold
        "
      >
        {value}
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
        space-y-5
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

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        "
      >

        {children}

      </div>

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

      <div className="space-y-1">

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
            break-words
            whitespace-pre-wrap
          "
        >
          {value || "-"}
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
        font-semibold
      `}
    >
      {text}
    </span>
  );
}