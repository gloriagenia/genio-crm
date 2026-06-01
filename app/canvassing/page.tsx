"use client";

import { useEffect, useState } from "react";

import { normalizePhone } from "@/src/utils/normalizePhone";
import { normalizeText } from "@/src/utils/normalizeText";

import { supabase } from "@/lib/supabase";

import MainLayout from "@/components/layout/MainLayout";

import DataTable from "@/components/tables/DataTable";

import Pagination from "@/components/pagination/Pagination";

import DetailPopup from "@/components/popup/DetailPopup";

import ViewActions from "@/components/actions/ViewActions";

import AddCanvassingButton from "@/components/buttons/AddCanvassingButton";

import CanvassingModal from "@/components/modals/CanvassingModal";

import UploadPhotoModal from "@/components/modals/UploadPhotoModal";

import AddPropertyModal from "@/components/modals/AddPropertyModal";

import ImportCsvPreviewModal from "@/components/modals/ImportCsvPreviewModal";

// =========================
// TYPES
// =========================

type Canvassing = {

  canvassing_id?: string;

  canvassing_date?: string;

  photo_url?: string;

  phone?: string;

  name?: string;

  street?: string;

  district?: string;

  city?: string;

  property_type?: string;

  property_type_id?: string;

  land_size?: string;

  building_size?: string;

  address?: string;

  notes?: string;

  latitude?: string;

  longitude?: string;

  // =========================
  // RAW STATUS
  // =========================

  status?: string;

  // =========================
  // UI
  // =========================

  status_badge?: React.ReactNode;

  no?: number;

  photo?: React.ReactNode;

  action?: React.ReactNode;
};

// =========================
// TABLE COLUMNS
// =========================

const columns = [

  {
    key: "no",
    label: "No",
  },

  {
    key: "photo",
    label: "Photo",
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
    key: "property_type",
    label: "Property Type",
  },

  {
    key: "district",
    label: "District",
  },

  {
    key: "city",
    label: "City",
  },

  {
    key: "status_badge",
    label: "Status",
  },

  {
    key: "action",
    label: "Action",
  },
];

// =========================
// IMPORT COLUMNS
// =========================

const importColumns = [

  {
    key: "canvassing_date",
    label: "Canvassing Date",
  },

  {
    key: "photo_url",
    label: "Photo URL",
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
    key: "street",
    label: "Street",
  },

  {
    key: "district",
    label: "District",
  },

  {
    key: "city",
    label: "City",
  },

  {
    key: "property_type",
    label: "Property Type",
  },

  {
    key: "land_size",
    label: "Land Size",
  },

  {
    key: "building_size",
    label: "Building Size",
  },

  {
    key: "address",
    label: "Address",
  },

  {
    key: "notes",
    label: "Notes",
  },

  {
    key: "latitude",
    label: "Latitude",
  },

  {
    key: "longitude",
    label: "Longitude",
  },
];

export default function CanvassingPage() {

  // =========================
  // STATES
  // =========================

  const [data, setData] =
    useState<Canvassing[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [ocrLoading, setOcrLoading] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState<Canvassing | null>(null);

  const [editData, setEditData] =
    useState<Canvassing | null>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [
    openPropertyModal,
    setOpenPropertyModal,
  ] = useState(false);

  const [
    propertyData,
    setPropertyData,
  ] = useState<any>(null);

  const [
    openImportPreview,
    setOpenImportPreview,
  ] = useState(false);

  const [
    openPhotoModal,
    setOpenPhotoModal,
  ] = useState(false);

  const [csvData, setCsvData] =
    useState<any[]>([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalData, setTotalData] =
    useState(0);

  // =========================
  // FILTER STATES
  // =========================

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

  // =========================
  // PAGINATION
  // =========================

  const rowsPerPage = 10;

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const endIndex =
    startIndex + rowsPerPage;

  // =========================
  // FETCH DATA
  // =========================

  async function fetchCanvassing() {

    try {

      setLoading(true);

      let query = supabase

        .from("canvassing")

        .select("*", {
          count: "exact",
        });

      // =========================
      // FILTER
      // =========================

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
          endIndex - 1
        );

      if (error) {

        console.log(error);

        return;
      }

      setTotalData(count || 0);

      const formattedData =
        (data || []).map(
          (
            item: Canvassing,
            index: number
          ) => ({

            ...item,

            no:
              startIndex +
              index +
              1,

            // =========================
            // PHOTO
            // =========================

            photo:
              item.photo_url ? (

                <a
                  href={
                    item.photo_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  className="
                    text-blue-600
                    underline
                    hover:text-blue-800
                  "
                >
                  View Photo
                </a>

              ) : (

                <span className="text-gray-400">
                  No Photo
                </span>
              ),

            // =========================
            // STATUS BADGE
            // =========================

            status_badge: (

              <div
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  w-fit

                  ${
                    item.status === "New"
                      ? "bg-gray-100 text-gray-700"

                    : item.status === "Ready to Contact"
                      ? "bg-blue-100 text-blue-700"

                    : item.status === "Interested"
                      ? "bg-green-100 text-green-700"

                    : item.status === "Rejected"
                      ? "bg-red-100 text-red-700"

                    : item.status === "Converted"
                      ? "bg-emerald-100 text-emerald-700"

                    : item.status === "Invalid Number"
                      ? "bg-orange-100 text-orange-700"

                    : "bg-gray-100 text-gray-700"
                  }
                `}
              >

                {item.status || "New"}

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
                        async () => {

                          const cleanPhone =
                            item.phone || "";

                          await supabase

                            .from("canvassing")

                            .update({
                              status:
                                item.status === "New"
                                  ? "Ready to Contact"
                                  : item.status,
                            })

                            .eq(
                              "canvassing_id",
                              item.canvassing_id
                            );

                          window.open(
                            `https://wa.me/${cleanPhone}`
                          );

                          fetchCanvassing();
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

                          setEditData({
                            ...item,
                          });

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
                              "Are you sure want to delete this data?"
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
                                "canvassing"
                              )

                              .delete()

                              .eq(
                                "canvassing_id",
                                item.canvassing_id
                              );

                          if (
                            error
                          ) {

                            console.log(
                              error
                            );

                            return;
                          }

                          fetchCanvassing();
                        },
                    },

                    {
                      divider:
                        true,

                      label: "",
                    },

                    // =========================
                    // CREATE PROPERTY
                    // =========================

                    ...(item.status !== "Converted"

                      ? [
                          {

                            label:
                              "Create Property",

                            onClick:
                              async () => {

                                const cleanPhone =
                                  normalizePhone(
                                    item.phone || ""
                                  );

                                const {
                                  data: contact,
                                } = await supabase

                                  .from("contacts")

                                  .select("*")

                                  .eq(
                                    "phone",
                                    cleanPhone
                                  )

                                  .single();

                                setPropertyData({

                                  canvassing_id:
                                    item.canvassing_id,

                                  phone:
                                    item.phone || "",

                                  property_type:
                                    item.property_type || "",

                                  property_type_id:
                                    item.property_type_id || "",

                                  land_size:
                                    item.land_size || "",

                                  building_size:
                                    item.building_size || "",

                                  latitude:
                                    item.latitude || "",

                                  longitude:
                                    item.longitude || "",

                                  address:
                                    item.address || "",

                                  photo_url:
                                    item.photo_url || "",

                                  contact_id:
                                    contact?.contact_id || null,

                                  description:
                                    item.notes || "",
                                });

                                setOpenPropertyModal(
                                  true
                                );
                              },
                          },
                        ]

                      : []),
                  ]}
                />

              </div>
            ),
          })
        );

      setData(formattedData);

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

    fetchCanvassing();

  }, [
    currentPage,
    filterPropertyType,
    filterDistrict,
    filterCity,
    filterStatus,
  ]);

  // =========================
  // IMPORT CSV
  // =========================

  async function handleImportToDatabase() {

    try {

      const {
        data: propertyTypes,
      } = await supabase

        .from("property_type")

        .select("*");

      const cleanedData =
        await Promise.all(

          csvData.map(async (item) => {

            let finalPropertyTypeId =
              null;

            if (item.property_type) {

              const normalizedName =
                normalizeText(
                  item.property_type
                );

              const existingType =
                propertyTypes?.find(
                  (type: any) =>

                    normalizeText(
                      type.property_type_name
                    ) === normalizedName
                );

              if (existingType) {

                finalPropertyTypeId =
                  existingType.property_type_id;
              }

              else {

                const {
                  data: newType,
                } = await supabase

                  .from("property_type")

                  .insert([
                    {
                      property_type_name:
                        item.property_type.trim(),
                    },
                  ])

                  .select()

                  .single();

                finalPropertyTypeId =
                  newType?.property_type_id;
              }
            }

            return {

              canvassing_date:
                item.canvassing_date || null,

              photo_url:
                item.photo_url || "",

              name:
                item.name || "",

              phone:
                item.phone || "",

              street:
                item.street || "",

              district:
                item.district || "",

              city:
                item.city || "",

              property_type:
                item.property_type || "",

              property_type_id:
                finalPropertyTypeId,

              land_size:
                item.land_size || "",

              building_size:
                item.building_size || "",

              address:
                item.address || "",

              notes:
                item.notes || "",

              latitude:
                item.latitude || "",

              longitude:
                item.longitude || "",

              status:
                "New",
            };
          })
        );

      const { error } =
        await supabase

          .from("canvassing")

          .insert(cleanedData);

      if (error) {

        console.log(error);

        return;
      }

      setOpenImportPreview(
        false
      );

      setCsvData([]);

      fetchCanvassing();

    } catch (error) {

      console.log(error);
    }
  }

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

        <div className="flex items-center justify-between">

          <h1 className="text-2xl font-bold">
            Canvassing
          </h1>

          <AddCanvassingButton

            onAdd={() => {

              setEditData(null);

              setOpenModal(true);
            }}

            onImport={(
              parsedData
            ) => {

              setCsvData(
                parsedData
              );

              setOpenImportPreview(
                true
              );
            }}

            onUploadPhoto={() => {

              setOpenPhotoModal(
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

          <select
            value={filterPropertyType}
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
          >

            <option value="">
              All Property Type
            </option>

            <option value="Rumah">
              Rumah
            </option>

            <option value="Ruko">
              Ruko
            </option>

            <option value="Tanah">
              Tanah
            </option>

            <option value="Apartemen">
              Apartemen
            </option>

            <option value="Gudang">
              Gudang
            </option>

          </select>

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
            value={filterStatus}

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

            <option value="New">
              New
            </option>

            <option value="Need Review">
              Need Review
            </option>

            <option value="Ready to Contact">
              Ready to Contact
            </option>

            <option value="No Response">
              No Response
            </option>

            <option value="Interested">
              Interested
            </option>

            <option value="Rejected">
              Rejected
            </option>

            <option value="Invalid Number">
              Invalid Number
            </option>

            <option value="Converted">
              Converted
            </option>

          </select>

          <button
            onClick={() => {

              setFilterPropertyType("");

              setFilterDistrict("");

              setFilterCity("");

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

        {loading ||
        ocrLoading ? (

          <div
            className="
              border
              rounded-xl
              p-10
              text-center
              text-gray-500
            "
          >

            {ocrLoading
              ? "🤖 Gemini AI sedang mengekstrak data dari foto..."
              : "Loading canvassing..."}

          </div>

        ) : (

          <>

            <DataTable
              columns={
                columns
              }

              data={
                data
              }

              onRowClick={(
                row
              ) => {

                setSelectedRow({

                  canvassing_id:
                    row.canvassing_id,

                  canvassing_date:
                    row.canvassing_date,

                  photo_url:
                    row.photo_url,

                  phone:
                    row.phone,

                  name:
                    row.name,

                  street:
                    row.street,

                  district:
                    row.district,

                  city:
                    row.city,

                  property_type:
                    row.property_type,

                  property_type_id:
                    row.property_type_id,

                  land_size:
                    row.land_size,

                  building_size:
                    row.building_size,

                  address:
                    row.address,

                  notes:
                    row.notes,

                  latitude:
                    row.latitude,

                  longitude:
                    row.longitude,

                  status:
                    row.status,
                });
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

          </>
        )}

        {/* ADD / EDIT */}

        <CanvassingModal
          open={openModal}

          data={editData}

          onClose={() => {

            setOpenModal(false);

            setEditData(null);
          }}

          onSuccess={() => {

            fetchCanvassing();
          }}
        />

        {/* IMPORT CSV */}

        <ImportCsvPreviewModal
          open={
            openImportPreview
          }

          title="Import Canvassing CSV"

          columns={
            importColumns
          }

          data={csvData}

          onClose={() => {

            setOpenImportPreview(
              false
            );
          }}

          onImport={() => {

            handleImportToDatabase();
          }}
        />

        {/* OCR */}

        <UploadPhotoModal

          open={openPhotoModal}

          onClose={() => {

            setOpenPhotoModal(false);
          }}

          onSubmit={async (formData: any) => {

            try {

              setOcrLoading(true);

              const { error } =
                await supabase

                  .from("canvassing")

                  .insert([
                    {

                      canvassing_date:
                        new Date()
                          .toISOString()
                          .split("T")[0],

                      photo_url:
                        formData.photo_url || "",

                      phone:
                        formData.phone || "",

                      name:
                        formData.name || "",

                      street:
                        formData.street || "",

                      district:
                        formData.district || "",

                      city:
                        formData.city || "",

                      property_type:
                        formData.property_type || "",

                      property_type_id:
                        formData.property_type_id || null,

                      land_size:
                        formData.land_size || "",

                      building_size:
                        formData.building_size || "",

                      address:
                        formData.address || "",

                      notes:
                        formData.notes || "",

                      latitude:
                        formData.latitude || "",

                      longitude:
                        formData.longitude || "",

                      status:
                        "New",
                    },
                  ]);

              if (error) {

                console.log(error);

                alert(
                  "Gagal simpan data"
                );

                return;
              }

              await fetchCanvassing();

              setOpenPhotoModal(
                false
              );

            } catch (error) {

              console.log(error);

              alert(
                "Terjadi error"
              );

            } finally {

              setOcrLoading(false);
            }
          }}
        />

        {/* ADD PROPERTY */}

        <AddPropertyModal
          open={openPropertyModal}

          data={propertyData}

          onClose={() => {

            setOpenPropertyModal(
              false
            );

            setPropertyData(null);
          }}

          onSuccess={() => {

            fetchCanvassing();
          }}
        />

        {/* DETAIL */}

        <DetailPopup
          open={
            !!selectedRow
          }

          title="Canvassing Detail"

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