"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";

import AddButton from "@/components/buttons/AddButton";
import Pagination from "@/components/ui/Pagination";

import InquiryFilters from "@/components/inquiries/InquiryFilters";
import InquiryTable from "@/components/inquiries/InquiryTable";
import InquiryCard from "@/components/inquiries/InquiryCard";

import AddInquiryModal from "@/components/modals/AddInquiryModal";
import EditInquiryModal from "@/components/modals/EditInquiryModal";

import InquiryDetailPopUp from "@/components/popup/InquiryDetailPopUp";

import { supabase } from "@/lib/supabase";

export default function InquiriesPage() {
  // =========================
  // DATA
  // =========================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [totalData, setTotalData] =
    useState(0);

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 10;

  // =========================
  // FILTERS
  // =========================

  const [filterName, setFilterName] =
    useState("");

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

  const [filterCity, setFilterCity] =
    useState("");

  const [
    filterPriority,
    setFilterPriority,
  ] = useState("");

  // =========================
  // MODALS
  // =========================

  const [openModal, setOpenModal] =
    useState(false);

  const [editData, setEditData] =
    useState<any>(null);

  const [selectedRow, setSelectedRow] =
    useState<any>(null);

  // =========================
  // FETCH
  // =========================

  async function fetchInquiries() {
    try {
      setLoading(true);

      const startIndex =
        (currentPage - 1) *
        rowsPerPage;

      const endIndex =
        startIndex +
        rowsPerPage -
        1;

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

      if (filterCategory) {
        query = query.eq(
          "inquiry_category",
          filterCategory
        );
      }

      if (filterDistrict) {
        query = query.ilike(
          "district",
          `%${filterDistrict}%`
        );
      }

      if (filterCity) {
        query = query.ilike(
          "city",
          `%${filterCity}%`
        );
      }

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
        .order("created_at", {
          ascending: false,
        })
        .range(
          startIndex,
          endIndex
        );

      if (error) {
        console.log(error);
        return;
      }

      let filteredData =
        inquiryData || [];

      if (filterName) {
        filteredData =
          filteredData.filter(
            (item) =>
              item
                .requirement_summary
                ?.toLowerCase()
                .includes(
                  filterName.toLowerCase()
                )
          );
      }

      if (
        filterPropertyType
      ) {
        filteredData =
          filteredData.filter(
            (item) =>
              item.property_type
                ?.property_type_name
                ?.toLowerCase()
                .includes(
                  filterPropertyType.toLowerCase()
                )
          );
      }

      setData(filteredData);

      setTotalData(
        count || 0
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
  // ACTIONS
  // =========================

  function openWhatsApp(
    inquiry: any
  ) {
    const phone =
      inquiry?.contacts?.phone;

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

    window.open(
      `https://wa.me/${cleanPhone}`,
      "_blank"
    );
  }

  async function handleDelete(
    inquiry: any
  ) {
    const confirmDelete =
      confirm(
        "Delete inquiry?"
      );

    if (!confirmDelete)
      return;

    const { error } =
      await supabase
        .from("inquiries")
        .delete()
        .eq(
          "inquiry_id",
          inquiry.inquiry_id
        );

    if (error) {
      console.log(error);
      return;
    }

    fetchInquiries();
  }

  function resetFilters() {
    setFilterName("");
    setFilterCategory("");
    setFilterPropertyType("");
    setFilterDistrict("");
    setFilterCity("");
    setFilterPriority("");
  }

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

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Inquiries
          </h1>

          <AddButton
            label="Add Inquiry"
            onAdd={() => {
              setEditData(null);
              setOpenModal(true);
            }}
          />
        </div>

        {/* FILTER */}

        <InquiryFilters
          filterName={filterName}
          setFilterName={setFilterName}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterPropertyType={filterPropertyType}
          setFilterPropertyType={
            setFilterPropertyType
          }
          filterDistrict={filterDistrict}
          setFilterDistrict={
            setFilterDistrict
          }
          filterCity={filterCity}
          setFilterCity={setFilterCity}
          filterPriority={filterPriority}
          setFilterPriority={
            setFilterPriority
          }
          onReset={resetFilters}
        />

        {/* MOBILE */}

        <InquiryCard
          data={data}
          loading={loading}
          onSelect={setSelectedRow}
          onEdit={(item) => {
            setEditData(item);
            setOpenModal(true);
          }}
          onDelete={handleDelete}
          onWhatsapp={openWhatsApp}
        />

        {/* DESKTOP */}

        <InquiryTable
          data={data}
          loading={loading}
          onSelect={setSelectedRow}
          onEdit={(item) => {
            setEditData(item);
            setOpenModal(true);
          }}
          onDelete={handleDelete}
          onWhatsapp={openWhatsApp}
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

        {/* ADD */}

        <AddInquiryModal
          open={
            openModal &&
            !editData
          }
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={
            fetchInquiries
          }
        />

        {/* EDIT */}

        <EditInquiryModal
          open={
            openModal &&
            !!editData
          }
          data={editData}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={
            fetchInquiries
          }
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