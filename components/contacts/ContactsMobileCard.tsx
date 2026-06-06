"use client";

import ContactTypeBadge from "@/components/contacts/ContactTypeBadge";
import PriorityBadge from "@/components/contacts/PriorityBadge";
import FollowupBadge from "@/components/contacts/FollowupBadge";
import ContactActionsDropdown from "@/components/contacts/ContactActionsDropdown";

import { formatRelativeDate } from "@/src/utils/formatRelativeDate";

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

  onEditContact?: (
    row: any
  ) => void;

  onDeleteContact?: (
    row: any
  ) => void;

  onWhatsApp?: (
    row: any
  ) => void;
}

export default function ContactsMobileCard({
  data,
  loading,
  onRowClick,
  onCreateLead,
  onEditContact,
  onDeleteContact,
  onWhatsApp,
}: ContactsMobileCardProps) {
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
          text-center
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-slate-900
          "
        >
          No Contacts Found
        </h2>

        <p
          className="
            mt-3
            text-slate-500
          "
        >
          Tidak ada contact yang sesuai
          dengan filter.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-4
        lg:hidden
      "
    >
      {data.map((item) => {
        const lastContacted =
          item.last_contacted_at ||
          item.last_whatsapp_opened_at;

        return (
          <div
            key={item.contact_id}
            role="button"
            tabIndex={0}
            onClick={() =>
              onRowClick(item)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                onRowClick(item);
              }
            }}
            className="
              w-full
              cursor-pointer
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
              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                {/* NAME */}
                <h2
                  className="
                    truncate
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {item.name || "-"}
                </h2>

                {/* TYPE + PRIORITY */}
                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <ContactTypeBadge
                    type={
                      item.contact_type
                    }
                    size="sm"
                  />

                  <PriorityBadge
                    priority={
                      item.priority
                    }
                    size="sm"
                  />
                </div>
              </div>

              {/* STATUS + ACTION */}
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                {item.status && (
                  <div
                    className="
                      rounded-full
                      bg-slate-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-slate-600
                    "
                  >
                    {item.status}
                  </div>
                )}

                <ContactActionsDropdown
                  contact={item}
                  onCreateLead={
                    onCreateLead
                  }
                  onEdit={
                    onEditContact
                  }
                  onDelete={
                    onDeleteContact
                  }
                  onWhatsApp={
                    onWhatsApp
                  }
                />
              </div>
            </div>

            {/* DIVIDER */}
            <div
              className="
                my-4
                border-t
                border-slate-100
              "
            />

            {/* INFO */}
            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >
              {/* LAST CONTACTED */}
              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Last Contacted
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-medium
                    text-slate-900
                  "
                >
                  {lastContacted
                    ? formatRelativeDate(
                        lastContacted
                      )
                    : "-"}
                </p>
              </div>

              {/* FOLLOW UP */}
              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Next Follow Up
                </p>

                <div className="mt-1">
                  <FollowupBadge
                    date={
                      item.next_followup_at
                    }
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}