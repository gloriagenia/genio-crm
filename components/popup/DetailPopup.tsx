import React from "react";

type DetailPopupProps = {
  open: boolean;

  onClose: () => void;

  data: any;

  title?: string;
};

const orderedFields = [

  "canvassing_date",

  "name",

  "phone",

  "street",

  "district",

  "city",

  "property_type",

  "land_size",

  "building_size",

  "address",

  "notes",

  "latitude",

  "longitude",

  "photo_url",
];

const fieldLabels: Record<
  string,
  string
> = {

  canvassing_date:
    "Canvassing Date",

  name:
    "Name",

  phone:
    "Phone",

  street:
    "Street",

  district:
    "District",

  city:
    "City",

  property_type:
    "Property Type",

  land_size:
    "Land Size",

  building_size:
    "Building Size",

  address:
    "Address",

  notes:
    "Notes",

  latitude:
    "Latitude",

  longitude:
    "Longitude",

  photo_url:
    "Photo",
};

export default function DetailPopup({
  open,
  onClose,
  data,
  title = "Detail",
}: DetailPopupProps) {

  if (!open || !data)
    return null;

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/40
        z-50
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-3xl
          rounded-2xl
          shadow-xl
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-6
            py-4
          "
        >

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              text-3xl
              leading-none
              text-gray-400
              hover:text-black
            "
          >
            ×
          </button>

        </div>

        {/* CONTENT */}

        <div
          className="
            px-6
            py-5
            max-h-[75vh]
            overflow-y-auto
          "
        >

          <div className="space-y-4">

            {orderedFields.map(
              (field) => {

                const value =
                  data[field];

                return (

                  <div
                    key={field}
                    className="
                      grid
                      grid-cols-3
                      gap-6
                      border-b
                      pb-4
                    "
                  >

                    {/* LABEL */}

                    <div
                      className="
                        text-sm
                        font-semibold
                        text-gray-600
                      "
                    >
                      {
                        fieldLabels[
                          field
                        ]
                      }
                    </div>

                    {/* VALUE */}

                    <div
                      className="
                        col-span-2
                        break-words
                      "
                    >

                      {/* EMPTY */}

                      {(
                        value === null ||
                        value === undefined ||
                        value === ""
                      ) && (

                        <span
                          className="
                            text-sm
                            text-gray-400
                          "
                        >
                          -
                        </span>
                      )}

                      {/* PHOTO */}

                      {field ===
                        "photo_url" &&

                        value && (

                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              text-sm
                              text-blue-600
                              underline
                              hover:text-blue-800
                            "
                          >
                            View Photo
                          </a>
                        )}

                      {/* SIZE */}

                      {(field ===
                        "land_size" ||

                        field ===
                          "building_size") &&

                        value && (

                          <span
                            className="
                              text-sm
                              text-black
                            "
                          >
                            {value} m²
                          </span>
                        )}

                      {/* NORMAL TEXT */}

                      {field !==
                        "photo_url" &&

                        field !==
                          "land_size" &&

                        field !==
                          "building_size" &&

                        value && (

                          <span
                            className="
                              text-sm
                              text-black
                            "
                          >
                            {String(value)}
                          </span>
                        )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

    </div>
  );
}