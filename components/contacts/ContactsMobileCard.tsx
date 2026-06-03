"use client";

import {
  MessageCircle,
  Phone,
} from "lucide-react";

import ContactAvatar from "@/components/contacts/ContactAvatar";

import ContactQuickAction from "@/components/contacts/ContactQuickAction";

import ContactTypeBadge from "@/components/contacts/ContactTypeBadge";

import FollowupBadge from "@/components/contacts/FollowupBadge";

import PriorityBadge from "@/components/contacts/PriorityBadge";

import { formatPhone } from "@/src/utils/formatPhone";

import { formatRelativeDate } from "@/src/utils/formatRelativeDate";

// =========================
// TYPES
// =========================

interface ContactsMobileCardProps {
  data: any[];

  loading: boolean;

  onRowClick: (
    row: any
  ) => void;

  onCreateLead?: (
    row: any
  ) => void;

  onCreateInquiry?: (
    row: any
  ) => void;
}

// =========================
// COMPONENT
// =========================

export default function ContactsMobileCard({
  data,
  loading,
  onRowClick,
  onCreateLead,
  onCreateInquiry,
}: ContactsMobileCardProps) {
  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        className="
          lg:hidden

          rounded-3xl

          border
          border-slate-200

          bg-white

          p-10

          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
          "
        >
          {/* SPINNER */}
          <div
            className="
              h-12
              w-12

              animate-spin

              rounded-full

              border-4
              border-slate-200
              border-t-yellow-500
            "
          />

          {/* TEXT */}
          <p
            className="
              mt-5

              text-base

              text-slate-500
            "
          >
            Loading contacts...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (data.length === 0) {
    return (
      <div
        className="
          lg:hidden

          rounded-3xl

          border
          border-slate-200

          bg-white

          p-10

          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center

            text-center
          "
        >
          {/* ICON */}
          <div
            className="
              flex
              h-20
              w-20

              items-center
              justify-center

              rounded-full

              bg-slate-100
            "
          >
            <span className="text-3xl">
              📇
            </span>
          </div>

          {/* TITLE */}
          <h2
            className="
              mt-6

              text-2xl

              font-bold

              text-slate-900
            "
          >
            No Contacts Found
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-3

              text-base

              leading-relaxed

              text-slate-500
            "
          >
            Tidak ada contact yang
            sesuai dengan pencarian
            atau filter.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className="
        space-y-4

        lg:hidden
      "
    >
      {data.map((item) => {
        // =========================
        // LAST WA
        // =========================

        const lastWA =
          item.last_whatsapp_opened_at
            ? formatRelativeDate(
                item.last_whatsapp_opened_at
              )
            : null;

        return (
          <div
            key={
              item.contact_id
            }
            onClick={() =>
              onRowClick(item)
            }
            className="
              w-full

              rounded-3xl

              border
              border-slate-200

              bg-white

              p-5

              text-left

              shadow-sm

              transition-all
              duration-200

              active:scale-[0.99]
            "
          >
            {/* HEADER */}
            <div
              className="
                flex
                items-start
                justify-between

                gap-4
              "
            >
              {/* LEFT */}
              <div
                className="
                  flex
                  items-start
                  gap-3

                  min-w-0
                  flex-1
                "
              >
                {/* AVATAR */}
                <ContactAvatar
                  name={item.name}
                  contactType={
                    item.contact_type
                  }
                  size="md"
                />

                {/* CONTENT */}
                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  {/* NAME + TYPE */}
                  <div
                    className="
                      flex
                      flex-wrap
                      items-start

                      gap-2
                    "
                  >
                    {/* NAME */}
                    <h2
                      className="
                        text-lg

                        font-bold

                        leading-snug

                        text-slate-900

                        break-words
                      "
                    >
                      {item.name ||
                        "-"}
                    </h2>

                    {/* CONTACT TYPE */}
                    <ContactTypeBadge
                      type={
                        item.contact_type
                      }
                      size="sm"
                    />
                  </div>

                  {/* PHONE */}
                  <div
                    className="
                      mt-2

                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Phone
                      size={14}
                      className="
                        shrink-0

                        text-slate-400
                      "
                    />

                    <p
                      className="
                        text-sm

                        text-slate-500
                      "
                    >
                      {formatPhone(
                        item.phone
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS */}
              {item.status && (
                <div
                  className="
                    shrink-0

                    rounded-full

                    bg-slate-100

                    px-2.5
                    py-1

                    text-[11px]
                    font-semibold

                    text-slate-600
                  "
                >
                  {item.status}
                </div>
              )}
            </div>

            {/* BODY */}
            <div
              className="
                mt-4

                space-y-3
              "
            >
              {/* PRIORITY */}
              <PriorityBadge
                priority={
                  item.priority
                }
                size="sm"
              />

              {/* FOLLOWUP */}
              <FollowupBadge
                date={
                  item.next_followup_at
                }
                size="sm"
              />

              {/* LAST WA */}
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-sm

                  text-slate-500
                "
              >
                <MessageCircle
                  size={14}
                />

                <span>
                  {lastWA
                    ? `Last WA ${lastWA}`
                    : "No WhatsApp activity"}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <ContactQuickAction
              contact={item}
              onCreateLead={
                onCreateLead
              }
              onCreateInquiry={
                onCreateInquiry
              }
              className="mt-5"
            />
          </div>
        );
      })}
    </div>
  );
}