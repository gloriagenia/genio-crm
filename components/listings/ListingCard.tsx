"use client";

import ListingStatusBadge
from "./ListingStatusBadge";

import ViewActions
from "@/components/actions/ViewActions";

type ListingCardProps = {
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

export default function ListingCard({
  data,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onShare,
}: ListingCardProps) {

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
        Loading listings...
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
        No listings found
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
          key={item.listing_id}
          onClick={() =>
            onSelect(item)
          }
          className="
            bg-white
            border
            rounded-2xl
            p-4
            cursor-pointer
            hover:border-gray-300
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

            <div
              className="
                flex-1
                min-w-0
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  flex-wrap
                "
              >

                <h3
                  className="
                    font-semibold
                    text-base
                    leading-tight
                  "
                >
                  {item.listing_title || "-"}
                </h3>

                <ListingStatusBadge
                  status={
                    item.listing_status
                  }
                />

              </div>

              <div
                className="
                  text-xs
                  text-gray-500
                  mt-1
                "
              >
                {item.listing_code || "-"}
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

            </div>

          </div>

          {/* SPEC */}

          <div
            className="
              mt-3
              text-sm
              text-gray-600
            "
          >
            LT{" "}
            {item.properties?.land_size || "-"}

            {" / "}

            LB{" "}
            {item.properties?.building_size || "-"}

            {" • "}

            {item.properties?.bedroom || 0}
            {" KT / "}

            {item.properties?.bathroom || 0}
            {" KM"}
          </div>

          {/* PRICE */}

          <div
            className="
              mt-3
              text-lg
              font-semibold
            "
          >
            {item.listing_price

              ? `Rp ${new Intl.NumberFormat(
                  "id-ID"
                ).format(
                  item.listing_price
                )}`

              : "-"}
          </div>

          {/* LOCATION */}

          <div
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            {[
              item.properties?.district,
              item.properties?.city,
            ]
              .filter(Boolean)
              .join(", ")}
          </div>

          {/* ANALYTICS */}

          <div
            className="
              mt-4
              pt-3
              border-t
              text-sm
              text-gray-500
            "
          >
            👁{" "}
            {item.views_count || 0}

            {"  |  "}

            Leads{" "}
            {item.leads_count || 0}
          </div>

        </div>

      ))}

    </div>
  );
}