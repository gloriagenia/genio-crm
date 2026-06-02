"use client";

import {
  useEffect,
  useState,
} from "react";

import AddButton from "@/components/buttons/AddButton";

import ViewActions from "@/components/actions/ViewActions";

import MainLayout from "@/components/layout/MainLayout";

import DataTable from "@/components/tables/DataTable";

import Pagination from "@/components/ui/Pagination";

import AddListingModal from "@/components/modals/AddListingModal";

import EditListingModal from "@/components/modals/EditListingModal";

import ListingDetailPopUp from "@/components/popup/ListingDetailPopUp";

import { supabase } from "@/lib/supabase";

// =========================
// COLUMNS
// =========================

const columns = [

  {
    key: "no",
    label: "No",
  },

  {
    key: "listing",
    label: "Listing",
  },

  {
    key: "platform",
    label: "Platform",
  },

  {
    key: "price",
    label: "Price",
  },

  {
    key: "status",
    label: "Status",
  },

  {
    key: "publish_info",
    label: "Publish",
  },

  {
    key: "analytics",
    label: "Analytics",
  },

  {
    key: "action",
    label: "Action",
  },
];

export default function ListingsPage() {

  // =========================
  // STATES
  // =========================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState<any>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalData, setTotalData] =
    useState(0);

  const [openModal, setOpenModal] =
    useState(false);

  const [editData, setEditData] =
    useState<any>(null);

  // =========================
  // FILTER STATES
  // =========================

  const [
    filterStatus,
    setFilterStatus,
  ] = useState("");

  const [
    filterMarketType,
    setFilterMarketType,
  ] = useState("");

  const [
    filterPlatform,
    setFilterPlatform,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const rowsPerPage = 10;

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const endIndex =
    startIndex + rowsPerPage;

  // =========================
  // STATUS COLOR
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
          bg-gray-200
          text-gray-600
        `;

      default:
        return `
          bg-gray-100
          text-gray-700
        `;
    }
  }

  // =========================
  // FETCH LISTINGS
  // =========================

  async function fetchListings() {

    try {

      setLoading(true);

      let query = supabase

        .from("listing")

        .select(`
          *,
          properties (
            property_id,
            property_type,
            district,
            city,
            photo_url
          ),
          platform (
            platform_name
          )
        `, {
          count: "exact",
        });

      // =========================
      // SEARCH
      // =========================

      if (search) {

        query = query.or(`
          listing_title.ilike.%${search}%,
          listing_code.ilike.%${search}%
        `);
      }

      // =========================
      // FILTER STATUS
      // =========================

      if (filterStatus) {

        query = query.eq(
          "listing_status",
          filterStatus
        );
      }

      // =========================
      // FILTER MARKET TYPE
      // =========================

      if (filterMarketType) {

        query = query.eq(
          "market_type",
          filterMarketType
        );
      }

      // =========================
      // FILTER PLATFORM
      // =========================

      if (filterPlatform) {

        query = query.eq(
          "platform_id",
          filterPlatform
        );
      }

      const {
        data,
        error,
        count,
      } = await query

        .order(
          "created_at",
          {
            ascending: false,
          }
        )

        .range(
          startIndex,
          endIndex - 1
        );

      if (error) {

        console.log(
          "FETCH LISTING ERROR:",
          error
        );

        alert(error.message);

        return;
      }

      setTotalData(count || 0);

      const formattedData =
        (data || []).map(
          (item, index) => ({

            ...item,

            no:
              startIndex +
              index +
              1,

            // =========================
            // LISTING
            // =========================

            listing: (

              <div className="space-y-1">

                <div className="font-medium">
                  {item.listing_title || "-"}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {item.listing_code || "-"}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  {
                    item.properties
                      ?.property_type
                  }
                </div>

              </div>
            ),

            // =========================
            // PLATFORM
            // =========================

            platform: (

              <div className="text-sm">

                {item.platform
                  ?.platform_name || "-"}

              </div>
            ),

            // =========================
            // PRICE
            // =========================

            price:

              item.listing_price

                ? `Rp ${new Intl.NumberFormat(
                    "id-ID"
                  ).format(
                    item.listing_price
                  )}`

                : "-",

            // =========================
            // STATUS
            // =========================

            status: (

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
                      item.listing_status
                    )}
                  `}
                >
                  {item.listing_status || "-"}
                </span>

              </div>
            ),

            // =========================
            // PUBLISH
            // =========================

            publish_info: (

              <div className="space-y-1">

                <div
                  className="
                    text-sm
                  "
                >
                  Publish:
                  {" "}
                  {
                    item.publish_date || "-"
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
                    item.expire_date || "-"
                  }
                </div>

              </div>
            ),

            // =========================
            // ANALYTICS
            // =========================

            analytics: (

              <div className="space-y-1">

                <div
                  className="
                    text-sm
                  "
                >
                  👁 {item.views_count || 0}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Leads:
                  {" "}
                  {item.leads_count || 0}
                </div>

              </div>
            ),

            // =========================
            // ACTION
            // =========================

            action: (

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <ViewActions
                  items={[

                    {
                      label:
                        "Open Listing",

                      onClick:
                        () => {

                          if (
                            item.listing_link
                          ) {

                            window.open(
                              item.listing_link,
                              "_blank"
                            );
                          }
                        },
                    },

                    {
                      label:
                        "Edit",

                      onClick:
                        () => {

                          setEditData(item);

                          setOpenModal(
                            true
                          );
                        },
                    },

                    {
                      label:
                        "Delete",

                      danger:
                        true,

                      onClick:
                        async () => {

                          const confirmDelete =
                            confirm(
                              "Are you sure want to delete this listing?"
                            );

                          if (
                            !confirmDelete
                          )
                            return;

                          const {
                            error,
                          } =
                            await supabase

                              .from(
                                "listing"
                              )

                              .delete()

                              .eq(
                                "listing_id",
                                item.listing_id
                              );

                          if (
                            error
                          ) {

                            console.log(
                              error
                            );

                            return;
                          }

                          fetchListings();
                        },
                    },

                    {
                      label:
                        "Create Inquiry",

                      onClick:
                        () => {

                          console.log(
                            "Create Inquiry:",
                            item.listing_id
                          );

                          // nanti bisa diarahkan:
                          // router.push(`/inquiries/create?listing_id=${item.listing_id}`)
                        },
                    },

                    {
                      label:
                        "Share Listing",

                      onClick:
                        async () => {

                          try {

                            if (
                              navigator.share &&
                              item.listing_link
                            ) {

                              await navigator.share({

                                title:
                                  item.listing_title,

                                text:
                                  item.listing_title,

                                url:
                                  item.listing_link,
                              });

                            } else {

                              if (
                                item.listing_link
                              ) {

                                await navigator.clipboard.writeText(
                                  item.listing_link
                                );

                                alert(
                                  "Listing link copied"
                                );
                              }
                            }

                          } catch (error) {

                            console.log(error);
                          }
                        },
                    },
                  ]}
                />

              </div>
            ),
          })
        );

      setData(formattedData);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {

    fetchListings();

  }, [
    currentPage,
    filterStatus,
    filterMarketType,
    filterPlatform,
    search,
  ]);

  // =========================
  // TOTAL PAGES
  // =========================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalData /
          rowsPerPage
      )
    );

  return (

    <MainLayout>

      <div className="space-y-6">

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Listings
          </h1>

          <AddButton
            label="Add Listing"

            onAdd={() => {

              setEditData(null);

              setOpenModal(true);
            }}

            onImport={() => {

              console.log(
                "Import CSV"
              );
            }}
          />

        </div>

        {/* FILTER */}

        <div
          className="
            border
            rounded-2xl
            p-4
            bg-white
            flex
            flex-wrap
            gap-3
            items-center
          "
        >

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search listing"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              border
              rounded-xl
              px-4
              py-2
            "
          />

          {/* MARKET TYPE */}

          <select
            value={filterMarketType}
            onChange={(e) =>
              setFilterMarketType(
                e.target.value
              )
            }
            className="
              border
              rounded-xl
              px-4
              py-2
            "
          >

            <option value="">
              All Market Type
            </option>

            <option value="Sale">
              Sale
            </option>

            <option value="Rent">
              Rent
            </option>

            <option value="Sale & Rent">
              Sale & Rent
            </option>

          </select>

          {/* STATUS */}

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value
              )
            }
            className="
              border
              rounded-xl
              px-4
              py-2
            "
          >

            <option value="">
              All Status
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Published">
              Published
            </option>

            <option value="Featured">
              Featured
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Sold">
              Sold
            </option>

            <option value="Rented">
              Rented
            </option>

            <option value="Expired">
              Expired
            </option>

            <option value="Archived">
              Archived
            </option>

          </select>

          {/* RESET */}

          <button
            onClick={() => {

              setSearch("");

              setFilterStatus("");

              setFilterMarketType("");

              setFilterPlatform("");

              setCurrentPage(1);

            }}
            className="
              border
              rounded-xl
              px-4
              py-2
              hover:bg-gray-100
            "
          >
            Reset
          </button>

        </div>

        {/* TABLE */}

        {loading ? (

          <div
            className="
              border
              rounded-xl
              p-10
              text-center
              text-gray-500
            "
          >
            Loading listings...
          </div>

        ) : (

          <>

            <DataTable
              columns={columns}

              data={data}

              onRowClick={(row) => {

                setSelectedRow({

                  listing_id:
                    row.listing_id,

                  listing_code:
                    row.listing_code,

                  listing_title:
                    row.listing_title,

                  market_type:
                    row.market_type,

                  listing_price:
                    row.listing_price,

                  listing_status:
                    row.listing_status,

                  featured:
                    row.featured,

                  publish_date:
                    row.publish_date,

                  expire_date:
                    row.expire_date,

                  last_refresh_at:
                    row.last_refresh_at,

                  listing_link:
                    row.listing_link,

                  caption:
                    row.caption,

                  description:
                    row.description,

                  commission_percent:
                    row.commission_percent,

                  exclusive_until:
                    row.exclusive_until,

                  views_count:
                    row.views_count,

                  leads_count:
                    row.leads_count,

                  property_type:
                    row.properties
                      ?.property_type,

                  district:
                    row.properties
                      ?.district,

                  city:
                    row.properties
                      ?.city,

                  photo_url:
                    row.properties
                      ?.photo_url,
                });
              }}
            />

            <Pagination
              currentPage={
                currentPage
              }

              totalPages={
                totalPages
              }

              onFirst={() =>
                setCurrentPage(1)
              }

              onPrev={() =>
                setCurrentPage(
                  Math.max(
                    1,
                    currentPage - 1
                  )
                )
              }

              onNext={() =>
                setCurrentPage(
                  Math.min(
                    totalPages,
                    currentPage + 1
                  )
                )
              }

              onLast={() =>
                setCurrentPage(
                  totalPages
                )
              }
            />

          </>
        )}

        {/* ADD MODAL */}

        <AddListingModal
          open={
            openModal &&
            !editData
          }

          onClose={() => {

            setOpenModal(false);

            setEditData(null);
          }}

          onSuccess={() => {

            fetchListings();
          }}
        />

        {/* EDIT MODAL */}

        <EditListingModal
          open={
            openModal &&
            !!editData
          }

          data={editData}

          onClose={() => {

            setOpenModal(false);

            setEditData(null);
          }}

          onSuccess={() => {

            fetchListings();
          }}
        />

        {/* DETAIL */}

        <ListingDetailPopUp
          open={!!selectedRow}

          data={selectedRow}

          onClose={() =>
            setSelectedRow(null)
          }
        />

      </div>

    </MainLayout>
  );
}