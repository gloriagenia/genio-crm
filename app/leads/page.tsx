"use client";

import {
  useEffect,
  useState,
} from "react";

import MainLayout from "@/components/layout/MainLayout";

import DataTable from "@/components/tables/DataTable";

import Pagination from "@/components/pagination/Pagination";

import AddButton from "@/components/buttons/AddButton";

import ViewActions from "@/components/actions/ViewActions";

import AddLeadsModal from "@/components/modals/AddLeadsModal";

import EditLeadsModal from "@/components/modals/EditLeadsModal";

import LeadDetailPopUp from "@/components/popup/LeadDetailPopUp";

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
    key: "contact",
    label: "Contact",
  },

  {
    key: "requirement",
    label: "Requirement",
  },

  {
    key: "budget",
    label: "Budget",
  },

  {
    key: "location",
    label: "Location",
  },

  {
    key: "status",
    label: "Status",
  },

  {
    key: "aging",
    label: "Aging",
  },

  {
    key: "priority",
    label: "Priority",
  },

  {
    key: "action",
    label: "Action",
  },
];

export default function LeadsPage() {

  // =========================
  // STATES
  // =========================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState<any>(null);

  const [editData, setEditData] =
    useState<any>(null);

  const [
    openAddModal,
    setOpenAddModal,
  ] = useState(false);

  const [
    openEditModal,
    setOpenEditModal,
  ] = useState(false);

  const [
    totalData,
    setTotalData,
  ] = useState(0);

  // =========================
  // FILTERS
  // =========================

  const [search, setSearch] =
    useState("");

  const [
    filterPriority,
    setFilterPriority,
  ] = useState("");

  const [
    filterMarketType,
    setFilterMarketType,
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus,
  ] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const rowsPerPage = 10;

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const endIndex =
    startIndex +
    rowsPerPage -
    1;

  // =========================
  // FORMAT CURRENCY
  // =========================

  function formatCurrency(
    value?: number
  ) {

    if (!value) return "-";

    return `Rp ${new Intl.NumberFormat(
      "id-ID"
    ).format(value)}`;
  }

  // =========================
  // SLA
  // =========================

  function getSLA(
    priority: string
  ) {

    switch (priority) {

      case "HOT":
        return 1;

      case "WARM":
        return 3;

      case "COLD":
        return 7;

      default:
        return 3;
    }
  }

  // =========================
  // AGING
  // =========================

  function getAging(
    lastContact?: string
  ) {

    if (!lastContact) {

      return {
        days: 999,
        label:
          "No Follow Up",
      };
    }

    const today =
      new Date();

    const last =
      new Date(
        lastContact
      );

    const diff =
      today.getTime() -
      last.getTime();

    const days =
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );

    return {

      days,

      label:
        days === 0
          ? "Today"
          : `${days} Days`,
    };
  }

  // =========================
  // PRIORITY COLOR
  // =========================

  function getPriorityClass(
    priority: string
  ) {

    switch (priority) {

      case "HOT":

        return `
          bg-red-100
          text-red-700
        `;

      case "WARM":

        return `
          bg-orange-100
          text-orange-700
        `;

      case "COLD":

        return `
          bg-gray-100
          text-gray-700
        `;

      default:

        return `
          bg-gray-100
          text-gray-700
        `;
    }
  }

  // =========================
  // WHATSAPP
  // =========================

  function openWhatsApp(
    phone?: string
  ) {

    if (!phone) return;

    let cleanPhone =
      phone.replace(
        /\D/g,
        ""
      );

    if (
      cleanPhone.startsWith(
        "0"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone.slice(1);
    }

    if (
      cleanPhone.startsWith(
        "8"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone;
    }

    if (
      !cleanPhone.startsWith(
        "62"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone;
    }

    window.open(
      `https://wa.me/${cleanPhone}`,
      "_blank"
    );
  }

  // =========================
  // FETCH
  // =========================

  async function fetchLeads() {

    try {

      setLoading(true);

      let query = supabase

        .from("leads")

        .select(
          `
            *,

            contacts!leads_contact_id_fkey (
              contact_id,
              name,
              phone
            ),

            leads_statuses!leads_lead_status_id_fkey (
              lead_status_id,
              lead_status_name
            ),

            sources!leads_source_id_fkey (
              source_id,
              source_name
            )
          `,
          {
            count: "exact",
          }
        );

      // =========================
      // SEARCH
      // =========================

      if (search) {

        query = query.or(`
          requirements.ilike.%${search}%,
          district.ilike.%${search}%,
          city.ilike.%${search}%
        `);
      }

      // =========================
      // FILTER PRIORITY
      // =========================

      if (
        filterPriority
      ) {

        query = query.eq(
          "priority",
          filterPriority
        );
      }

      // =========================
      // FILTER MARKET
      // =========================

      if (
        filterMarketType
      ) {

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
          "lead_status_id",
          filterStatus
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
          endIndex
        );

      // =========================
      // ERROR
      // =========================

      if (error) {

        console.error(error);

        alert(error.message);

        return;
      }

      setTotalData(
        count || 0
      );

      // =========================
      // FORMAT DATA
      // =========================

      const formattedData =
        (data || []).map(
          (
            item: any,
            index: number
          ) => {

            const aging =
              getAging(
                item.last_contact
              );

            const sla =
              getSLA(
                item.priority
              );

            const overdue =
              aging.days > sla;

            return {

              ...item,

              no:
                startIndex +
                index +
                1,

              // =========================
              // CONTACT
              // =========================

              contact: (

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
              // REQUIREMENT
              // =========================

              requirement: (

                <div className="space-y-1">

                  <div className="text-sm">
                    {
                      item.market_type ||
                      "-"
                    }
                  </div>

                  <div
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    {
                      item.property_type_id ||
                      "-"
                    }
                  </div>

                </div>
              ),

              // =========================
              // BUDGET
              // =========================

              budget: (

                <div className="space-y-1">

                  <div className="text-sm">
                    {formatCurrency(
                      item.budget_min
                    )}
                  </div>

                  <div
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    -
                    {" "}
                    {formatCurrency(
                      item.budget_max
                    )}
                  </div>

                </div>
              ),

              // =========================
              // LOCATION
              // =========================

              location: (

                <div className="space-y-1">

                  <div className="text-sm">
                    {
                      item.district ||
                      "-"
                    }
                  </div>

                  <div
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    {
                      item.city ||
                      "-"
                    }
                  </div>

                </div>
              ),

              // =========================
              // STATUS
              // =========================

              status: (

                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-blue-100
                    text-blue-700
                    px-3
                    py-1
                    text-xs
                    font-semibold
                  "
                >
                  {
                    item
                      .leads_statuses
                      ?.lead_status_name ||
                    "-"
                  }
                </span>
              ),

              // =========================
              // AGING
              // =========================

              aging: (

                <div>

                  {overdue ? (

                    <div
                      className="
                        text-red-600
                        font-semibold
                        text-sm
                      "
                    >
                      ⚠ Overdue
                      {" "}
                      {
                        aging.label
                      }
                    </div>

                  ) : (

                    <div
                      className="
                        text-sm
                      "
                    >
                      {
                        aging.label
                      }
                    </div>

                  )}

                </div>
              ),

              // =========================
              // PRIORITY
              // =========================

              priority: (

                <span
                  className={`
                    inline-flex
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold

                    ${getPriorityClass(
                      item.priority
                    )}
                  `}
                >
                  {
                    item.priority ||
                    "-"
                  }
                </span>
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
                              item
                                .contacts
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

                            setOpenEditModal(
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
                                "Delete this lead?"
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
                                  "leads"
                                )

                                .delete()

                                .eq(
                                  "leads_id",
                                  item.leads_id
                                );

                            if (
                              error
                            ) {

                              console.error(
                                error
                              );

                              alert(
                                error.message
                              );

                              return;
                            }

                            fetchLeads();
                          },
                      },
                    ]}
                  />

                </div>
              ),
            };
          }
        );

      setData(
        formattedData
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {

    fetchLeads();

  }, [
    currentPage,
    search,
    filterPriority,
    filterMarketType,
    filterStatus,
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
            Leads
          </h1>

          <AddButton
            label="Add Lead"

            onAdd={() => {

              setOpenAddModal(
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
            bg-white
            p-4
            flex
            flex-wrap
            gap-3
          "
        >

          <input
            type="text"
            placeholder="Search"
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

          <select
            value={
              filterMarketType
            }
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
              All Market
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

          <button
            onClick={() => {

              setSearch("");

              setFilterPriority("");

              setFilterMarketType("");

              setFilterStatus("");

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
            Loading leads...
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

        <AddLeadsModal
          open={
            openAddModal
          }

          onClose={() =>
            setOpenAddModal(
              false
            )
          }

          onSuccess={() => {

            fetchLeads();

            setOpenAddModal(
              false
            );
          }}
        />

        {/* EDIT */}

        <EditLeadsModal
          open={
            openEditModal
          }

          data={editData}

          onClose={() => {

            setOpenEditModal(
              false
            );

            setEditData(
              null
            );
          }}

          onSuccess={() => {

            fetchLeads();

            setOpenEditModal(
              false
            );

            setEditData(
              null
            );
          }}
        />

        {/* DETAIL */}

        <LeadDetailPopUp
          open={
            !!selectedRow
          }

          data={
            selectedRow
          }

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