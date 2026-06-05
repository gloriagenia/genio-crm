"use client";

import ViewActions from "@/components/actions/ViewActions";

import PropertyStatusBadge from "./PropertyStatusBadge";

type PropertyCardProps = {
data: any[];

loading: boolean;

onSelect: (
property: any
) => void;

onEdit: (
property: any
) => void;

onDelete: (
property: any
) => void;

onCreateListing: (
property: any
) => void;

onChatOwner: (
property: any
) => void;
};

export default function PropertyCard({
data,
loading,
onSelect,
onEdit,
onDelete,
onCreateListing,
onChatOwner,
}: PropertyCardProps) {

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
    Loading properties...
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
    No properties found
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
      key={item.property_id}
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
          items-start
          gap-3
        "
      >

        <div className="flex-1">

          <div
            className="
              text-base
              font-semibold
            "
          >
            {item.property_type || "-"}
          </div>

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            {item.market_type || "-"}
          </div>

        </div>

        <PropertyStatusBadge
          status={item.status}
        />

        <div
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <ViewActions
            items={[

              {
                label:
                  "Chat Owner",

                onClick:
                  () =>
                    onChatOwner(
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

                danger: true,

                onClick:
                  () =>
                    onDelete(
                      item
                    ),
              },

              {
                divider: true,
                label: "",
              },

              {
                label:
                  "Create Listing",

                onClick:
                  () =>
                    onCreateListing(
                      item
                    ),
              },
            ]}
          />

        </div>

      </div>

      {/* LOCATION */}

      <div className="mt-3">

        <div
          className="
            text-sm
            font-medium
          "
        >
          {item.district || "-"}
        </div>

        <div
          className="
            text-sm
            text-gray-500
          "
        >
          {item.city || "-"}
        </div>

      </div>

      {/* SPEC */}

      <div
        className="
          mt-3
          text-sm
          text-gray-700
        "
      >
        LT {item.land_size || 0}
        {" • "}
        LB {item.building_size || 0}
        {" • "}
        {item.bedroom || 0}
        KT /
        {item.bathroom || 0}
        KM
      </div>

      {/* PRICE */}

      <div
        className="
          mt-3
          text-base
          font-semibold
        "
      >

        {item.price

          ? `Rp ${new Intl.NumberFormat(
              "id-ID"
            ).format(
              item.price
            )}`

          : "-"}

      </div>

      {/* FOOTER */}

      <div
        className="
          mt-3
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            text-sm
            font-medium
          "
        >
          {item.certificate || "-"}
        </div>

        {item.photo_url ? (

          <a
            href={item.photo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              text-sm
              text-blue-600
              underline
            "
          >
            View Photo
          </a>

        ) : (

          <span
            className="
              text-sm
              text-gray-400
            "
          >
            No Photo
          </span>

        )}

      </div>

    </div>

  ))}

</div>

);
}