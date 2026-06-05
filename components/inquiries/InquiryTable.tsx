"use client";

import ViewActions from "@/components/actions/ViewActions";

import InquiryStatusBadge from "./InquiryStatusBadge";

type InquiryTableProps = {
  data: any[];

  loading: boolean;

  onSelect: (
    inquiry: any
  ) => void;

  onEdit: (
    inquiry: any
  ) => void;

  onDelete: (
    inquiry: any
  ) => void;

  onWhatsapp: (
    inquiry: any
  ) => void;
};

export default function InquiryTable({
  data,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onWhatsapp,
}: InquiryTableProps) {

  function formatRupiah(
    value?: number
  ) {

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

  if (loading) {

    return (

      <div
        className="
          hidden
          lg:block

          bg-white
          border
          rounded-2xl

          p-10

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
          hidden
          lg:block

          bg-white
          border
          rounded-2xl

          p-10

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
        hidden
        lg:block

        bg-white
        border
        rounded-2xl

        overflow-hidden
      "
    >

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr
              className="
                bg-black
                text-white
              "
            >

              <th className="p-4 text-left">
                Client
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Property
              </th>

              <th className="p-4 text-left">
                Location
              </th>

              <th className="p-4 text-left">
                Budget
              </th>

              <th className="p-4 text-left">
                Priority
              </th>

              <th className="p-4 text-left">
                Next Action
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map(
              (item) => (

                <tr
                  key={
                    item.inquiry_id
                  }
                  onClick={() =>
                    onSelect(item)
                  }
                  className="
                    border-b
                    hover:bg-gray-50
                    cursor-pointer
                  "
                >

                  {/* CLIENT */}

                  <td className="p-4">

                    <div className="font-medium">
                      {
                        item.contacts
                          ?.name
                      }
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {
                        item.contacts
                          ?.phone
                      }
                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td className="p-4">

                    <div>
                      {
                        item.inquiry_category
                      }
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {
                        item.market_type
                      }
                    </div>

                  </td>

                  {/* PROPERTY */}

                  <td className="p-4">

                    {
                      item
                        .property_type
                        ?.property_type_name || "-"
                    }

                  </td>

                  {/* LOCATION */}

                  <td className="p-4">

                    <div>
                      {
                        item.district
                      }
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {
                        item.city
                      }
                    </div>

                  </td>

                  {/* BUDGET */}

                  <td className="p-4">

                    <div>
                      {formatRupiah(
                        item.budget_min
                      )}
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {formatRupiah(
                        item.budget_max
                      )}
                    </div>

                  </td>

                  {/* PRIORITY */}

                  <td className="p-4">

                    <span
                      className={`
                        inline-flex
                        rounded-full

                        px-3
                        py-1

                        text-xs
                        font-medium

                        ${
                          item.priority === "HOT"

                            ? "bg-red-100 text-red-700"

                            : item.priority === "WARM"

                            ? "bg-yellow-100 text-yellow-700"

                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {
                        item.priority || "-"
                      }
                    </span>

                  </td>

                  {/* NEXT ACTION */}

                  <td className="p-4">

                    <div>
                      {
                        item.next_action || "-"
                      }
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >

                      {item.next_followup_at

                        ? new Date(
                            item.next_followup_at
                          ).toLocaleString(
                            "id-ID"
                          )

                        : "-"
                      }

                    </div>

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <InquiryStatusBadge
                      status={
                        item
                          ?.inquiry_statuses
                          ?.inquiry_status_name
                      }
                    />

                  </td>

                  {/* ACTION */}

                  <td
                    className="p-4"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <ViewActions
                      items={[

                        {
                          label:
                            "WhatsApp",

                          onClick:
                            () =>
                              onWhatsapp(
                                item
                              ),
                        },

                        {
                          label:
                            "Edit",

                          onClick:
                            () =>
                              onEdit(
                                item
                              ),
                        },

                        {
                          label:
                            "Delete",

                          danger:
                            true,

                          onClick:
                            () =>
                              onDelete(
                                item
                              ),
                        },
                      ]}
                    />

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}