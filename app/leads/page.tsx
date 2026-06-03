"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MainLayout
from "@/components/layout/MainLayout";

import LeadsHeader
from "@/components/leads/LeadsHeader";

import LeadsStatsCards
from "@/components/leads/LeadsStatsCards";

import LeadsFilters
from "@/components/leads/LeadsFilters";

import LeadsTable
from "@/components/leads/LeadsTable";

import AddLeadsModal
from "@/components/modals/AddLeadsModal";

import EditLeadsModal
from "@/components/modals/EditLeadsModal";

import LeadDetailPopUp
from "@/components/popup/LeadDetailPopUp";

import { supabase }
from "@/lib/supabase";

// =========================
// COMPONENT
// =========================

export default function LeadsPage() {

  // =========================
  // STATES
  // =========================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    leads,
    setLeads,
  ] = useState<any[]>([]);

  const [
    total,
    setTotal,
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
    selectedLead,
    setSelectedLead,
  ] = useState<any>(null);

  const [
    detailLeadId,
    setDetailLeadId,
  ] = useState<number | null>(
    null
  );

  // =========================
  // FILTERS
  // =========================

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    district,
    setDistrict,
  ] = useState("");

  const [
    propertyType,
    setPropertyType,
  ] = useState("");

  const [
    marketType,
    setMarketType,
  ] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const limit = 10;

  // =========================
  // FETCH LEADS
  // =========================

  async function fetchLeads() {

    try {

      setLoading(true);

      const from =
        (currentPage - 1) *
        limit;

      const to =
        from + limit - 1;

      let query = supabase

        .from("leads")

        .select(`
          *,
          contacts (
            contact_id,
            name,
            phone
          ),
          leads_statuses (
            lead_status_name
          ),
          property_type (
            property_type_name
          ),
          market_types (
            market_type_name
          )
        `,
        {
          count: "exact",
        });

      // =========================
      // SEARCH
      // =========================

      if (search) {

        query = query.or(`
          district.ilike.%${search}%,
          city.ilike.%${search}%,
          requirements.ilike.%${search}%,
          contacts.name.ilike.%${search}%,
          contacts.phone.ilike.%${search}%
        `);
      }

      // =========================
      // FILTER CITY
      // =========================

      if (city) {

        query = query.ilike(
          "city",
          `%${city}%`
        );
      }

      // =========================
      // FILTER DISTRICT
      // =========================

      if (district) {

        query = query.ilike(
          "district",
          `%${district}%`
        );
      }

      // =========================
      // FILTER PROPERTY TYPE
      // =========================

      if (propertyType) {

        query = query.eq(
          "property_type_id",
          propertyType
        );
      }

      // =========================
      // FILTER MARKET TYPE
      // =========================

      if (marketType) {

        query = query.eq(
          "market_type_id",
          marketType
        );
      }

      // =========================
      // EXECUTE
      // =========================

      const {
        data,
        count,
        error,
      } = await query

        .order(
          "created_at",
          {
            ascending: false,
          }
        )

        .range(
          from,
          to
        );

      if (error) {

        console.log(error);

        return;
      }

      // =========================
      // FORMAT DATA
      // =========================

      const formatted =
        (data || []).map(
          (item: any) => {

            // =========================
            // LAST CONTACT
            // =========================

            let lastRelative =
              "-";

            if (
              item.last_contact
            ) {

              const diff =
                Math.floor(
                  (
                    new Date().getTime() -
                    new Date(
                      item.last_contact
                    ).getTime()
                  ) /
                  (
                    1000 *
                    60 *
                    60 *
                    24
                  )
                );

              if (diff === 0) {

                lastRelative =
                  "Today";

              } else if (
                diff === 1
              ) {

                lastRelative =
                  "1 day ago";

              } else {

                lastRelative =
                  `${diff} days ago`;
              }
            }

            // =========================
            // NEXT FOLLOWUP
            // =========================

            let nextFormatted =
              "-";

            if (
              item.next_followup
            ) {

              nextFormatted =
                new Date(
                  item.next_followup
                ).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                );
            }

            // =========================
            // OVERDUE
            // =========================

            let overdue =
              false;

            if (
              item.next_followup
            ) {

              overdue =
                new Date(
                  item.next_followup
                ) < new Date();
            }

            return {

              ...item,

              is_overdue:
                overdue,

              last_contact_relative:
                lastRelative,

              next_followup_formatted:
                nextFormatted,
            };
          }
        );

      setLeads(
        formatted
      );

      setTotal(
        count || 0
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

    fetchLeads();

  }, [
    currentPage,
    search,
    city,
    district,
    propertyType,
    marketType,
  ]);

  // =========================
  // TOTAL PAGES
  // =========================

  const totalPages =
    useMemo(() => {

      return Math.max(
        1,
        Math.ceil(
          total / limit
        )
      );

    }, [
      total,
    ]);

  // =========================
  // STATS
  // =========================

  const stats =
    useMemo(() => {

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const followUpToday =
        leads.filter(
          (
            item
          ) =>
            item.next_followup?.startsWith(
              today
            )
        ).length;

      const converted =
        leads.filter(
          (
            item
          ) =>
            item.inquiry_id
        ).length;

      const conversionRate =
        total > 0
          ? Math.round(
              (
                converted /
                total
              ) * 100
            )
          : 0;

      return {

        totalLeads:
          total,

        followUpToday,

        converted,

        conversionRate,
      };

    }, [
      leads,
      total,
    ]);

  // =========================
  // WHATSAPP
  // =========================

  function handleWhatsapp(
    lead: any
  ) {

    const phone =
      lead?.contacts
        ?.phone;

    if (!phone)
      return;

    let clean =
      phone.replace(
        /\D/g,
        ""
      );

    if (
      clean.startsWith(
        "0"
      )
    ) {

      clean =
        "62" +
        clean.slice(1);
    }

    window.open(
      `https://wa.me/${clean}`,
      "_blank"
    );
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(
    lead: any
  ) {

    const confirmDelete =
      confirm(
        "Delete this lead?"
      );

    if (!confirmDelete)
      return;

    const {
      error,
    } = await supabase

      .from("leads")

      .delete()

      .eq(
        "leads_id",
        lead.leads_id
      );

    if (error) {

      alert(
        error.message
      );

      return;
    }

    fetchLeads();
  }

  // =========================
// CREATE INQUIRY
// =========================

async function handleCreateInquiry(
  lead: any
) {

  try {

    const payload = {

      lead_id:
        lead.leads_id,

      contact_id:
        lead.contact_id || null,

      source_id:
        lead.source_id || null,

      property_type_id:
        lead.property_type_id || null,

      inquiry_status_id:
        1,

      inquiry_date:
        new Date(),

      last_followup:
        lead.last_contact || null,

      notes:
        lead.requirements || null,

      requirement_sum:
        lead.requirements || null,

      budget_min:
        lead.budget_min || null,

      budget_max:
        lead.budget_max || null,

      city:
        lead.city || null,

      district:
        lead.district || null,

      market_type:
        lead.market_types
          ?.market_type_name || null,

      inquiry_category:
        "Lead Conversion",

      next_action:
        "Follow up lead",

      next_followup_at:
        lead.next_followup || null,

      priority:
        lead.priority || "WARM",

      building_size_min:
        lead.building_size_min || null,

      updated_at:
        new Date(),
    };

    const {
      data,
      error,
    } = await supabase

      .from("inquiries")

      .insert(payload)

      .select()

      .single();

    if (error) {

      console.log(error);

      alert(
        error.message
      );

      return;
    }

    alert(
      "Inquiry created successfully"
    );

    console.log(data);

  } catch (error) {

    console.log(error);

    alert(
      "Failed to create inquiry"
    );
  }
}

  // =========================
  // RENDER
  // =========================

  return (

    <MainLayout>

      <div
        className="
          space-y-5

          pb-10
        "
      >

        {/* HEADER */}

        <LeadsHeader

          onAddLead={() =>
            setOpenAddModal(
              true
            )
          }

        />

        {/* STATS */}

        <LeadsStatsCards

          totalLeads={
            stats.totalLeads
          }

          followUpToday={
            stats.followUpToday
          }

          converted={
            stats.converted
          }

          conversionRate={
            stats.conversionRate
          }

        />

        {/* FILTERS */}

        <LeadsFilters

          search={search}

          city={city}

          district={district}

          propertyType={
            propertyType
          }

          marketType={
            marketType
          }

          onSearchChange={
            setSearch
          }

          onCityChange={
            setCity
          }

          onDistrictChange={
            setDistrict
          }

          onPropertyTypeChange={
            setPropertyType
          }

          onMarketTypeChange={
            setMarketType
          }

          onReset={() => {

            setSearch("");

            setCity("");

            setDistrict("");

            setPropertyType("");

            setMarketType("");

            setCurrentPage(1);

          }}

        />

        {/* TABLE */}

        <LeadsTable

          leads={leads}

          loading={loading}

          total={total}

          currentPage={
            currentPage
          }

          totalPages={
            totalPages
          }

          limit={limit}

          onPageChange={
            setCurrentPage
          }

          onViewDetail={(
            lead
          ) => {

            setDetailLeadId(
              lead.leads_id
            );

          }}

          onWhatsapp={
            handleWhatsapp
          }

          onEdit={(
            lead
          ) => {

            setSelectedLead(
              lead
            );

            setOpenEditModal(
              true
            );

          }}

          onDelete={
            handleDelete
          }

          onCreateInquiry={
            handleCreateInquiry
          }

        />

      </div>

      {/* ========================= */}
      {/* ADD MODAL */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* EDIT MODAL */}
      {/* ========================= */}

      <EditLeadsModal

        open={
          openEditModal
        }

        data={
          selectedLead
        }

        onClose={() => {

          setOpenEditModal(
            false
          );

          setSelectedLead(
            null
          );

        }}

        onSuccess={() => {

          fetchLeads();

          setOpenEditModal(
            false
          );

          setSelectedLead(
            null
          );

        }}

      />

      {/* ========================= */}
      {/* DETAIL POPUP */}
      {/* ========================= */}

      <LeadDetailPopUp

        open={
          !!detailLeadId
        }

        leadId={
          detailLeadId
        }

        onClose={() =>
          setDetailLeadId(
            null
          )
        }

        onEdit={(
          lead
        ) => {

          setDetailLeadId(
            null
          );

          setSelectedLead(
            lead
          );

          setOpenEditModal(
            true
          );

        }}

      />

    </MainLayout>
  );
}