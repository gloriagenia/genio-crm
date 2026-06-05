"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";

import AddButton from "@/components/buttons/AddButton";

import Pagination from "@/components/ui/Pagination";

import ListingFilters from "@/components/listings/ListingFilters";

import ListingCard from "@/components/listings/ListingCard";

import ListingTable from "@/components/listings/ListingTable";

import AddListingModal from "@/components/modals/AddListingModal";

import EditListingModal from "@/components/modals/EditListingModal";

import ListingDetailPopUp from "@/components/popup/ListingDetailPopUp";

import { supabase } from "@/lib/supabase";

export default function ListingsPage() {
  // =========================
  // STATES
  // =========================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedListing,
    setSelectedListing,
  ] = useState<any>(null);

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

  const [search, setSearch] =
    useState("");

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

  const [platforms, setPlatforms] = useState<any[]>([]);

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

  async function fetchListings() {
    try {
      setLoading(true);

      let query = supabase

        .from("listing")

        .select(
          `
          *,
          properties (
            property_id,
            property_type,
            district,
            city,
            photo_url
          ),
          platform (
            platform_id,
            platform_name
          )
          `,
          {
            count: "exact",
          }
        );

      if (search) {
        query = query.or(`
          listing_title.ilike.%${search}%,
          listing_code.ilike.%${search}%
        `);
      }

      if (filterStatus) {
        query = query.eq(
          "listing_status",
          filterStatus
        );
      }

      if (filterMarketType) {
        query = query.eq(
          "market_type",
          filterMarketType
        );
      }

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
          endIndex
        );

      if (error) {
        console.log(error);
        return;
      }

      setData(data || []);

      setTotalData(count || 0);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(
    listing: any
  ) {
    const confirmed =
      confirm(
        "Delete this listing?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase

        .from("listing")

        .delete()

        .eq(
          "listing_id",
          listing.listing_id
        );

    if (error) {
      alert(error.message);
      return;
    }

    fetchListings();
  }

  // =========================
  // SHARE
  // =========================

function handleShare(
  listing: any
) {
  const property =
    listing.properties || {};

  const shareText = `
${listing.listing_title || "-"}

${property.district || "-"}, ${
    property.city || "-"
  }

${listing.market_type || "-"}

Spec:
LT ${property.land_size || "-"} m² / LB ${
    property.building_size || "-"
  } m²
KT ${property.bedroom || "-"} / KM ${
    property.bathroom || "-"
  }

Rp ${new Intl.NumberFormat(
    "id-ID"
  ).format(
    listing.listing_price || 0
  )}

Link Listing:
${listing.listing_link || "-"}
`.trim();

  window.open(
    `https://wa.me/?text=${encodeURIComponent(
      shareText
    )}`,
    "_blank"
  );
}

  // =========================
  // CHAT OWNER
  // =========================

  function handleCreateInquiry(
    listing: any
  ) {
    console.log(
      "Create Inquiry",
      listing.listing_id
    );
  }

  // =========================
  // EFFECT
  // =========================

  useEffect(() => {
    fetchListings();
  }, [
    currentPage,
    search,
    filterStatus,
    filterMarketType,
    filterPlatform,
  ]);

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

      <div className="space-y-4">

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <h1
            className="
              text-xl
              md:text-2xl
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
            onImport={() =>
              console.log(
                "Import CSV"
              )
            }
          />
        </div>

        {/* FILTERS */}

        <ListingFilters
          platforms={platforms}
          search={search}
          setSearch={setSearch}
          filterStatus={
            filterStatus
          }
          setFilterStatus={
            setFilterStatus
          }
          filterMarketType={
            filterMarketType
          }
          setFilterMarketType={
            setFilterMarketType
          }
          filterPlatform={
            filterPlatform
          }
          setFilterPlatform={
            setFilterPlatform
          }
          onReset={() => {
            setSearch("");
            setFilterStatus("");
            setFilterMarketType("");
            setFilterPlatform("");
            setCurrentPage(1);
          }}
        />

        {/* MOBILE */}

        <ListingCard
          data={data}
          loading={loading}
          onSelect={
            setSelectedListing
          }
          onEdit={(item) => {
            setEditData(item);
            setOpenModal(true);
          }}
          onDelete={
            handleDelete
          }

          onShare={
            handleShare
          }
        />

        {/* DESKTOP */}

        <ListingTable
          data={data}
          loading={loading}
          onSelect={
            setSelectedListing
          }
          onEdit={(item) => {
            setEditData(item);
            setOpenModal(true);
          }}
          onDelete={
            handleDelete
          }
          onShare={
            handleShare
          }

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

        <AddListingModal
          open={
            openModal &&
            !editData
          }
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={
            fetchListings
          }
        />

        {/* EDIT */}

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
          onSuccess={
            fetchListings
          }
        />

        {/* DETAIL */}

        <ListingDetailPopUp
          open={
            !!selectedListing
          }
          data={
            selectedListing
          }
          onClose={() =>
            setSelectedListing(
              null
            )
          }
        />

      </div>

    </MainLayout>
  );
}