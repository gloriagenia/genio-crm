"use client";

import { useEffect, useState } from "react";

import AddButton from "@/components/buttons/AddButton";

import ViewActions from "@/components/actions/ViewActions";

import MainLayout from "@/components/layout/MainLayout";

import DataTable from "@/components/tables/DataTable";

import Pagination from "@/components/pagination/Pagination";

import AddPropertyModal from "@/components/modals/AddPropertyModal";

import EditPropertyModal from "@/components/modals/EditPropertyModal";

import PropertyDetailPopup from "@/components/popup/PropertyDetailPopUp";

import AddListingModal from "@/components/modals/AddListingModal";

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
    key: "photo",
    label: "Photo",
  },

  {
    key: "property_summary",
    label: "Property",
  },

  {
    key: "location",
    label: "Location",
  },

  {
    key: "specification",
    label: "Specification",
  },

  {
    key: "price_formatted",
    label: "Price",
  },

  {
    key: "owner",
    label: "Owner",
  },

  {
    key: "certificate",
    label: "Certificate",
  },

  {
    key: "status",
    label: "Status",
  },

  {
    key: "action",
    label: "Action",
  },
];

export default function PropertiesPage() {

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
// LISTING MODAL
// =========================

  const [
    openListingModal,
    setOpenListingModal,
  ] = useState(false);

  const [
    listingData,
    setListingData,
  ] = useState<any>(null);

  // =========================
  // FILTER STATES
  // =========================

  const [
    filterPropertyType,
    setFilterPropertyType,
  ] = useState("");

  const [
    filterMarketType,
    setFilterMarketType,
  ] = useState("");

  const [
    filterDistrict,
    setFilterDistrict,
  ] = useState("");

  const [
    filterCity,
    setFilterCity,
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus,
  ] = useState("");

  const [
    minPrice,
    setMinPrice,
  ] = useState("");

  const [
    maxPrice,
    setMaxPrice,
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
  // FETCH PROPERTIES
  // =========================

  async function fetchProperties() {

    try {

      setLoading(true);

      let query = supabase

        .from("properties")

        .select(`
          *,
          contacts (
            contact_id,
            name,
            phone
          )
        `, {
          count: "exact",
        });

      // =========================
      // FILTER PROPERTY TYPE
      // =========================

      if (filterPropertyType) {

        query = query.ilike(
          "property_type",
          `%${filterPropertyType}%`
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
      // FILTER STATUS
      // =========================

      if (filterStatus) {

        query = query.eq(
          "status",
          filterStatus
        );
      }

      // =========================
      // FILTER DISTRICT
      // =========================

      if (filterDistrict) {

        query = query.ilike(
          "district",
          `%${filterDistrict}%`
        );
      }

      // =========================
      // FILTER CITY
      // =========================

      if (filterCity) {

        query = query.ilike(
          "city",
          `%${filterCity}%`
        );
      }

      // =========================
      // FILTER MIN PRICE
      // =========================

      if (minPrice) {

        query = query.gte(
          "price",
          Number(minPrice)
        );
      }

      // =========================
      // FILTER MAX PRICE
      // =========================

      if (maxPrice) {

        query = query.lte(
          "price",
          Number(maxPrice)
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

        console.log(error);

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
            // PHOTO
            // =========================

            photo:
              item.photo_url ? (

                <a
                  href={item.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
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
                    text-gray-400
                    text-sm
                  "
                >
                  No Photo
                </span>
              ),

            // =========================
            // PROPERTY SUMMARY
            // =========================

            property_summary: (

              <div className="space-y-1">

                <div className="font-medium">
                  {item.property_type || "-"}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {item.market_type || "-"}
                </div>

              </div>
            ),

            // =========================
            // LOCATION
            // =========================

            location: (

              <div className="space-y-1">

                <div>
                  {item.district || "-"}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {item.city || "-"}
                </div>

              </div>
            ),

            // =========================
            // SPECIFICATION
            // =========================

            specification: (

              <div
                className="
                  text-sm
                  leading-6
                "
              >

                LT {item.land_size || 0} m²

                <br />

                LB {item.building_size || 0} m²

                <br />

                {item.bedroom || 0} KT /
                {item.bathroom || 0} KM

              </div>
            ),

            // =========================
            // PRICE
            // =========================

            price_formatted:

              item.price

                ? `Rp ${new Intl.NumberFormat(
                    "id-ID"
                  ).format(item.price)}`

                : "-",

            // =========================
            // OWNER
            // =========================

            owner: (

              <div className="space-y-1">

                <div>
                  {item.contacts?.name || "-"}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {item.contacts?.phone || "-"}
                </div>

              </div>
            ),

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

                    ${
                      item.status === "Draft"
                        ? "bg-gray-100 text-gray-700"

                      : item.status === "Active"
                        ? "bg-blue-100 text-blue-700"

                      : item.status === "Exclusive"
                        ? "bg-purple-100 text-purple-700"

                      : item.status === "Pending"
                        ? "bg-orange-100 text-orange-700"

                      : item.status === "Sold"
                        ? "bg-green-100 text-green-700"

                      : item.status === "Rented"
                        ? "bg-emerald-100 text-emerald-700"

                      : item.status === "Hold"
                        ? "bg-yellow-100 text-yellow-700"

                      : item.status === "Inactive"
                        ? "bg-red-100 text-red-700"

                      : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {item.status || "Draft"}
                </span>

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
                        "Chat Owner",

                      onClick:
                        () => {

                          const cleanPhone =
                            item.contacts?.phone
                              ?.replace(/\D/g, "")
                              ?.replace(/^0/, "62");

                          window.open(
                            `https://wa.me/${cleanPhone}`
                          );
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
                              "Are you sure want to delete this property?"
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
                                "properties"
                              )

                              .delete()

                              .eq(
                                "property_id",
                                item.property_id
                              );

                          if (
                            error
                          ) {

                            console.log(
                              error
                            );

                            return;
                          }

                          fetchProperties();
                        },
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
                      () => {

                        setListingData({

                          property_id:
                            item.property_id,

                          property_type:
                            item.property_type,

                          market_type:
                            item.market_type,

                          listing_price:
                            item.price,

                          district:
                            item.district,

                          city:
                            item.city,

                          address:
                            item.address,

                          photo_url:
                            item.photo_url,

                          contact_name:
                            item.contacts?.name || "",

                          phone:
                            item.contacts?.phone || "",
                        });

                        setOpenListingModal(
                          true
                        );
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

    fetchProperties();

  }, [
    currentPage,
    filterPropertyType,
    filterMarketType,
    filterDistrict,
    filterCity,
    filterStatus,
    minPrice,
    maxPrice,
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
            Properties
          </h1>

          <AddButton
            label="Add Property"

            onAdd={() => {

              setEditData(null);

              setOpenModal(true);
            }}

            onImport={() => {

              console.log(
                "import csv"
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

          <input
            type="text"
            placeholder="Property Type"
            value={filterPropertyType}
            onChange={(e) =>
              setFilterPropertyType(
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

            <option value="Active">
              Active
            </option>

            <option value="Exclusive">
              Exclusive
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

            <option value="Hold">
              Hold
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

          <input
            type="text"
            placeholder="District"
            value={filterDistrict}
            onChange={(e) =>
              setFilterDistrict(
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

          <input
            type="text"
            placeholder="City"
            value={filterCity}
            onChange={(e) =>
              setFilterCity(
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

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(
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

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
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

          <button
            onClick={() => {

              setFilterPropertyType("");

              setFilterMarketType("");

              setFilterDistrict("");

              setFilterCity("");

              setFilterStatus("");

              setMinPrice("");

              setMaxPrice("");

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
            Loading properties...
          </div>

        ) : (

          <>

            <DataTable
              columns={columns}

              data={data}

              onRowClick={(row) => {

                setSelectedRow({

                  property_id:
                    row.property_id,

                  property_type:
                    row.property_type,

                  market_type:
                    row.market_type,

                  certificate:
                    row.certificate,

                  status:
                    row.status,

                  price:
                    row.price,

                  land_size:
                    row.land_size,

                  building_size:
                    row.building_size,

                  bedroom:
                    row.bedroom,

                  bathroom:
                    row.bathroom,

                  notes:
                    row.notes,

                  contact_name:
                    row.contacts?.name || "",

                  phone:
                    row.contacts?.phone || "",

                  district:
                    row.district,

                  city:
                    row.city,

                  address:
                    row.address,

                  gps_address:
                    row.gps_address,

                  latitude:
                    row.latitude,

                  longitude:
                    row.longitude,

                  photo_url:
                    row.photo_url,
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
                setCurrentPage(
                  1
                )
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

        <AddPropertyModal
          open={
            openModal &&
            !editData
          }

          onClose={() => {

            setOpenModal(false);

            setEditData(null);
          }}

          onSuccess={() => {

            fetchProperties();
          }}
        />

        {/* EDIT MODAL */}

        <EditPropertyModal
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

            fetchProperties();
          }}
        />


{/* ADD LISTING */}

<AddListingModal
  open={openListingModal}

  data={listingData}

  onClose={() => {

    setOpenListingModal(
      false
    );

    setListingData(null);
  }}

  onSuccess={() => {

    setOpenListingModal(
      false
    );

    setListingData(null);
  }}
/>

        {/* DETAIL */}

        <PropertyDetailPopup
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