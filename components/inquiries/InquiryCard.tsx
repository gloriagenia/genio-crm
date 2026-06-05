"use client";

import ViewActions from "@/components/actions/ViewActions";
import InquiryStatusBadge from "./InquiryStatusBadge";

type InquiryCardProps = {
  data: any[];
  loading: boolean;

  onSelect: (inquiry: any) => void;
  onEdit: (inquiry: any) => void;
  onDelete: (inquiry: any) => void;
  onWhatsapp: (inquiry: any) => void;
};

export default function InquiryCard({
  data,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onWhatsapp,
}: InquiryCardProps) {
  function formatRupiah(value?: number) {
    if (
      value === null ||
      value === undefined
    ) {
      return "-";
    }

    return `Rp ${new Intl.NumberFormat(
      "id-ID"
    ).format(value)}`;
  }

  function formatDate(
    value?: string
  ) {
    if (!value) return "-";

    return new Date(
      value
    ).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getPriorityClass(
    priority?: string
  ) {
    switch (priority) {
      case "HOT":
        return "bg-red-100 text-red-700";

      case "WARM":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  if (loading) {
    return (
      <div
        className="
          lg:hidden
          bg-white
          border
          rounded-2xl
          p-6
          text-center
          text-gray-500
        "
      >
        Loading inquiries...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className="
          lg:hidden
          bg-white
          border
          rounded-2xl
          p-6
          text-center
          text-gray-500
        "
      >
        No inquiries found
      </div>
    );
  }

  return (
    <div
      className="
        lg:hidden
        space-y-3
      "
    >
      {data.map((item) => (
        <div
          key={item.inquiry_id}
          onClick={() =>
            onSelect(item)
          }
          className="
            bg-white
            border
            rounded-2xl
            p-4
            cursor-pointer
            active:scale-[0.99]
            transition
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              justify-between
              items-start
              gap-3
            "
          >
            <div className="flex-1 min-w-0">

              <div
                className="
                  flex
                  items-center
                  gap-2
                  flex-wrap
                "
              >
                <div
                  className="
                    font-semibold
                    text-base
                    truncate
                  "
                >
                  {item.contacts?.name || "-"}
                </div>

                <span
                  className={`
                    px-2
                    py-1
                    rounded-full
                    text-[11px]
                    font-medium
                    ${getPriorityClass(
                      item.priority
                    )}
                  `}
                >
                  {item.priority || "-"}
                </span>

                <InquiryStatusBadge
                  status={
                    item
                      ?.inquiry_statuses
                      ?.inquiry_status_name
                  }
                />
              </div>

              <div
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                {item.contacts?.phone || "-"}
                {" • "}
                {formatDate(
                  item.next_followup_at
                )}
              </div>
            </div>

            <div
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <ViewActions
                items={[
                  {
                    label: "WhatsApp",
                    onClick: () =>
                      onWhatsapp(item),
                  },

                  {
                    label: "Edit",
                    onClick: () =>
                      onEdit(item),
                  },

                  {
                    label: "Delete",
                    danger: true,
                    onClick: () =>
                      onDelete(item),
                  },
                ]}
              />
            </div>
          </div>

          {/* CONTENT */}

          <div
            className="
              mt-4
              space-y-2
            "
          >
            <div
              className="
                text-base
                font-medium
              "
            >
              {item.property_type
                ?.property_type_name || "-"}
            </div>

            <div
              className="
                text-sm
                text-gray-600
              "
            >
              {item.district || "-"}
              {item.city
                ? `, ${item.city}`
                : ""}
            </div>

            <div
              className="
                text-sm
                font-medium
              "
            >
              {formatRupiah(
                item.budget_min
              )}
              {" - "}
              {formatRupiah(
                item.budget_max
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}