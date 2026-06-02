"use client";

import {
  useEffect,
  useState,
} from "react";

import MainLayout from "@/components/layout/MainLayout";

import DataTable from "@/components/tables/DataTable";

import Pagination from "@/components/ui/Pagination";

import AddButton from "@/components/buttons/AddButton";

import ViewActions from "@/components/actions/ViewActions";

import AddInquiryModal from "@/components/modals/AddInquiryModal";

import EditInquiryModal from "@/components/modals/EditInquiryModal";

import InquiryDetailPopUp from "@/components/popup/InquiryDetailPopUp";

import { supabase } from "@/lib/supabase";

// =========================
// WHATSAPP
// =========================

function openWhatsApp(
  phone?: string
) {

  if (!phone) return;

  let cleanPhone =
    phone.replace(/\D/g, "");

  if (
    cleanPhone.startsWith("0")
  ) {

    cleanPhone =
      "62" +
      cleanPhone.slice(1);
  }

  if (
    cleanPhone.startsWith("8")
  ) {

    cleanPhone =
      "62" + cleanPhone;
  }

  if (
    !cleanPhone.startsWith("62")
  ) {

    cleanPhone =
      "62" + cleanPhone;
  }

  window.open(
    `https://wa.me/${cleanPhone}`,
    "_blank"
  );
}

// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(
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
// COLUMNS
// =========================

const columns = [

  {
    key: "no",
    label: "No",
  },

  {
    key: "client",
    label: "Client",
  },

  {
    key: "category",
    label: "Category",
  },

  {
    key: "property_type",
    label: "Property Type",
  },

  {
    key: "location",
    label: "Location",
  },

  {
    key: "budget",
    label: "Budget",
  },

  {
    key: "priority",
    label: "Priority",
  },

  {
    key: "next_action",
    label: "Next Action",
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

export default function InquiriesPage() {

  // =========================
  // STATES
  // =========================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState<any>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [editData, setEditData] =
    useState<any>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalData, setTotalData] =
    useState(0);

  // =========================
  // FILTERS
  // =========================

  const [
    filterName,
    setFilterName,
  ] = useState("");

  const [
    filterCategory,
    setFilterCategory,
  ] = useState("");

  const [
    filterPropertyType,
    setFilterPropertyType,
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
    filterPriority,
    setFilterPriority,
  ] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const rowsPerPage = 10;

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const endIndex =
    startIndex +
    rowsPerPage -
    1;

  // =========================
  // FETCH
  // =========================

  async function fetchInquiries() {

    try {

      setLoading(true);

      let query = supabase

        .from("inquiries")

        .select(
          `
            *,
            contacts (
              contact_id,
              name,
              phone
            ),
            inquiry_statuses (
              inquiry_status_id,
              inquiry_status_name
            ),
            property_type (
              property_type_id,
              property_type_name
            )
          `,
          {
            count: "exact",
          }
        );

      // =========================
      // FILTER NAME
      // =========================

      if (filterName) {

        query = query.ilike(
          "requirement_summary",
          `%${filterName}%`
        );
      }

      // =========================
      // FILTER CATEGORY
      // =========================

      if (filterCategory) {

        query = query.eq(
          "inquiry_category",
          filterCategory
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
      // FILTER PRIORITY
      // =========================

      if (filterPriority) {

        query = query.eq(
          "priority",
          filterPriority
        );
      }

      const {

        data: inquiryData,

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
          endIndex
        );

      console.log(
        "SUPABASE ERROR:",
        error
      );

      console.log(
        "SUPABASE DATA:",
        inquiryData
      );

      if (error) {

        return;
      }

      // =========================
      // FILTER PROPERTY TYPE
      // =========================

      let filteredData =
        inquiryData || [];

      if (
        filterPropertyType
      ) {

        filteredData =
          filteredData.filter(
            (item: any) =>
              item.property_type
                ?.property_type_name
                ?.toLowerCase()
                .includes(
                  filterPropertyType.toLowerCase()
                )
          );
      }

      setTotalData(
        count || 0
      );

      // =========================
      // FORMAT DATA
      // =========================

      const formattedData =
        filteredData.map(
          (
            item: any,
            index: number
          ) => ({

            ...item,

            no:
              startIndex +
              index +
              1,

            // =========================
            // CLIENT
            // =========================

            client: (

              <div className="space-y-1">

                <div className="font-medium">
                  {
                    item.contacts
                      ?.name || "-"
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
                      ?.phone || "-"
                  }
                </div>

              </div>
            ),

            // =========================
            // CATEGORY
            // =========================

            category: (

              <div className="space-y-1">

                <div className="font-medium">
                  {
                    item.inquiry_category || "-"
                  }
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {
                    item.market_type || "-"
                  }
                </div>

              </div>
            ),

            // =========================
            // PROPERTY TYPE
            // =========================

            property_type: (

              <div className="text-sm">

                {
                  item.property_type
                    ?.property_type_name || "-"
                }

              </div>
            ),

            // =========================
            // LOCATION
            // =========================

            location: (

              <div className="space-y-1">

                <div>
                  {
                    item.district || "-"
                  }
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {
                    item.city || "-"
                  }
                </div>

              </div>
            ),

            // =========================
            // BUDGET
            // =========================

            budget: (

              <div className="space-y-1">

                <div>
                  {formatRupiah(
                    item.budget_min
                  )}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {formatRupiah(
                    item.budget_max
                  )}
                </div>

              </div>
            ),

            // =========================
            // PRIORITY
            // =========================

            priority: (

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
                      item.priority === "HOT"

                        ? "bg-red-100 text-red-700"

                        : item.priority === "WARM"

                        ? "bg-yellow-100 text-yellow-700"

                        : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {item.priority || "-"}
                </span>

              </div>
            ),

            // =========================
            // NEXT ACTION
            // =========================

            next_action: (

              <div className="space-y-1">

                <div className="font-medium">
                  {
                    item.next_action || "-"
                  }
                </div>

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {item.next_followup_at

                    ? new Date(
                        item.next_followup_at
                      ).toLocaleString(
                        "id-ID"
                      )

                    : "-"}

                </div>

              </div>
            ),

            // =========================
            // STATUS
            // =========================

            status: (

              <div className="flex">

                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    bg-blue-100
                    text-blue-700
                  "
                >
                  {
                    item
                      .inquiry_statuses
                      ?.inquiry_status_name ||

                    "-"
                  }
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

                    // =========================
                    // WHATSAPP
                    // =========================

                    {
                      label:
                        "WhatsApp",

                      onClick:
                        () => {

                          openWhatsApp(
                            item.contacts
                              ?.phone
                          );
                        },
                    },

                    // =========================
                    // EDIT
                    // =========================

                    {
                      label:
                        "Edit",

                      onClick:
                        () => {

                          setEditData(
                            item
                          );

                          setOpenModal(
                            true
                          );
                        },
                    },

                    // =========================
                    // DELETE
                    // =========================

                    {
                      label:
                        "Delete",

                      danger:
                        true,

                      onClick:
                        async () => {

                          const confirmDelete =
                            confirm(
                              "Are you sure want to delete this inquiry?"
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
                                "inquiries"
                              )

                              .delete()

                              .eq(
                                "inquiry_id",
                                item.inquiry_id
                              );

                          if (
                            error
                          ) {

                            console.log(
                              error
                            );

                            return;
                          }

                          fetchInquiries();
                        },
                    },
                  ]}
                />

              </div>
            ),
          })
        );

      console.log(
        "FORMATTED:",
        formattedData
      );

      setData(
        formattedData
      );

    } catch (error) {

      console.log(
        "CATCH ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {

    fetchInquiries();

  }, [

    currentPage,

    filterName,

    filterCategory,

    filterPropertyType,

    filterDistrict,

    filterCity,

    filterPriority,
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
            Inquiries
          </h1>

          <AddButton
            label="Add Inquiry"

            onAdd={() => {

              setEditData(null);

              setOpenModal(
                true
              );
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

          <input
            type="text"
            placeholder="Search Requirement"
            value={filterName}
            onChange={(e) =>
              setFilterName(
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
            value={
              filterCategory
            }
            onChange={(e) =>
              setFilterCategory(
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
              All Category
            </option>

            <option value="Buy">
              Buy
            </option>

            <option value="Rent">
              Rent
            </option>

            <option value="Sell">
              Sell
            </option>

          </select>

          <input
            type="text"
            placeholder="Property Type"
            value={
              filterPropertyType
            }
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

          <select
            value={
              filterPriority
            }
            onChange={(e) =>
              setFilterPriority(
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
              All Priority
            </option>

            <option value="HOT">
              HOT
            </option>

            <option value="WARM">
              WARM
            </option>

            <option value="COLD">
              COLD
            </option>

          </select>

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
            Loading inquiries...
          </div>

        ) : (

          <>

            <DataTable
              columns={columns}
              data={data}
              onRowClick={(row) => {

                setSelectedRow(
                  row
                );
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

        {/* ADD */}

        <AddInquiryModal
          open={
            openModal &&
            !editData
          }

          onClose={() => {

            setOpenModal(
              false
            );

            setEditData(
              null
            );
          }}

          onSuccess={() => {

            fetchInquiries();
          }}
        />

        {/* EDIT */}

        <EditInquiryModal
          open={
            openModal &&
            !!editData
          }

          data={editData}

          onClose={() => {

            setOpenModal(
              false
            );

            setEditData(
              null
            );
          }}

          onSuccess={() => {

            fetchInquiries();
          }}
        />

        {/* DETAIL */}

        <InquiryDetailPopUp
          open={!!selectedRow}

          data={selectedRow}

          onClose={() =>
            setSelectedRow(
              null
            )
          }
        />

      </div>

    </MainLayout>
  );
}