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

import AddContactModal from "@/components/modals/AddContactModal";

import EditContactModal from "@/components/modals/EditContactModal";

import AddLeadsModal from "@/components/modals/AddLeadsModal";

import AddInquiryModal from "@/components/modals/AddInquiryModal";

import ImportCsvPreviewModal from "@/components/modals/ImportCsvPreviewModal";

import ContactDetailPopUp from "@/components/popup/ContactDetailPopUp";

import { supabase } from "@/lib/supabase";

// =========================
// CONSTANTS
// =========================

const CONTACT_STATUS = [
  "New",
  "Contacted",
  "Active",
  "Inactive",
  "Closed",
];

const CONTACT_PRIORITY = [
  "HOT",
  "WARM",
  "COLD",
];

// =========================
// WHATSAPP UTILS
// =========================

function openWhatsApp(
  phone?: string
) {

  if (!phone) return;

  let cleanPhone = phone
    .replace(/\D/g, "");

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
// COLUMNS
// =========================

const columns = [

  {
    key: "no",
    label: "No",
  },

  {
    key: "name",
    label: "Name",
  },

  {
    key: "phone",
    label: "Phone",
  },

  {
    key: "contact_type",
    label: "Contact Type",
  },

  {
    key: "company",
    label: "Company",
  },

  {
    key: "status",
    label: "Status",
  },

  {
    key: "priority",
    label: "Priority",
  },

  {
    key:
      "next_followup_at",

    label:
      "Next Follow Up",
  },

  {
    key: "summary",
    label: "Summary",
  },

  {
    key: "action",
    label: "Action",
  },
];

export default function ContactsPage() {

  // =========================
  // STATES
  // =========================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedRow,
    setSelectedRow,
  ] = useState<any>(null);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    totalData,
    setTotalData,
  ] = useState(0);

  // =========================
  // MODALS
  // =========================

  const [
    openAddModal,
    setOpenAddModal,
  ] = useState(false);

  const [
    openEditModal,
    setOpenEditModal,
  ] = useState(false);

  const [
    openLeadModal,
    setOpenLeadModal,
  ] = useState(false);

  const [
    openInquiryModal,
    setOpenInquiryModal,
  ] = useState(false);

  const [
    openImportPreview,
    setOpenImportPreview,
  ] = useState(false);

  const [editData, setEditData] =
    useState<any>(null);

  const [
    selectedContact,
    setSelectedContact,
  ] = useState<any>(null);

  const [
    importData,
    setImportData,
  ] = useState<any[]>([]);

  // =========================
  // FILTERS
  // =========================

  const [
    searchName,
    setSearchName,
  ] = useState("");

  const [
    searchPhone,
    setSearchPhone,
  ] = useState("");

  const [
    filterContactType,
    setFilterContactType,
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus,
  ] = useState("");

  const [
    filterPriority,
    setFilterPriority,
  ] = useState("");

  // =========================
  // OPTIONS
  // =========================

  const [
    contactTypes,
    setContactTypes,
  ] = useState<string[]>([]);

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
  // FETCH CONTACT TYPES
  // =========================

  async function fetchContactTypes() {

    try {

      const {
        data,
        error,
      } = await supabase

        .from("contacts")

        .select(`
          contact_type
        `);

      if (error) {

        console.log(error);

        return;
      }

      const uniqueTypes = [
        ...new Set(
          (data || [])
            .map(
              (item) =>
                item.contact_type
            )
            .filter(Boolean)
        ),
      ];

      setContactTypes(
        uniqueTypes as string[]
      );

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // CREATE ACTIVITY
  // =========================

  async function createActivity({
    contact_id,
    activity_type,
    title,
    notes,
  }: any) {

    try {

      await supabase

        .from("activities")

        .insert([
          {
            contact_id,
            activity_type,
            title,
            notes,
            activity_date:
              new Date(),
          },
        ]);

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // HANDLE WHATSAPP
  // =========================

  async function handleWhatsApp(
    item: any
  ) {

    openWhatsApp(item.phone);

    try {

      const updatePayload: any =
        {
          last_whatsapp_opened_at:
            new Date(),

          contact_attempted_at:
            new Date(),

          updated_at:
            new Date(),
        };

      if (
        item.status === "New"
      ) {

        updatePayload.status =
          "Contacted";
      }

      await supabase

        .from("contacts")

        .update(updatePayload)

        .eq(
          "contact_id",
          item.contact_id
        );

      await createActivity({
        contact_id:
          item.contact_id,

        activity_type:
          "WHATSAPP_OPENED",

        title:
          "WhatsApp Opened",

        notes:
          "User opened WhatsApp from Contacts page.",
      });

      fetchContacts();

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // FETCH CONTACTS
  // =========================

  async function fetchContacts() {

    try {

      setLoading(true);

      let query = supabase

        .from("contacts")

        .select("*", {
          count: "exact",
        });

      if (searchName) {

        query = query.ilike(
          "name",
          `%${searchName}%`
        );
      }

      if (searchPhone) {

        query = query.ilike(
          "phone",
          `%${searchPhone}%`
        );
      }

      if (
        filterContactType
      ) {

        query = query.eq(
          "contact_type",
          filterContactType
        );
      }

      if (filterStatus) {

        query = query.eq(
          "status",
          filterStatus
        );
      }

      if (
        filterPriority
      ) {

        query = query.eq(
          "priority",
          filterPriority
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

      if (error) {

        console.log(error);

        return;
      }

      setTotalData(
        count || 0
      );

      const formattedData =
        (data || []).map(
          (
            item: any,
            index: number
          ) => ({

            ...item,

            no:
              startIndex +
              index +
              1,

            next_followup_at:
              item.next_followup_at
                ? new Date(
                    item.next_followup_at
                  ).toLocaleDateString(
                    "id-ID"
                  )
                : "-",

            summary:
              item.summary?.length >
              60

                ? `${item.summary.slice(
                    0,
                    60
                  )}...`

                : item.summary ||
                  "-",

            priority: (

              <span
                className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold

                  ${
                    item.priority ===
                    "HOT"

                      ? `
                        bg-red-100
                        text-red-700
                      `

                      : item.priority ===
                        "WARM"

                      ? `
                        bg-orange-100
                        text-orange-700
                      `

                      : `
                        bg-gray-100
                        text-gray-700
                      `
                  }
                `}
              >
                {item.priority ||
                  "-"}
              </span>
            ),

            status: (

              <span
                className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold

                  ${
                    item.status ===
                    "New"

                      ? `
                        bg-blue-100
                        text-blue-700
                      `

                      : item.status ===
                        "Contacted"

                      ? `
                        bg-yellow-100
                        text-yellow-700
                      `

                      : item.status ===
                        "Active"

                      ? `
                        bg-green-100
                        text-green-700
                      `

                      : item.status ===
                        "Inactive"

                      ? `
                        bg-gray-100
                        text-gray-700
                      `

                      : `
                        bg-red-100
                        text-red-700
                      `
                  }
                `}
              >
                {item.status ||
                  "-"}
              </span>
            ),

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
                        "WhatsApp",

                      onClick:
                        async () => {

                          await handleWhatsApp(
                            item
                          );
                        },
                    },

                    {
                      label:
                        "Create Lead",

                      onClick: () => {

                        setSelectedContact(
                          item
                        );

                        setOpenLeadModal(
                          true
                        );
                      },
                    },

                    {
                      label:
                        "Create Inquiry",

                      onClick: () => {

                        setSelectedContact(
                          item
                        );

                        setOpenInquiryModal(
                          true
                        );
                      },
                    },

                    {
                      label:
                        "Edit",

                      onClick: () => {

                        setEditData(
                          item
                        );

                        setOpenEditModal(
                          true
                        );
                      },
                    },

                    {
                      label:
                        "Delete",

                      danger: true,

                      onClick:
                        async () => {

                          const confirmDelete =
                            confirm(
                              "Are you sure want to delete this contact?"
                            );

                          if (
                            !confirmDelete
                          ) {

                            return;
                          }

                          const {
                            error,
                          } =
                            await supabase

                              .from(
                                "contacts"
                              )

                              .delete()

                              .eq(
                                "contact_id",
                                item.contact_id
                              );

                          if (
                            error
                          ) {

                            console.log(
                              error
                            );

                            return;
                          }

                          await createActivity({
                            contact_id:
                              item.contact_id,

                            activity_type:
                              "CONTACT_DELETED",

                            title:
                              "Contact Deleted",

                            notes:
                              "Contact deleted from Contacts page.",
                          });

                          fetchContacts();
                        },
                    },
                  ]}
                />

              </div>
            ),
          })
        );

      setData(
        formattedData
      );

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

    fetchContacts();

  }, [
    currentPage,
    searchName,
    searchPhone,
    filterContactType,
    filterStatus,
    filterPriority,
  ]);

  useEffect(() => {

    fetchContactTypes();

  }, []);

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

          <div>

            <h1
              className="
                text-2xl
                font-bold
              "
            >
              Contacts
            </h1>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Relationship &
              operational memory center
            </p>

          </div>

          <AddButton
            label="Add Contact"

            onAdd={() => {

              setOpenAddModal(
                true
              );
            }}

            onImport={(data) => {

              setImportData(data);

              setOpenImportPreview(
                true
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
            placeholder="Search name"
            value={searchName}
            onChange={(e) =>
              setSearchName(
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
            placeholder="Search phone"
            value={searchPhone}
            onChange={(e) =>
              setSearchPhone(
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
              filterContactType
            }

            onChange={(e) =>
              setFilterContactType(
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
              All Contact Type
            </option>

            {contactTypes.map(
              (type) => (

                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              )
            )}

          </select>

          <select
            value={
              filterStatus
            }

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

            {CONTACT_STATUS.map(
              (status) => (

                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}

          </select>

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

            {CONTACT_PRIORITY.map(
              (
                priority
              ) => (

                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>
              )
            )}

          </select>

          <button
            onClick={() => {

              setSearchName("");

              setSearchPhone("");

              setFilterContactType("");

              setFilterStatus("");

              setFilterPriority("");

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
              rounded-2xl
              p-10
              text-center
              text-gray-500
              bg-white
            "
          >
            Loading contacts...
          </div>

        ) : (

          <>

            <DataTable
              columns={columns}

              data={data}

              onRowClick={(
                row
              ) => {

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

        {/* ADD CONTACT */}

        <AddContactModal
          open={openAddModal}

          onClose={() => {

            setOpenAddModal(
              false
            );
          }}

          onSuccess={() => {

            fetchContacts();

            setOpenAddModal(
              false
            );
          }}
        />

        {/* EDIT CONTACT */}

        <EditContactModal
          open={openEditModal}

          data={editData}

          onClose={() => {

            setOpenEditModal(
              false
            );

            setEditData(null);
          }}

          onSuccess={() => {

            fetchContacts();

            setOpenEditModal(
              false
            );

            setEditData(null);
          }}
        />

        {/* ADD LEAD */}

        <AddLeadsModal
          open={openLeadModal}

          selectedContact={
            selectedContact
          }

          onClose={() => {

            setOpenLeadModal(
              false
            );

            setSelectedContact(
              null
            );
          }}

          onSuccess={() => {

            fetchContacts();

            setOpenLeadModal(
              false
            );

            setSelectedContact(
              null
            );
          }}
        />

        {/* ADD INQUIRY */}

        <AddInquiryModal
          open={
            openInquiryModal
          }

          contact={
            selectedContact
          }

          onClose={() => {

            setOpenInquiryModal(
              false
            );

            setSelectedContact(
              null
            );
          }}

          onSuccess={() => {

            fetchContacts();

            setOpenInquiryModal(
              false
            );

            setSelectedContact(
              null
            );
          }}
        />

        {/* IMPORT CSV PREVIEW */}

        <ImportCsvPreviewModal
          open={
            openImportPreview
          }

          title="Import Contacts CSV"

          columns={[
            {
              key: "name",
              label: "Name",
            },
            {
              key: "phone",
              label: "Phone",
            },
            {
              key: "email",
              label: "Email",
            },
            {
              key: "company",
              label: "Company",
            },
          ]}

          data={importData}

          onClose={() => {

            setOpenImportPreview(
              false
            );

            setImportData([]);

          }}

          onImport={async () => {

            try {

              const formattedData =
                importData.map(
                  (item) => ({

                    name:
                      item.name ||
                      null,

                    phone:
                      item.phone ||
                      null,

                    email:
                      item.email ||
                      null,

                    company:
                      item.company ||
                      null,

                    contact_type:
                      item.contact_type ||
                      null,

                    priority:
                      "WARM",

                    status:
                      "New",

                    created_at:
                      new Date(),

                    updated_at:
                      new Date(),
                  })
                );

              const {
                error,
              } = await supabase

                .from(
                  "contacts"
                )

                .insert(
                  formattedData
                );

              if (error) {

                console.log(error);

                alert(
                  JSON.stringify(error)
                );

                return;
              }

              alert(
                "Contacts imported"
              );

              fetchContacts();

              setOpenImportPreview(
                false
              );

              setImportData([]);

            } catch (error) {

              console.log(error);
            }
          }}
        />

        {/* DETAIL POPUP */}

        <ContactDetailPopUp
          open={!!selectedRow}

          data={selectedRow}

          onClose={() =>
            setSelectedRow(
              null
            )
          }

          onEdit={() => {

            setEditData(
              selectedRow
            );

            setOpenEditModal(
              true
            );
          }}
        />

      </div>

    </MainLayout>
  );
}