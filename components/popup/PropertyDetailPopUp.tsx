"use client";

type PropertyDetailPopupProps = {
  open: boolean;

  onClose: () => void;

  data: any;

  title?: string;
};

export default function PropertyDetailPopup({
  open,
  onClose,
  data,
  title = "Property Detail",
}: PropertyDetailPopupProps) {

  if (!open || !data)
    return null;

  // =========================
  // FORMAT LABEL
  // =========================

  function formatLabel(
    label: string
  ) {

    return label

      .replaceAll("_", " ")

      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }

  // =========================
  // FORMAT VALUE
  // =========================

  function formatValue(
    key: string,
    value: any
  ) {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return (
        <span
          className="
            text-gray-400
          "
        >
          -
        </span>
      );
    }

    // =========================
    // PRICE
    // =========================

    if (key === "price") {

      return new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }
      ).format(Number(value));
    }

    // =========================
    // SIZE
    // =========================

    if (
      key === "land_size" ||
      key === "building_size"
    ) {

      return `${value} m²`;
    }

    return String(value);
  }

  // =========================
  // RENDER FIELD
  // =========================

  function renderField(
    label: string,
    value: any,
    field?: string
  ) {

    return (

      <div
        className="
          grid
          grid-cols-[180px_1fr]
          border-b
          last:border-b-0
        "
      >

        {/* LABEL */}

        <div
          className="
            bg-gray-50
            px-4
            py-3
            text-sm
            font-medium
            text-gray-500
            border-r
          "
        >
          {label}
        </div>

        {/* VALUE */}

        <div
          className="
            px-4
            py-3
            text-sm
            text-black
            break-words
          "
        >

          {/* PHOTO */}

          {field ===
            "photo_url" ? (

              value ? (

                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-blue-600
                    underline
                    hover:text-blue-800
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
                  -
                </span>
              )

            ) : (

              formatValue(
                field || "",
                value
              )
            )}

        </div>

      </div>
    );
  }

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-5xl
          rounded-3xl
          shadow-2xl
          overflow-hidden
          max-h-[92vh]
          overflow-y-auto
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
            py-5
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              {title}
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >

              {data.property_type || "-"}

              {" • "}

              {data.market_type || "-"}

            </p>

          </div>

          <button
            onClick={onClose}
            className="
              text-3xl
              text-gray-400
              hover:text-black
            "
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-6">

          {/* PROPERTY INFO */}

          <div
            className="
              border
              rounded-2xl
              overflow-hidden
            "
          >

            <div
              className="
                px-4
                py-3
                bg-gray-100
                border-b
                text-sm
                font-semibold
              "
            >
              Property Information
            </div>

            {renderField(
              "Property Type",
              data.property_type
            )}

            {renderField(
              "Market Type",
              data.market_type
            )}

            {renderField(
              "Certificate",
              data.certificate
            )}

            {renderField(
              "Price",
              data.price,
              "price"
            )}

          </div>

          {/* CONTACT INFO */}

          <div
            className="
              border
              rounded-2xl
              overflow-hidden
            "
          >

            <div
              className="
                px-4
                py-3
                bg-gray-100
                border-b
                text-sm
                font-semibold
              "
            >
              Contact Information
            </div>

            {renderField(
              "Contact Name",
              data.contact_name
            )}

            {renderField(
              "Phone",
              data.phone
            )}

          </div>

          {/* LOCATION */}

          <div
            className="
              border
              rounded-2xl
              overflow-hidden
            "
          >

            <div
              className="
                px-4
                py-3
                bg-gray-100
                border-b
                text-sm
                font-semibold
              "
            >
              Location
            </div>

            {renderField(
              "District",
              data.district
            )}

            {renderField(
              "City",
              data.city
            )}

            {renderField(
              "Address",
              data.address
            )}

            {renderField(
              "GPS Address",
              data.gps_address
            )}

            {renderField(
              "Latitude",
              data.latitude
            )}

            {renderField(
              "Longitude",
              data.longitude
            )}

          </div>

          {/* SPECIFICATION */}

          <div
            className="
              border
              rounded-2xl
              overflow-hidden
            "
          >

            <div
              className="
                px-4
                py-3
                bg-gray-100
                border-b
                text-sm
                font-semibold
              "
            >
              Specification
            </div>

            {renderField(
              "Land Size",
              data.land_size,
              "land_size"
            )}

            {renderField(
              "Building Size",
              data.building_size,
              "building_size"
            )}

            {renderField(
              "Bedroom",
              data.bedroom
            )}

            {renderField(
              "Bathroom",
              data.bathroom
            )}

          </div>

          {/* NOTES */}

          <div
            className="
              border
              rounded-2xl
              overflow-hidden
            "
          >

            <div
              className="
                px-4
                py-3
                bg-gray-100
                border-b
                text-sm
                font-semibold
              "
            >
              Notes
            </div>

            <div
              className="
                px-4
                py-4
                text-sm
                whitespace-pre-line
                break-words
              "
            >
              {data.notes || "-"}
            </div>

          </div>

          {/* PHOTO */}

          <div
            className="
              border
              rounded-2xl
              overflow-hidden
            "
          >

            <div
              className="
                px-4
                py-3
                bg-gray-100
                border-b
                text-sm
                font-semibold
              "
            >
              Photo
            </div>

            <div className="p-4">

              {data.photo_url ? (

                <a
                  href={data.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-blue-600
                    underline
                    hover:text-blue-800
                    text-sm
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
                  -
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}