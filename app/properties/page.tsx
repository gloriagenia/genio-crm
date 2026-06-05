"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";

import AddButton from "@/components/buttons/AddButton";

import Pagination from "@/components/ui/Pagination";

import PropertyFilters from "@/components/properties/PropertyFilters";

import PropertyTable from "@/components/properties/PropertyTable";

import PropertyCard from "@/components/properties/PropertyCard";

import AddPropertyModal from "@/components/modals/AddPropertyModal";

import EditPropertyModal from "@/components/modals/EditPropertyModal";

import AddListingModal from "@/components/modals/AddListingModal";

import PropertyDetailPopup from "@/components/popup/PropertyDetailPopUp";

import { supabase } from "@/lib/supabase";

export default function PropertiesPage() {

  const [loading, setLoading] =
    useState(false);

  const [properties, setProperties] =
    useState<any[]>([]);

  const [selectedProperty, setSelectedProperty] =
    useState<any>(null);

  const [editData, setEditData] =
    useState<any>(null);

  const [listingData, setListingData] =
    useState<any>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [openListingModal, setOpenListingModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalData, setTotalData] =
    useState(0);

  const rowsPerPage = 10;

  const [propertyTypes, setPropertyTypes] =
    useState<string[]>([]);

  const [
    filterPropertyType,
    setFilterPropertyType,
  ] = useState("");

  const [
    filterMarketType,
    setFilterMarketType,
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus,
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
    minPrice,
    setMinPrice,
  ] = useState("");

  const [
    maxPrice,
    setMaxPrice,
  ] = useState("");

  async function fetchPropertyTypes() {

    const { data } =
      await supabase

        .from("property_type")

        .select("property_type");

    setPropertyTypes(
      data?.map(
        (item) =>
          item.property_type
      ) || []
    );
  }

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

      if (filterPropertyType) {

        query = query.eq(
          "property_type",
          filterPropertyType
        );
      }

      if (filterMarketType) {

        query = query.eq(
          "market_type",
          filterMarketType
        );
      }

      if (filterStatus) {

        query = query.eq(
          "status",
          filterStatus
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

      if (minPrice) {

        query = query.gte(
          "price",
          Number(minPrice)
        );
      }

      if (maxPrice) {

        query = query.lte(
          "price",
          Number(maxPrice)
        );
      }

      const start =
        (currentPage - 1) *
        rowsPerPage;

      const end =
        start +
        rowsPerPage -
        1;

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

        .range(start, end);

      if (error) {

        console.log(error);

        return;
      }

      setProperties(
        data || []
      );

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

    fetchPropertyTypes();

  }, []);

  useEffect(() => {

    fetchProperties();

  }, [
    currentPage,
    filterPropertyType,
    filterMarketType,
    filterStatus,
    filterDistrict,
    filterCity,
    minPrice,
    maxPrice,
  ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalData /
        rowsPerPage
      )
    );

  function resetFilters() {

    setFilterPropertyType("");

    setFilterMarketType("");

    setFilterStatus("");

    setFilterDistrict("");

    setFilterCity("");

    setMinPrice("");

    setMaxPrice("");

    setCurrentPage(1);
  }

  function handleChatOwner(
    item: any
  ) {

    const phone =
      item.contacts?.phone
        ?.replace(/\D/g, "")
        ?.replace(/^0/, "62");

    if (!phone) return;

    window.open(
      `https://wa.me/${phone}`
    );
  }

  async function handleDelete(
    item: any
  ) {

    const confirmDelete =
      confirm(
        "Delete property?"
      );

    if (!confirmDelete)
      return;

    await supabase

      .from("properties")

      .delete()

      .eq(
        "property_id",
        item.property_id
      );

    fetchProperties();
  }

  return (

    <MainLayout>

      <div className="space-y-6">

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
            onImport={() =>
              console.log("Import CSV")
            }
          />

        </div>

        <PropertyFilters

          propertyTypes={
            propertyTypes
          }

          filterPropertyType={
            filterPropertyType
          }

          setFilterPropertyType={
            setFilterPropertyType
          }

          filterMarketType={
            filterMarketType
          }

          setFilterMarketType={
            setFilterMarketType
          }

          filterStatus={
            filterStatus
          }

          setFilterStatus={
            setFilterStatus
          }

          filterDistrict={
            filterDistrict
          }

          setFilterDistrict={
            setFilterDistrict
          }

          filterCity={
            filterCity
          }

          setFilterCity={
            setFilterCity
          }

          minPrice={minPrice}
          setMinPrice={setMinPrice}

          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}

          onReset={resetFilters}
        />

        <PropertyCard

          data={properties}

          loading={loading}

          onSelect={
            setSelectedProperty
          }

          onEdit={(item) => {

            setEditData(item);

            setOpenModal(true);
          }}

          onDelete={handleDelete}

          onCreateListing={(
            item
          ) => {

            setListingData(item);

            setOpenListingModal(
              true
            );
          }}

          onChatOwner={
            handleChatOwner
          }
        />

        <PropertyTable

          data={properties}

          loading={loading}

          onSelect={
            setSelectedProperty
          }

          onEdit={(item) => {

            setEditData(item);

            setOpenModal(true);
          }}

          onDelete={handleDelete}

          onCreateListing={(
            item
          ) => {

            setListingData(item);

            setOpenListingModal(
              true
            );
          }}

          onChatOwner={
            handleChatOwner
          }
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

        <AddPropertyModal
          open={
            openModal &&
            !editData
          }
          onClose={() => {

            setOpenModal(false);

            setEditData(null);
          }}
          onSuccess={
            fetchProperties
          }
        />

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
          onSuccess={
            fetchProperties
          }
        />

        <AddListingModal
          open={
            openListingModal
          }
          data={listingData}
          onClose={() => {

            setOpenListingModal(
              false
            );

            setListingData(null);
          }}
          onSuccess={
            fetchProperties
          }
        />

        <PropertyDetailPopup
          open={
            !!selectedProperty
          }
          data={
            selectedProperty
          }
          onClose={() =>
            setSelectedProperty(
              null
            )
          }
        />

      </div>

    </MainLayout>
  );
}