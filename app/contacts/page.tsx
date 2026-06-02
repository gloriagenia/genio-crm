"use client";

import {
  useEffect,
  useState,
} from "react";

import MainLayout from "@/components/layout/MainLayout";

import Pagination from "@/components/ui/Pagination";

import AddContactModal from "@/components/modals/AddContactModal";

import EditContactModal from "@/components/modals/EditContactModal";

import AddLeadsModal from "@/components/modals/AddLeadsModal";

import AddInquiryModal from "@/components/modals/AddInquiryModal";

import ContactDetailPopUp from "@/components/contacts/ContactDetailPopUp";

import ContactsHeader from "@/components/contacts/ContactsHeader";

import ContactsFilters from "@/components/contacts/ContactsFilters";

import ContactsTable from "@/components/contacts/ContactsTable";

import ContactsMobileCard from "@/components/contacts/ContactsMobileCard";

import ViewActions from "@/components/actions/ViewActions";

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
    key: "status",
    label: "Status",
  },

  {
    key: "next_followup_at",
    label: "Next Followup",
  },

  {
    key: "action",
    label: "Action",
  },
];

// =========================
// WHATSAPP
// =========================

function openWhatsApp(
  phone?: string
) {
  if (!phone) return;

  let cleanPhone = phone.replace(
    /\D/g,
    ""
  );

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
    selectedContact,
    setSelectedContact,
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
    openAddLeadModal,
    setOpenAddLeadModal,
  ] = useState(false);

  const [
    openAddInquiryModal,
    setOpenAddInquiryModal,
  ] = useState(false);

  const [editData, setEditData] =
    useState<any>(null);

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
    filterStatus,
    setFilterStatus,
  ] = useState("");

  const [
    sortOrder,
    setSortOrder,
  ] = useState("desc");

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

      // =========================
      // FILTERS
      // =========================

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

      if (filterStatus) {
        query = query.eq(
          "status",
          filterStatus
        );
      }

      // =========================
      // FETCH
      // =========================

      const {
        data,
        error,
        count,
      } = await query
        .order(
          "created_at",
          {
            ascending:
              sortOrder ===
              "asc",
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

      // =========================
      // FORMAT DATA
      // =========================

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
                          openWhatsApp(
                            item.phone
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

                        setOpenAddLeadModal(
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

                        setOpenAddInquiryModal(
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

                      onClick:
                        async () => {
                          const confirmDelete =
                            window.confirm(
                              "Delete this contact?"
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
                                "contacts"
                              )
                              .delete()
                              .eq(
                                "id",
                                item.id
                              );

                          if (
                            error
                          ) {
                            console.log(
                              error
                            );

                            return;
                          }

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
  // EFFECTS
  // =========================

  useEffect(() => {
    fetchContacts();
  }, [
    currentPage,
    searchName,
    searchPhone,
    filterStatus,
    sortOrder,
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

        <ContactsHeader
          onAdd={() => {
            setOpenAddModal(
              true
            );
          }}
        />

        {/* FILTERS */}

        <ContactsFilters
          searchName={
            searchName
          }
          setSearchName={
            setSearchName
          }
          searchPhone={
            searchPhone
          }
          setSearchPhone={
            setSearchPhone
          }
          filterStatus={
            filterStatus
          }
          setFilterStatus={
            setFilterStatus
          }
          sortOrder={
            sortOrder
          }
          setSortOrder={
            setSortOrder
          }
          onReset={() => {
            setSearchName("");

            setSearchPhone("");

            setFilterStatus("");

            setSortOrder(
              "desc"
            );

            setCurrentPage(1);
          }}
        />

        {/* MOBILE */}

        <ContactsMobileCard
          data={data}
          loading={loading}
          onRowClick={(
            row
          ) => {
            setSelectedRow(
              row
            );
          }}
        />

        {/* TABLE */}

        <ContactsTable
          loading={loading}
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

        {/* PAGINATION */}

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
          open={
            openAddLeadModal
          }
          selectedContact={
            selectedContact
          }
          onClose={() => {
            setOpenAddLeadModal(
              false
            );

            setSelectedContact(
              null
            );
          }}
          onSuccess={() => {
            fetchContacts();

            setOpenAddLeadModal(
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
            openAddInquiryModal
          }
          selectedContact={
            selectedContact
          }
          onClose={() => {
            setOpenAddInquiryModal(
              false
            );

            setSelectedContact(
              null
            );
          }}
          onSuccess={() => {
            fetchContacts();

            setOpenAddInquiryModal(
              false
            );

            setSelectedContact(
              null
            );
          }}
        />

        {/* DETAIL */}

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