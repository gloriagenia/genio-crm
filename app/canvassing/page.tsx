"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { normalizePhone } from "@/src/utils/normalizePhone";
import { normalizeText } from "@/src/utils/normalizeText";

import MainLayout from "@/components/layout/MainLayout";

import Pagination from "@/components/ui/Pagination";

import CanvassingHeader from "@/components/canvassing/CanvassingHeader";
import CanvassingFilters from "@/components/canvassing/CanvassingFilters";
import CanvassingCard from "@/components/canvassing/CanvassingCard";

import CanvassingModal from "@/components/modals/CanvassingModal";
import UploadPhotoModal from "@/components/modals/UploadPhotoModal";
import AddPropertyModal from "@/components/modals/AddPropertyModal";

import DetailPopup from "@/components/popup/DetailPopup";

export default function CanvassingPage() {
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const [selectedRow, setSelectedRow] =
    useState<any>(null);

  const [editData, setEditData] =
    useState<any>(null);

  const [propertyData, setPropertyData] =
    useState<any>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [
    openPhotoModal,
    setOpenPhotoModal,
  ] = useState(false);

  const [
    openPropertyModal,
    setOpenPropertyModal,
  ] = useState(false);

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
    filterStatus,
    setFilterStatus,
  ] = useState("");

  async function fetchCanvassing() {
    try {
      setLoading(true);

      let query = supabase
        .from("canvassing")
        .select("*", {
          count: "exact",
        });

      if (filterPropertyType) {
        query = query.eq(
          "property_type",
          filterPropertyType
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

      if (filterStatus) {
        query = query.eq(
          "status",
          filterStatus
        );
      }

      const startIndex =
        (currentPage - 1) *
        rowsPerPage;

      const endIndex =
        startIndex +
        rowsPerPage -
        1;

      const {
        data,
        error,
        count,
      } = await query
        .order(
          "canvassing_date",
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

  useEffect(() => {
    fetchCanvassing();
  }, [
    currentPage,
    filterPropertyType,
    filterDistrict,
    filterCity,
    filterStatus,
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
      <div className="space-y-6">

        <CanvassingHeader
          totalData={totalData}
          onAdd={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          onUploadPhoto={() =>
            setOpenPhotoModal(
              true
            )
          }
          onImportCsv={() => {
            alert(
              "Import CSV disabled"
            );
          }}
        />

        <CanvassingFilters
          filterPropertyType={
            filterPropertyType
          }
          filterDistrict={
            filterDistrict
          }
          filterCity={
            filterCity
          }
          filterStatus={
            filterStatus
          }
          onPropertyTypeChange={
            setFilterPropertyType
          }
          onDistrictChange={
            setFilterDistrict
          }
          onCityChange={
            setFilterCity
          }
          onStatusChange={
            setFilterStatus
          }
          onReset={() => {
            setFilterPropertyType(
              ""
            );
            setFilterDistrict("");
            setFilterCity("");
            setFilterStatus("");
            setCurrentPage(1);
          }}
        />

        {loading ||
        ocrLoading ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
            {ocrLoading
              ? "Scanning OCR..."
              : "Loading..."}
          </div>
        ) : data.length ===
          0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
            No canvassing found
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map(
              (item) => (
                <CanvassingCard
                  key={
                    item.canvassing_id
                  }
                  item={item}
                  onClick={(
                    row
                  ) =>
                    setSelectedRow(
                      row
                    )
                  }
                  onEdit={(
                    row
                  ) => {
                    setEditData(
                      row
                    );
                    setOpenModal(
                      true
                    );
                  }}
                  onCreateProperty={(
                    row
                  ) => {
                    setPropertyData(
                      row
                    );
                    setOpenPropertyModal(
                      true
                    );
                  }}
                  onRefresh={
                    fetchCanvassing
                  }
                />
              )
            )}
          </div>
        )}

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

        <CanvassingModal
          open={openModal}
          data={editData}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={
            fetchCanvassing
          }
        />

        <UploadPhotoModal
          open={openPhotoModal}
          onClose={() =>
            setOpenPhotoModal(
              false
            )
          }
          onSubmit={async (
            formData
          ) => {
            setOcrLoading(
              true
            );

            try {
              const {
                error,
              } =
                await supabase
                  .from(
                    "canvassing"
                  )
                  .insert([
                    {
                      canvassing_date:
                        new Date()
                          .toISOString()
                          .split(
                            "T"
                          )[0],

                      ...formData,
                    },
                  ]);

              if (error)
                throw error;

              await fetchCanvassing();
            } finally {
              setOcrLoading(
                false
              );
            }
          }}
        />

        <AddPropertyModal
          open={
            openPropertyModal
          }
          data={propertyData}
          onClose={() => {
            setOpenPropertyModal(
              false
            );
            setPropertyData(
              null
            );
          }}
          onSuccess={
            fetchCanvassing
          }
        />

        <DetailPopup
          open={
            !!selectedRow
          }
          title="Canvassing Detail"
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