"use client";

import ViewActions from "@/components/actions/ViewActions";

type PropertyTableProps = {
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

export default function PropertyTable({
  data,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onCreateListing,
  onChatOwner,
}: PropertyTableProps) {

  if (loading) {

    return (

      <div
        className="
          border
          rounded-2xl
          bg-white
          p-10
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
          border
          rounded-2xl
          bg-white
          p-10
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
                Photo
              </th>

              <th className="p-4 text-left">
                Property
              </th>

              <th className="p-4 text-left">
                Location
              </th>

              <th className="p-4 text-left">
                Specification
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Owner
              </th>

              <th className="p-4 text-left">
                Certificate
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
                    item.property_id
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

                  {/* PHOTO */}

                  <td className="p-4">

                    {item.photo_url ? (

                      <a
                        href={
                          item.photo_url
                        }
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="
                          text-blue-600
                          underline
                        "
                      >
                        View Photo
                      </a>

                    ) : (

                      <span
                        className="
                          text-gray-400
                        "
                      >
                        No Photo
                      </span>

                    )}

                  </td>

                  {/* PROPERTY */}

                  <td className="p-4">

                    <div className="font-medium">
                      {
                        item.property_type
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

                  {/* LOCATION */}

                  <td className="p-4">

                    <div>
                      {item.district}
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {item.city}
                    </div>

                  </td>

                  {/* SPEC */}

                  <td className="p-4">

                    <div
                      className="
                        text-sm
                        leading-6
                      "
                    >
                      LT {
                        item.land_size
                      } m²

                      <br />

                      LB {
                        item.building_size
                      } m²

                      <br />

                      {
                        item.bedroom
                      } KT /
                      {
                        item.bathroom
                      } KM

                    </div>

                  </td>

                  {/* PRICE */}

                  <td className="p-4">

                    {item.price
                      ? `Rp ${new Intl.NumberFormat(
                          "id-ID"
                        ).format(
                          item.price
                        )}`
                      : "-"}

                  </td>

                  {/* OWNER */}

                  <td className="p-4">

                    <div>
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

                  {/* CERT */}

                  <td className="p-4">
                    {
                      item.certificate
                    }
                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-gray-100
                        px-3
                        py-1
                        text-xs
                      "
                    >
                      {
                        item.status
                      }
                    </span>

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
                            "Create Listing",

                          onClick:
                            () =>
                              onCreateListing(
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