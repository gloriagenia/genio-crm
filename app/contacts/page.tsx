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

import ContactDetailPopUp from "@/components/contacts/ContactDetailPopUp";

import ContactsHeader from "@/components/contacts/ContactsHeader";

import ContactsFilters from "@/components/contacts/ContactsFilters";

import ContactsTable from "@/components/contacts/ContactsTable";

import ContactsMobileCard from "@/components/contacts/ContactsMobileCard";

import ContactActionsDropdown from "@/components/contacts/ContactActionsDropdown";

import PriorityBadge from "@/components/contacts/PriorityBadge";

import FollowupBadge from "@/components/contacts/FollowupBadge";

import ContactTypeBadge from "@/components/contacts/ContactTypeBadge";

import {formatRelativeDate,} from "@/src/utils/formatRelativeDate";

import { supabase } from "@/lib/supabase";

import {
  getFollowupStatus,
} from "@/src/utils/getFollowupStatus";

import {
  openWhatsApp,
} from "@/src/utils/openWhatsApp";

// =========================
// COLUMNS
// =========================

const columns = [
  {
    key: "name",
    label: "Contact",
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
    key: "last_contacted",
    label: "Last Contacted",
  },

  {
    key: "next_followup_at",
    label: "Next Follow Up",
  },

  {
    key: "action",
    label: "",
  },
];

// =========================
// COMPONENT
// =========================

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

  const [editData, setEditData] =
    useState<any>(null);

  // =========================
  // FILTERS
  // =========================

  const [search, setSearch] =
    useState("");

  const [
    filterStatus,
    setFilterStatus,
  ] = useState("");

  const [
    filterPriority,
    setFilterPriority,
  ] = useState("");

  const [
    filterFollowup,
    setFilterFollowup,
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
      // SEARCH
      // =========================

      if (search) {

        query = query.or(`
          name.ilike.%${search}%,
          phone.ilike.%${search}%,
          company.ilike.%${search}%
        `);
      }

      // =========================
      // STATUS
      // =========================

      if (filterStatus) {

        query = query.eq(
          "status",
          filterStatus
        );
      }

      // =========================
      // PRIORITY
      // =========================

      if (filterPriority) {

        query = query.eq(
          "priority",
          filterPriority
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

      // =========================
      // FOLLOWUP FILTER
      // =========================

      let filteredData =
        data || [];

      if (filterFollowup) {

        filteredData =
          filteredData.filter(
            (item) => {

              const followup =
                getFollowupStatus(
                  item.next_followup_at
                );

              return (
                followup.status ===
                filterFollowup
              );
            }
          );
      }

      // =========================
      // TOTAL
      // =========================

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
            last_contacted:
              item.last_whatsapp_opened_at
                ? formatRelativeDate(
                    item.last_whatsapp_opened_at
                  )
                : "-",
            contact_type: (

              <ContactTypeBadge
                type={
                  item.contact_type
                }
                size="sm"
              />

            ),

            priority: (

              <PriorityBadge
                priority={
                  item.priority
                }
                size="sm"
              />

            ),

            status: (

              <div
                className="
                  inline-flex
                  items-center

                  rounded-full

                  bg-slate-100

                  px-3
                  py-1

                  text-xs
                  font-semibold

                  text-slate-600
                "
              >
                {item.status ||
                  "-"}
              </div>

            ),

            next_followup_at: (

              <FollowupBadge
                date={
                  item.next_followup_at
                }
                size="sm"
              />

            ),

            action: (
  <ContactActionsDropdown
    contact={item}
    onWhatsApp={async () => {
      await openWhatsApp({
        phone: item.phone,
        contactId: item.contact_id,
        source: "Contacts Table",
      });

      fetchContacts();
    }}
    onCreateLead={() => {
      setSelectedContact({
        contact_id:
          item.contact_id,

        name:
          item.name,

        phone:
          item.phone,

        source_id:
          item.source_id,

        company:
          item.company,

        contact_type:
          item.contact_type,
      });

      setOpenAddLeadModal(
        true
      );
    }}
    onEdit={() => {
      setEditData(item);

      setOpenEditModal(
        true
      );
    }}
    onDelete={async () => {
      const confirmDelete =
        window.confirm(
          "Delete this contact?"
        );

      if (!confirmDelete)
        return;

      const { error } =
        await supabase
          .from("contacts")
          .delete()
          .eq(
            "contact_id",
            item.contact_id
          );

      if (error) {
        console.log(error);
        return;
      }

      fetchContacts();
    }}
  />

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
    search,
    filterStatus,
    filterPriority,
    filterFollowup,
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

  // =========================
  // RENDER
  // =========================

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
          search={search}
          setSearch={setSearch}
          filterStatus={
            filterStatus
          }
          setFilterStatus={
            setFilterStatus
          }
          filterPriority={
            filterPriority
          }
          setFilterPriority={
            setFilterPriority
          }
          filterFollowup={
            filterFollowup
          }
          setFilterFollowup={
            setFilterFollowup
          }
          sortOrder={
            sortOrder
          }
          setSortOrder={
            setSortOrder
          }
          totalData={totalData}
          onReset={() => {

            setSearch("");

            setFilterStatus("");

            setFilterPriority("");

            setFilterFollowup("");

            setSortOrder(
              "desc"
            );

            setCurrentPage(1);
          }}
        />

        <ContactsMobileCard
  data={data}
  loading={loading}
  onRowClick={(row) => {
    setSelectedRow(row);
  }}
  onCreateLead={(row) => {
    setSelectedContact({
      contact_id:
        row.contact_id,

      name:
        row.name,

      phone:
        row.phone,

      source_id:
        row.source_id,

      company:
        row.company,

      contact_type:
        row.contact_type,
    });

    setOpenAddLeadModal(
      true
    );
  }}
  onEditContact={(row) => {
    setEditData(row);

    setOpenEditModal(
      true
    );
  }}
  onDeleteContact={async (
    row
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this contact?"
      );

    if (!confirmDelete)
      return;

    const { error } =
      await supabase
        .from("contacts")
        .delete()
        .eq(
          "contact_id",
          row.contact_id
        );

    if (error) {
      console.log(error);
      return;
    }

    fetchContacts();
  }}
  onWhatsApp={async (
    row
  ) => {
    await openWhatsApp({
      phone: row.phone,
      contactId:
        row.contact_id,
      source:
        "Contacts Mobile",
    });

    fetchContacts();
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

        {/* DETAIL */}

        <ContactDetailPopUp
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