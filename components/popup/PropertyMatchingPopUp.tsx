"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  X,
  MapPin,
  BadgeDollarSign,
  MessageCircle,
  Eye,
  Check,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// =========================
// TYPES
// =========================

type PropertyMatchingPopUpProps = {
  open: boolean;
  inquiry: any;
  onClose: () => void;
};

// =========================
// COMPONENT
// =========================

export default function PropertyMatchingPopUp({
  open,
  inquiry,
  onClose,
}: PropertyMatchingPopUpProps) {

  // =========================
  // STATES
  // =========================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    listings,
    setListings,
  ] = useState<any[]>([]);

  const [
    matchedIds,
    setMatchedIds,
  ] = useState<number[]>([]);

  const [
    showAll,
    setShowAll,
  ] = useState(false);

  // =========================
  // FETCH MATCHING
  // =========================

  async function fetchMatching() {

    try {

      if (!inquiry?.inquiry_id)
        return;

      setLoading(true);

      // =========================
      // EXISTING MATCHES
      // =========================

      const {
        data: existingMatches,
      } = await supabase
        .from("property_matches")
        .select(`
          listing_id
        `)
        .eq(
          "inquiry_id",
          inquiry.inquiry_id
        );

      const existingIds =
        (existingMatches || [])
          .map(
            (
              item: any
            ) =>
              item.listing_id
          );

      setMatchedIds(
        existingIds
      );

      // =========================
      // FETCH LISTINGS
      // =========================

      const {
        data,
        error,
      } = await supabase
        .from("listings")
        .select(`
          *,
          properties (
            property_id,
            district,
            city,
            land_size,
            building_size,
            property_type
          )
        `)
        .neq(
          "listing_status",
          "Closed"
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {

        console.log(error);

        return;
      }

      // =========================
      // MATCHING SCORE
      // =========================

      const scoredListings =
        (data || []).map(
          (
            item: any
          ) => {

            const property =
              item.properties;

            let score = 0;

            // PROPERTY TYPE

            if (
              inquiry
                ?.property_type
                ?.property_type_name &&
              property
                ?.property_type
                ?.toLowerCase()
                .includes(
                  inquiry
                    ?.property_type
                    ?.property_type_name
                    ?.toLowerCase()
                )
            ) {

              score += 35;
            }

            // DISTRICT

            if (
              inquiry?.district &&
              property
                ?.district
                ?.toLowerCase()
                .includes(
                  inquiry
                    ?.district
                    ?.toLowerCase()
                )
            ) {

              score += 35;
            }

            // CITY

            if (
              inquiry?.city &&
              property
                ?.city
                ?.toLowerCase()
                .includes(
                  inquiry
                    ?.city
                    ?.toLowerCase()
                )
            ) {

              score += 15;
            }

            // BUDGET

            if (
              inquiry?.budget_min &&
              inquiry?.budget_max &&
              item.price >=
                inquiry.budget_min &&
              item.price <=
                inquiry.budget_max
            ) {

              score += 15;
            }

            return {
              ...item,
              matching_score:
                score,
            };
          }
        );

      // =========================
      // FILTER SCORE > 0
      // =========================

      const filteredListings =
        scoredListings.filter(
          (
            item: any
          ) =>
            item.matching_score > 0
        );

      // =========================
      // SORT
      // =========================

      filteredListings.sort(
        (
          a: any,
          b: any
        ) =>
          b.matching_score -
          a.matching_score
      );

      setListings(
        filteredListings
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL
  // =========================

  useEffect(() => {

    if (open) {

      fetchMatching();
    }

  }, [open]);

  // =========================
  // FORMAT PRICE
  // =========================

  function formatPrice(
    value: number
  ) {

    if (!value) return "-";

    return `Rp ${new Intl.NumberFormat(
      "id-ID"
    ).format(value)}`;
  }

  // =========================
  // ADD MATCHING
  // =========================

  async function handleAddMatching(
    listing: any
  ) {

    try {

      if (
        matchedIds.includes(
          listing.listing_id
        )
      ) {

        return;
      }

      const {
        error,
      } = await supabase
        .from(
          "property_matches"
        )
        .insert([
          {
            inquiry_id:
              inquiry.inquiry_id,

            listing_id:
              listing.listing_id,

            matching_score:
              listing.matching_score,

            match_status:
              "MATCHED",

            created_at:
              new Date(),
          },
        ]);

      if (error) {

        console.log(error);

        return;
      }

      setMatchedIds([
        ...matchedIds,
        listing.listing_id,
      ]);

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // SHARE WA
  // =========================

  function handleShareWA(
    listing: any
  ) {

    const property =
      listing.properties;

    const phone =
      inquiry?.contacts?.phone;

    if (!phone) {

      alert(
        "Contact phone not found"
      );

      return;
    }

    let cleanPhone =
      phone.replace(/\D/g, "");

    if (
      cleanPhone.startsWith("0")
    ) {

      cleanPhone =
        "62" +
        cleanPhone.slice(1);
    }

    const text =
`Halo ${inquiry?.contacts?.name || ""},

Saya ada property yang mungkin cocok:

${property?.property_type || "-"}
${property?.district || "-"}, ${property?.city || "-"}

Harga:
${formatPrice(listing.price)}

LT/LB:
${property?.land_size || "-"} / ${property?.building_size || "-"}

Jika tertarik saya bisa bantu arrange survey 😊`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  // =========================
  // DISPLAYED LIST
  // =========================

  const displayedListings =
    useMemo(() => {

      if (showAll)
        return listings;

      return listings.slice(0, 3);

    }, [
      listings,
      showAll,
    ]);

  // =========================
  // HIDE
  // =========================

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          w-full
          max-w-5xl
          max-h-[90vh]
          overflow-hidden
          flex
          flex-col
        "
      >

        {/* HEADER */}

        <div
          className="
            border-b
            px-6
            py-5
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Property Matching
            </h2>

            <div
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              {inquiry?.contacts?.name || "-"}
              {" • "}
              {inquiry
                ?.property_type
                ?.property_type_name || "-"}
              {" • "}
              {inquiry?.district || "-"}
            </div>

          </div>

          <button
            onClick={onClose}
            className="
              text-gray-500
              hover:text-black
            "
          >
            <X size={24} />
          </button>

        </div>

        {/* BODY */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >

          {loading ? (

            <div
              className="
                py-20
                text-center
                text-gray-500
              "
            >
              Loading matching...
            </div>

          ) : listings.length === 0 ? (

            <div
              className="
                py-20
                text-center
                text-gray-500
              "
            >
              No matching listing found
            </div>

          ) : (

            <div className="space-y-4">

              {/* LIST */}

              {displayedListings.map(
                (item) => {

                  const property =
                    item.properties;

                  const alreadyMatched =
                    matchedIds.includes(
                      item.listing_id
                    );

                  return (

                    <div
                      key={
                        item.listing_id
                      }
                      className="
                        border
                        rounded-3xl
                        p-5
                        bg-white
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          lg:flex-row
                          gap-5
                        "
                      >

                        {/* IMAGE */}

                        <div
                          className="
                            w-full
                            lg:w-64
                            h-44
                            rounded-2xl
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                            text-gray-400
                            shrink-0
                          "
                        >
                          No Image
                        </div>

                        {/* CONTENT */}

                        <div className="flex-1 space-y-4">

                          {/* TOP */}

                          <div
                            className="
                              flex
                              flex-col
                              md:flex-row
                              md:items-start
                              md:justify-between
                              gap-4
                            "
                          >

                            <div>

                              <div
                                className="
                                  text-xl
                                  font-bold
                                "
                              >
                                {property?.property_type || "-"}
                              </div>

                              <div
                                className="
                                  text-sm
                                  text-gray-500
                                  mt-1
                                "
                              >
                                Listing #{item.listing_id}
                              </div>

                            </div>

                            <div
                              className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-full
                                bg-green-100
                                text-green-700
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                w-fit
                              "
                            >
                              {item.matching_score}%
                              Match
                            </div>

                          </div>

                          {/* LOCATION */}

                          <div
                            className="
                              flex
                              items-start
                              gap-2
                              text-sm
                              text-gray-600
                            "
                          >

                            <MapPin
                              size={16}
                            />

                            <div>
                              {
                                property?.district
                              }
                              {", "}
                              {
                                property?.city
                              }
                            </div>

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
                              size={16}
                            />

                            <div className="font-semibold">
                              {formatPrice(
                                item.price
                              )}
                            </div>

                          </div>

                          {/* SIZE */}

                          <div
                            className="
                              flex
                              flex-wrap
                              gap-3
                            "
                          >

                            <div
                              className="
                                border
                                rounded-2xl
                                px-4
                                py-3
                                min-w-[140px]
                              "
                            >

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                Land Size
                              </div>

                              <div className="font-semibold">
                                {
                                  property?.land_size || "-"
                                }
                              </div>

                            </div>

                            <div
                              className="
                                border
                                rounded-2xl
                                px-4
                                py-3
                                min-w-[140px]
                              "
                            >

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                Building Size
                              </div>

                              <div className="font-semibold">
                                {
                                  property?.building_size || "-"
                                }
                              </div>

                            </div>

                          </div>

                          {/* ACTIONS */}

                          <div
                            className="
                              flex
                              flex-wrap
                              gap-3
                              pt-2
                            "
                          >

                            {/* VIEW */}

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
                                gap-2
                              "
                            >

                              <Eye size={16} />

                              View

                            </button>

                            {/* WHATSAPP */}

                            <button
                              onClick={() =>
                                handleShareWA(
                                  item
                                )
                              }
                              className="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-medium
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <MessageCircle
                                size={16}
                              />

                              WhatsApp

                            </button>

                            {/* MATCH */}

                            {alreadyMatched ? (

                              <div
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-xl
                                  bg-green-100
                                  text-green-700
                                  px-4
                                  py-3
                                  text-sm
                                  font-semibold
                                "
                              >

                                <Check size={16} />

                                Already Matched

                              </div>

                            ) : (

                              <button
                                onClick={() =>
                                  handleAddMatching(
                                    item
                                  )
                                }
                                className="
                                  bg-black
                                  hover:opacity-90
                                  text-white
                                  rounded-xl
                                  px-4
                                  py-3
                                  text-sm
                                  font-semibold
                                  flex
                                  items-center
                                  gap-2
                                "
                              >

                                <Check size={16} />

                                Add Matching

                              </button>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

              {/* VIEW ALL */}

              {listings.length > 3 && (

                <div
                  className="
                    flex
                    justify-center
                    pt-2
                  "
                >

                  <button
                    onClick={() =>
                      setShowAll(
                        !showAll
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-black
                      hover:opacity-70
                    "
                  >

                    {showAll
                      ? "Show Less"
                      : `View Properties (${listings.length})`
                    }

                    <ChevronRight
                      size={16}
                    />

                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}