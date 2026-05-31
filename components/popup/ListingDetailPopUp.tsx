"use client";

type ListingDetailPopupProps = {
  open: boolean;

  onClose: () => void;

  data: any;

  title?: string;
};

const orderedFields = [

  "listing_code",

  "listing_title",

  "listing_status",

  "market_type",

  "listing_price",

  "commission_percent",

  "featured",

  "publish_date",

  "expire_date",

  "last_refresh_at",

  "exclusive_until",

  "views_count",

  "leads_count",

  "property_type",

  "district",

  "city",

  "contact_name",

  "phone",

  "listing_link",

  "caption",

  "description",

  "photo_url",
];

const fieldLabels: Record<
  string,
  string
> = {

  listing_code:
    "Listing Code",

  listing_title:
    "Listing Title",

  listing_status:
    "Listing Status",

  market_type:
    "Market Type",

  listing_price:
    "Listing Price",

  commission_percent:
    "Commission",

  featured:
    "Featured",

  publish_date:
    "Publish Date",

  expire_date:
    "Expire Date",

  last_refresh_at:
    "Last Refresh",

  exclusive_until:
    "Exclusive Until",

  views_count:
    "Views Count",

  leads_count:
    "Leads Count",

  property_type:
    "Property Type",

  district:
    "District",

  city:
    "City",

  contact_name:
    "Owner Name",

  phone:
    "Phone",

  listing_link:
    "Listing Link",

  caption:
    "Caption",

  description:
    "Description",

  photo_url:
    "Photo",
};

export default function ListingDetailPopup({
  open,
  onClose,
  data,
  title = "Listing Detail",
}: ListingDetailPopupProps) {

  if (!open || !data)
    return null;

  // =========================
  // STATUS STYLE
  // =========================

  function getStatusClass(
    status: string
  ) {

    switch (status) {

      case "Draft":

        return `
          bg-gray-100
          text-gray-700
        `;

      case "Published":

        return `
          bg-blue-100
          text-blue-700
        `;

      case "Featured":

        return `
          bg-purple-100
          text-purple-700
        `;

      case "Pending":

        return `
          bg-orange-100
          text-orange-700
        `;

      case "Sold":

        return `
          bg-green-100
          text-green-700
        `;

      case "Rented":

        return `
          bg-emerald-100
          text-emerald-700
        `;

      case "Expired":

        return `
          bg-red-100
          text-red-700
        `;

      case "Archived":

        return `
          bg-zinc-100
          text-zinc-700
        `;

      default:

        return `
          bg-gray-100
          text-gray-700
        `;
    }
  }

  // =========================
  // FORMAT PRICE
  // =========================

  function formatPrice(
    value: any
  ) {

    if (
      !value &&
      value !== 0
    ) {
      return "-";
    }

    return `Rp ${new Intl.NumberFormat(
      "id-ID"
    ).format(Number(value))}`;
  }

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/50
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
          max-w-4xl
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
              Listing Information Detail
            </p>

          </div>

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

        {/* BODY */}

        <div
          className="
            p-6
            space-y-4
          "
        >

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
                      text-gray-500
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

                    {/* STATUS */}

                    {field ===
                      "listing_status" &&

                      value && (

                        <div className="flex">

                          <span
                            className={`
                              inline-flex
                              items-center
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-semibold

                              ${getStatusClass(
                                value
                              )}
                            `}
                          >
                            {value}
                          </span>

                        </div>
                      )}

                    {/* PRICE */}

                    {field ===
                      "listing_price" &&

                      value && (

                        <span
                          className="
                            text-sm
                            font-medium
                            text-black
                          "
                        >
                          {
                            formatPrice(
                              value
                            )
                          }
                        </span>
                      )}

                    {/* FEATURED */}

                    {field ===
                      "featured" && (

                        <span
                          className="
                            text-sm
                            text-black
                          "
                        >
                          {value
                            ? "Yes"
                            : "No"}
                        </span>
                      )}

                    {/* COMMISSION */}

                    {field ===
                      "commission_percent" &&

                      value && (

                        <span
                          className="
                            text-sm
                            text-black
                          "
                        >
                          {value}%
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

                    {/* LISTING LINK */}

                    {field ===
                      "listing_link" &&

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
                            break-all
                          "
                        >
                          Open Listing
                        </a>
                      )}

                    {/* NORMAL TEXT */}

                    {field !==
                      "listing_status" &&

                      field !==
                        "listing_price" &&

                      field !==
                        "featured" &&

                      field !==
                        "commission_percent" &&

                      field !==
                        "photo_url" &&

                      field !==
                        "listing_link" &&

                      value && (

                        <span
                          className="
                            text-sm
                            text-black
                            whitespace-pre-line
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
  );
}