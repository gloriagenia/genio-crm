"use client";

import PropertyMatchingPopUp from "@/components/popup/PropertyMatchingPopUp";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Eye,
  MapPin,
  BadgeDollarSign,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// =========================
// TYPES
// =========================

type InquiryDetailPopUpProps = {
  open: boolean;
  data: any;
  onClose: () => void;
};

// =========================
// COMPONENT
// =========================

export default function InquiryDetailPopUp({

  open,

  data,

  onClose,
}: InquiryDetailPopUpProps) {

  // =========================
  // STATES
  // =========================

  const [
    openPropertyMatching,
    setOpenPropertyMatching,
  ] = useState(false);

  const [
    matchedProperties,
    setMatchedProperties,
  ] = useState<any[]>([]);

  const [
    loadingMatching,
    setLoadingMatching,
  ] = useState(false);

  const [
    showAllMatching,
    setShowAllMatching,
  ] = useState(false);

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(
    value?: string
  ) {

    if (!value) return "-";

    return new Date(
      value
    ).toLocaleString(
      "id-ID"
    );
  }

  // =========================
  // FORMAT PRICE
  // =========================

  function formatPrice(
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

  // =========================
  // FETCH MATCHED PROPERTY
  // =========================

  async function fetchMatchedProperties() {

    try {

      if (!data?.inquiry_id)
        return;

      setLoadingMatching(
        true
      );

      const {
        data: matches,
        error,
      } = await supabase
        .from(
          "property_matches"
        )
        .select(`
          *,
          listings (
            listing_id,
            title,
            price,
            properties (
              property_id,
              property_type,
              district,
              city,
              land_size,
              building_size
            )
          )
        `)
        .eq(
          "inquiry_id",
          data.inquiry_id
        )
        .order(
          "matching_score",
          {
            ascending: false,
          }
        );

      if (error) {

        console.log(error);

        return;
      }

      setMatchedProperties(
        matches || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoadingMatching(
        false
      );
    }
  }

  // =========================
  // INITIAL
  // =========================

  useEffect(() => {

    if (open) {

      fetchMatchedProperties();
    }

  }, [
    open,
    openPropertyMatching,
  ]);

  // =========================
  // DISPLAYED MATCHING
  // =========================

  const displayedMatching =
    useMemo(() => {

      if (
        showAllMatching
      ) {

        return matchedProperties;
      }

      return matchedProperties.slice(
        0,
        3
      );

    }, [
      matchedProperties,
      showAllMatching,
    ]);

  // =========================
  // CLOSE
  // =========================

  if (!open || !data)
    return null;

  return (

    <>

      {/* POPUP */}

      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/50
          p-4
        "
      >

        <div
          className="
            w-full
            max-w-4xl
            rounded-3xl
            bg-white
            overflow-hidden
            shadow-2xl
            max-h-[90vh]
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
              py-4
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Inquiry Detail
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Inquiry Information
              </p>

            </div>

            <button
              onClick={onClose}
              className="
                text-3xl
                text-gray-500
                hover:text-black
              "
            >
              ×
            </button>

          </div>

          {/* BODY */}

          <div className="p-6 space-y-6">

            {/* BASIC INFO */}

            <div
              className="
                border
                rounded-2xl
                overflow-hidden
              "
            >

              <SectionTitle
                title="Basic Information"
              />

              <DetailRow
                label="Inquiry ID"
                value={
                  data.inquiry_id
                }
              />

              <DetailRow
                label="Inquiry Category"
                value={
                  data.inquiry_category
                }
              />

              <DetailRow
                label="Market Type"
                value={
                  data.market_type
                }
              />

              <DetailRow
                label="Requirement Summary"
                value={
                  data.requirement_summary
                }
                multiline
              />

              <DetailRow
                label="Inquiry Date"
                value={formatDate(
                  data.inquiry_date
                )}
              />

              <DetailRow
                label="Last Followup"
                value={formatDate(
                  data.last_followup
                )}
              />

              <DetailRow
                label="Next Followup"
                value={formatDate(
                  data.next_followup_at
                )}
              />

              <DetailRow
                label="Next Action"
                value={
                  data.next_action
                }
              />

              <DetailRow
                label="Priority"
                value={
                  data.priority
                }
              />

              <DetailRow
                label="Notes"
                value={
                  data.notes || "-"
                }
                multiline
              />

            </div>

            {/* CONTACT */}

            <div
              className="
                border
                rounded-2xl
                overflow-hidden
              "
            >

              <SectionTitle
                title="Contact Information"
              />

              <DetailRow
                label="Contact Name"
                value={
                  data.contacts
                    ?.name || "-"
                }
              />

              <DetailRow
                label="Phone"
                value={
                  data.contacts
                    ?.phone || "-"
                }
              />

            </div>

            {/* PROPERTY */}

            <div
              className="
                border
                rounded-2xl
                overflow-hidden
              "
            >

              <SectionTitle
                title="Property Requirement"
              />

              <DetailRow
                label="Property Type"
                value={
                  data.property_type
                    ?.property_type_name ||
                  "-"
                }
              />

              <DetailRow
                label="District"
                value={
                  data.district || "-"
                }
              />

              <DetailRow
                label="City"
                value={
                  data.city || "-"
                }
              />

              <DetailRow
                label="Budget Min"
                value={formatPrice(
                  data.budget_min
                )}
              />

              <DetailRow
                label="Budget Max"
                value={formatPrice(
                  data.budget_max
                )}
              />

            </div>

            {/* PROPERTY MATCHING */}

            <div
              className="
                border
                rounded-2xl
                overflow-hidden
              "
            >

              <SectionTitle
                title="Property Matching"
              />

              <div className="p-4 space-y-4">

                {/* BUTTON */}

                <button
                  onClick={() =>
                    setOpenPropertyMatching(
                      true
                    )
                  }
                  className="
                    bg-black
                    text-white
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    hover:opacity-90
                  "
                >
                  + Match Property
                </button>

                {/* LOADING */}

                {loadingMatching ? (

                  <div
                    className="
                      border
                      rounded-xl
                      p-6
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    Loading property matching...
                  </div>

                ) : matchedProperties.length === 0 ? (

                  <div
                    className="
                      border
                      rounded-xl
                      p-6
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    No matched property yet.
                  </div>

                ) : (

                  <div className="space-y-3">

                    {/* LIST */}

                    {displayedMatching.map(
                      (
                        item: any
                      ) => {

                        const listing =
                          item.listings;

                        const property =
                          listing?.properties;

                        return (

                          <div
                            key={
                              item.property_match_id
                            }
                            className="
                              border
                              rounded-2xl
                              p-4
                              flex
                              flex-col
                              md:flex-row
                              md:items-center
                              md:justify-between
                              gap-4
                            "
                          >

                            {/* LEFT */}

                            <div className="space-y-2">

                              {/* TITLE */}

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
                                  "
                                >
                                  {
                                    property?.property_type ||
                                    "-"
                                  }
                                </div>

                                <div
                                  className="
                                    text-xs
                                    bg-green-100
                                    text-green-700
                                    px-2
                                    py-1
                                    rounded-full
                                    font-medium
                                  "
                                >
                                  {
                                    item.matching_score
                                  }
                                  % Match
                                </div>

                              </div>

                              {/* LOCATION */}

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  text-sm
                                  text-gray-500
                                "
                              >

                                <MapPin
                                  size={15}
                                />

                                <span>
                                  {
                                    property?.district
                                  }
                                  {", "}
                                  {
                                    property?.city
                                  }
                                </span>

                              </div>

                              {/* PRICE */}

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  text-sm
                                "
                              >

                                <BadgeDollarSign
                                  size={15}
                                />

                                <span className="font-medium">
                                  {formatPrice(
                                    listing?.price
                                  )}
                                </span>

                              </div>

                              {/* SIZE */}

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                LT:
                                {" "}
                                {
                                  property?.land_size || "-"
                                }
                                {" "}
                                •
                                {" "}
                                LB:
                                {" "}
                                {
                                  property?.building_size || "-"
                                }
                              </div>

                            </div>

                            {/* ACTION */}

                            <button
                              className="
                                border
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-medium
                                hover:bg-gray-100
                                flex
                                items-center
                                justify-center
                                gap-2
                                shrink-0
                              "
                            >

                              <Eye size={16} />

                              View

                            </button>

                          </div>
                        );
                      }
                    )}

                    {/* VIEW ALL */}

                    {matchedProperties.length > 3 && (

                      <button
                        onClick={() =>
                          setShowAllMatching(
                            !showAllMatching
                          )
                        }
                        className="
                          text-sm
                          font-medium
                          text-black
                          hover:opacity-70
                        "
                      >

                        {showAllMatching
                          ? "Show Less"
                          : `View Properties (${matchedProperties.length})`
                        }

                      </button>

                    )}

                  </div>

                )}

              </div>

            </div>

            {/* STATUS */}

            <div
              className="
                border
                rounded-2xl
                overflow-hidden
              "
            >

              <SectionTitle
                title="Status Information"
              />

              <DetailRow
                label="Inquiry Status"
                value={
                  data
                    ?.inquiry_statuses
                    ?.inquiry_status_name ||
                  "-"
                }
              />

              <DetailRow
                label="Created At"
                value={formatDate(
                  data.created_at
                )}
              />

              <DetailRow
                label="Updated At"
                value={formatDate(
                  data.updated_at
                )}
              />

            </div>

          </div>

        </div>

      </div>

      {/* PROPERTY MATCHING POPUP */}

      <PropertyMatchingPopUp
        open={
          openPropertyMatching
        }
        inquiry={data}
        onClose={() =>
          setOpenPropertyMatching(
            false
          )
        }
      />

    </>
  );
}

// =========================
// SECTION TITLE
// =========================

function SectionTitle({
  title,
}: {
  title: string;
}) {

  return (

    <div
      className="
        px-4
        py-3
        bg-gray-50
        border-b
        font-semibold
      "
    >
      {title}
    </div>
  );
}

// =========================
// DETAIL ROW
// =========================

function DetailRow({

  label,

  value,

  multiline = false,
}: {

  label: string;

  value: any;

  multiline?: boolean;
}) {

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
          border-r
          px-4
          py-3
          text-sm
          font-medium
          text-gray-500
        "
      >
        {label}
      </div>

      {/* VALUE */}

      <div
        className={`
          px-4
          py-3
          text-sm
          text-black
          break-words

          ${
            multiline
              ? "whitespace-pre-line"
              : ""
          }
        `}
      >
        {value || "-"}
      </div>

    </div>
  );
}