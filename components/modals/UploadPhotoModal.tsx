"use client";

import { supabase } from "@/lib/supabase";
import { normalizeText }
from "@/src/utils/normalizeText";
import { normalizePhone }
from "@/src/utils/normalizePhone";
import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import * as exifr from "exifr";

type UploadPhotoModalProps = {
  open: boolean;

  onClose: () => void;

  onSubmit: (
    formData: {
      file: File | null;

      name: string;

      phone: string;

      property_type: string;

      property_type_id: string;

      district: string;

      city: string;

      notes: string;

      latitude: string;

      longitude: string;

      status: string;
    }
  ) => Promise<void>;
};

export default function UploadPhotoModal({
  open,
  onClose,
  onSubmit,
}: UploadPhotoModalProps) {


  // =========================
  // STATES
  // =========================

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  // =========================
  // FORM
  // =========================

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    propertyType,
    setPropertyType,
  ] = useState("");

  const [
  propertyTypeId,
  setPropertyTypeId,
] = useState<string | null>(null);

const [
  propertyTypeSuggestions,
  setPropertyTypeSuggestions,
] = useState<any[]>([]);

  const [district, setDistrict] =
    useState("");

  const [city, setCity] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [status, setStatus] =
    useState("New");


// =========================
// FETCH PROPERTY TYPE
// =========================

useEffect(() => {

  async function fetchPropertyType() {

    if (!propertyType) {

      setPropertyTypeSuggestions([]);

      return;
    }

    const { data } =
      await supabase

        .from("property_type")

        .select("*")

        .ilike(
          "property_type_name",
          `%${propertyType}%`
        )

        .limit(5);

    setPropertyTypeSuggestions(
      data || []
    );
  }

  fetchPropertyType();

}, [propertyType]);

 if (!open) return null;

  // =========================
  // HANDLE FILE
  // =========================

  const handleFileChange =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const selected =
        e.target.files?.[0];

      if (!selected) return;

      setUploading(true);

      setUploadProgress(0);

      const fakeProgress =
        setInterval(() => {

          setUploadProgress(
            (prev) => {

              if (prev >= 90) {

                clearInterval(
                  fakeProgress
                );

                return 90;
              }

              return prev + 10;
            }
          );

        }, 100);

      try {

        const isHeic =
          selected.type.includes(
            "heic"
          ) ||
          selected.name
            .toLowerCase()
            .endsWith(".heic");


        // =========================
        // READ GPS ORIGINAL FILE
        // =========================

        const originalGps =
          await exifr.parse(selected);

        if (
          originalGps?.latitude &&
          originalGps?.longitude
        ) {

          setLatitude(
            originalGps.latitude.toString()
          );

          setLongitude(
            originalGps.longitude.toString()
          );

          console.log(
            "GPS FOUND:",
            originalGps.latitude,
            originalGps.longitude
          );
        }

        // =========================
        // HEIC
        // =========================

        if (isHeic) {

          const heic2any =
            (
              await import(
                "heic2any"
              )
            ).default;

          const convertedBlob: any =
            await heic2any({
              blob: selected,
              toType:
                "image/jpeg",
              quality: 0.9,
            });

          const jpgFile =
            new File(
              [convertedBlob],
              selected.name.replace(
                ".heic",
                ".jpg"
              ),
              {
                type:
                  "image/jpeg",
              }
            );

          setFile(jpgFile);

          setPreview(
            URL.createObjectURL(
              jpgFile
            )
          );

          const gps =
            await exifr.parse(jpgFile);

          if (gps) {

            setLatitude(
              gps.latitude?.toString() || ""
            );

            setLongitude(
              gps.longitude?.toString() || ""
            );
          }

        } else {

          setFile(selected);

          setPreview(
            URL.createObjectURL(
              selected
            )
          );

          const gps =
            await exifr.parse(selected);

          if (gps) {

            setLatitude(
              gps.latitude?.toString() || ""
            );

            setLongitude(
              gps.longitude?.toString() || ""
            );
          }
        }

        clearInterval(fakeProgress);

        setUploadProgress(100);

        setTimeout(() => {

          setUploading(false);

        }, 300);

      } catch (error) {

        console.log(error);

        alert(
          "Gagal upload foto"
        );

        setUploading(false);
      }
    };

  // =========================
  // OCR
  // =========================

  const handleScanOCR =
    async () => {

      if (!file) {

        alert(
          "Pilih foto terlebih dahulu"
        );

        return;
      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await fetch(
            "/api/ocr",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.error ||
              "OCR Failed"
          );
        }

        const result =
          data.data;

        setName(
          result.owner_name || ""
        );

        setPhone(
          result.phone || ""
        );

        setPropertyType(
          result.property_type ||
            ""
        );

        setDistrict(
          result.district || ""
        );

        setCity(
          result.city || ""
        );

        setNotes(`
Price:
${result.price || "-"}

Land Size:
${result.land_size || "-"}

Building Size:
${result.building_size || "-"}

Address:
${result.address || "-"}
        `);

      } catch (error: any) {

        console.log(error);

        alert(
          error.message
        );

      } finally {

        setLoading(false);
      }
    };


    // =========================
    // FIND OR CREATE
    // PROPERTY TYPE
    // =========================

    async function findOrCreatePropertyType() {

      if (!propertyType.trim()) {

        return null;
      }

      // =========================
      // NORMALIZE
      // =========================

      const normalizedName =
        normalizeText(propertyType);

      // =========================
      // GET PROPERTY TYPES
      // =========================

      const {
        data: propertyTypes,
        error,
      } = await supabase

        .from("property_type")

        .select("*");

      if (error) {

        console.log(error);

        return null;
      }

      // =========================
      // FIND EXISTING
      // =========================

      const existingType =
        propertyTypes?.find(
          (item: any) =>

            normalizeText(
              item.property_type_name
            ) === normalizedName
        );

      // =========================
      // EXISTING
      // =========================

      if (existingType) {

        return existingType.property_type_id;
      }

      // =========================
      // CREATE NEW
      // =========================

      const {
        data: newType,
        error: insertError,
      } = await supabase

        .from("property_type")

        .insert([
          {
            property_type_name:
              propertyType.trim(),
          },
        ])

        .select()

        .single();

      if (insertError) {

        console.log(insertError);

        return null;
      }

      return newType.property_type_id;
    }


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async () => {

      try {

        const finalPropertyTypeId =
        propertyTypeId ||
        await findOrCreatePropertyType();

        await onSubmit({

          file,

          name,

          phone,

          property_type:
            propertyType,

          property_type_id:
            finalPropertyTypeId || "",

          district,

          city,

          notes,

          latitude,

          longitude,

          status,
        });

        onClose();

      } catch (error) {

        console.log(error);

        alert(
          "Gagal simpan"
        );
      }
    };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        overflow-y-auto
        p-3
        lg:p-6
      "
    >

      {/* MODAL */}

      <div
        className="
          bg-white
          w-full
          max-w-5xl
          rounded-3xl
          relative
          max-h-[92vh]
          overflow-y-auto
          my-4
        "
      >

        {/* CLOSE */}

        <button
          onClick={onClose}
          className="
            absolute
            top-5
            right-5
            z-10
            cursor-pointer
          "
        >
          <X size={28} />
        </button>

        <div className="
        grid 
        grid-cols-1 
        lg:grid-cols-2
        min-h-full
        ">

          {/* LEFT */}

          <div className="p-6 border-r">

            <h2 className="text-3xl font-bold">
              Upload Photo
            </h2>

            <p className="text-gray-500 mt-2">
              Upload spanduk property
            </p>

            {/* EMPTY */}

            {!preview &&
              !uploading && (

                <div
                  className="
                    mt-8
                    border-2
                    border-dashed
                    rounded-3xl
                    h-[360px]
                    flex
                    flex-col
                    items-center
                    justify-center
                  "
                >

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept="image/*"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />

                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      bg-black
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      cursor-pointer
                    "
                  >
                    Choose Photo
                  </button>

                  <p className="text-sm text-gray-400 mt-4">
                    JPG, PNG, HEIC
                  </p>

                </div>
              )}

            {/* PROGRESS */}

            {uploading && (

              <div
                className="
                  mt-8
                  border
                  rounded-3xl
                  h-[360px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-10
                "
              >

                <div
                  className="
                    w-full
                    h-3
                    bg-gray-200
                    rounded-full
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      h-full
                      bg-black
                      transition-all
                    "
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />

                </div>

                <div className="mt-4 text-gray-500">
                  Uploading...
                  {" "}
                  {uploadProgress}%
                </div>

              </div>
            )}

            {/* PREVIEW */}

            {preview &&
              !uploading && (

                <div className="mt-6">

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-4
                      gap-3
                    "
                  >

                    <div
                      className="
                        text-sm
                        text-gray-500
                        truncate
                        max-w-[220px]
                      "
                    >
                      {file?.name}
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="
                          border
                          px-4
                          py-2
                          rounded-xl
                          hover:bg-gray-100
                          cursor-pointer
                          text-sm
                        "
                      >
                        Upload Ulang
                      </button>

                      <button
                        onClick={
                          handleScanOCR
                        }
                        disabled={
                          loading
                        }
                        className="
                          bg-black
                          text-white
                          px-4
                          py-2
                          rounded-xl
                          cursor-pointer
                          disabled:opacity-50
                          text-sm
                        "
                      >
                        {loading
                          ? "Scanning..."
                          : "Scan OCR"}
                      </button>

                    </div>

                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      accept="image/*"
                      onChange={
                        handleFileChange
                      }
                      className="hidden"
                    />

                  </div>

                  <img
                    src={preview}
                    alt="preview"
                    className="
                      w-full
                      h-[360px]
                      object-cover
                      rounded-3xl
                      border
                    "
                  />

                </div>
              )}

          </div>

          {/* RIGHT */}

          {preview &&
            !uploading && (

              <div
                className="
                  p-5
                  lg:p-6
                "
              >

                <h3 className="text-2xl font-bold">
                  Property Data
                </h3>

                <p className="text-gray-500 mt-2">
                  Koreksi data jika OCR salah baca
                </p>

                <div className="mt-6 space-y-4">

                  {/* NAME */}

                  <div>
                    <label className="font-medium text-sm">
                      Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                      "
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="font-medium text-sm">
                      Phone
                    </label>

                    <input
                      type="text"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                      "
                    />
                  </div>

                  {/* PROPERTY TYPE */}

                  <div className="relative">

                  <label className="font-medium text-sm">
                    Property Type
                  </label>

                  <input
                    type="text"
                    value={propertyType}
                    onChange={(e) => {

                      setPropertyType(
                        e.target.value
                      );

                      setPropertyTypeId(null);
                    }}
                    className="
                      w-full
                      border
                      rounded-xl
                      px-4
                      py-3
                      mt-2
                    "
                  />

                  {propertyTypeSuggestions.length > 0 && (

                    <div
                      className="
                        absolute
                        z-20
                        w-full
                        bg-white
                        border
                        rounded-xl
                        mt-1
                        overflow-hidden
                        shadow-lg
                      "
                    >

                      {propertyTypeSuggestions.map(
                        (item: any) => (

                          <button
                            key={
                              item.property_type_id
                            }
                            type="button"
                            onClick={() => {

                              setPropertyType(
                                item.property_type_name
                              );

                              setPropertyTypeId(
                                item.property_type_id
                              );

                              setPropertyTypeSuggestions(
                                []
                              );
                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-gray-100
                            "
                          >
                            {
                              item.property_type_name
                            }
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

                  {/* DISTRICT */}

                  <div>
                    <label className="font-medium text-sm">
                      District
                    </label>

                    <input
                      type="text"
                      value={district}
                      onChange={(e) =>
                        setDistrict(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                      "
                    />
                  </div>

                  {/* CITY */}

                  <div>
                    <label className="font-medium text-sm">
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(e) =>
                        setCity(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                      "
                    />
                  </div>

                  {/* STATUS */}

                  <div>
                    <label className="font-medium text-sm">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                      "
                    >

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
                  </div>

                  {/* LATITUDE */}

                  <div>
                    <label className="font-medium text-sm">
                      Latitude
                    </label>

                    <input
                      type="text"
                      value={latitude}
                      readOnly
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                        bg-gray-100
                      "
                    />
                  </div>

                  {/* LONGITUDE */}

                  <div>
                    <label className="font-medium text-sm">
                      Longitude
                    </label>

                    <input
                      type="text"
                      value={longitude}
                      readOnly
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                        bg-gray-100
                      "
                    />
                  </div>

                  {/* GOOGLE MAPS */}

                  {latitude &&
                    longitude && (

                      <a
                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                        target="_blank"
                        className="
                          text-blue-600
                          underline
                          text-sm
                        "
                      >
                        Open Google Maps
                      </a>
                    )}

                  {/* NOTES */}

                  <div>
                    <label className="font-medium text-sm">
                      Notes
                    </label>

                    <textarea
                      rows={6}
                      value={notes}
                      onChange={(e) =>
                        setNotes(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mt-2
                        resize-none
                      "
                    />
                  </div>

                  {/* BUTTON */}

                  <div
                    className="
                      flex
                      justify-end
                      gap-3
                      pt-2
                    "
                  >

                    <button
                      onClick={
                        onClose
                      }
                      className="
                        border
                        px-5
                        py-3
                        rounded-xl
                        hover:bg-gray-100
                        cursor-pointer
                      "
                    >
                      Cancel
                    </button>

                    <button
                      onClick={
                        handleSubmit
                      }
                      className="
                        bg-black
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        cursor-pointer
                      "
                    >
                      Submit
                    </button>

                  </div>

                </div>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}