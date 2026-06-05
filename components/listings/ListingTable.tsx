"use client";

import ViewActions
from "@/components/actions/ViewActions";

import ListingStatusBadge
from "./ListingStatusBadge";

type ListingTableProps = {
  data: any[];

  loading: boolean;

  onSelect: (
    listing: any
  ) => void;

  onEdit: (
    listing: any
  ) => void;

  onDelete: (
    listing: any
  ) => void;


  onShare: (
    listing: any
  ) => void;
};

export default function ListingTable({
  data,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onShare,
}: ListingTableProps) {

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
        Loading listings...
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
        No listings found
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
                Listing
              </th>

              <th className="p-4 text-left">
                Property
              </th>

              <th className="p-4 text-left">
                Platform
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Publish
              </th>

              <th className="p-4 text-left">
                Analytics
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
                    item.listing_id
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

                  {/* LISTING */}

                  <td className="p-4">

                    <div className="space-y-1">

                      <div
                        className="
                          font-medium
                        "
                      >
                        {
                          item.listing_title
                        }
                      </div>

                      <div
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        {
                          item.listing_code
                        }
                      </div>

                    </div>

                  </td>

                  {/* PROPERTY */}

                  <td className="p-4">

                    <div className="space-y-1">

                      <div>
                        {
                          item.properties
                            ?.property_type
                        }
                      </div>

                      <div
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        {[
                          item.properties
                            ?.district,
                          item.properties
                            ?.city,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>

                    </div>

                  </td>

                  {/* PLATFORM */}

                  <td className="p-4">

                    {item.platform
                      ?.platform_name || "-"}

                  </td>

                  {/* PRICE */}

                  <td className="p-4">

                    {item.listing_price

                      ? `Rp ${new Intl.NumberFormat(
                          "id-ID"
                        ).format(
                          item.listing_price
                        )}`

                      : "-"}

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <ListingStatusBadge
                      status={
                        item.listing_status
                      }
                    />

                  </td>

                  {/* PUBLISH */}

                  <td className="p-4">

                    <div className="space-y-1">

                      <div
                        className="
                          text-sm
                        "
                      >
                        Publish:
                        {" "}
                        {
                          item.publish_date ||
                          "-"
                        }
                      </div>

                      <div
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Expire:
                        {" "}
                        {
                          item.expire_date ||
                          "-"
                        }
                      </div>

                    </div>

                  </td>

                  {/* ANALYTICS */}

                  <td className="p-4">

                    <div className="space-y-1">

                      <div
                        className="
                          text-sm
                        "
                      >
                        Views:
                        {" "}
                        {
                          item.views_count || 0
                        }
                      </div>

                      <div
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Leads:
                        {" "}
                        {
                          item.leads_count || 0
                        }
                      </div>

                    </div>

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

                        {
                          divider:
                            true,

                          label: "",
                        },

                        {
                          label:
                            "Share Listing",

                          onClick:
                            () =>
                              onShare(
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