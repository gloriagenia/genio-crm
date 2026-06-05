"use client";

import { useEffect, useRef, useState } from "react";

import {
  MoreVertical,
  MessageCircle,
  Pencil,
  Trash2,
  Building2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { normalizePhone }
from "@/src/utils/normalizePhone";

type CanvassingActionMenuProps = {

  item: any;

  onEdit?: (
    data: any
  ) => void;

  onCreateProperty?: (
    data: any
  ) => void;

  onRefresh?: () => void;
};

export default function CanvassingActionMenu({
  item,
  onEdit,
  onCreateProperty,
  onRefresh,
}: CanvassingActionMenuProps) {

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // CLICK OUTSIDE
  // =========================

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {

        setOpen(false);

      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  // =========================
  // WHATSAPP
  // =========================

  async function handleWhatsapp() {

    try {

      setLoading(true);

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

      const phone =
        normalizePhone(
          item.phone || ""
        );

      window.open(
        `https://wa.me/${phone}`,
        "_blank"
      );

      onRefresh?.();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

      setOpen(false);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete() {

    const confirmed =
      window.confirm(
        "Delete this canvassing?"
      );

    if (!confirmed) return;

    try {

      setLoading(true);

      const { error } =
        await supabase

          .from("canvassing")

          .delete()

          .eq(
            "canvassing_id",
            item.canvassing_id
          );

      if (error) {

        alert(error.message);

        return;
      }

      onRefresh?.();

    } catch (error) {

      console.log(error);

      alert(
        "Failed delete canvassing"
      );

    } finally {

      setLoading(false);

      setOpen(false);
    }
  }

  // =========================
  // CREATE PROPERTY
  // =========================

  async function handleCreateProperty() {

    try {

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

        .maybeSingle();

      onCreateProperty?.({

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

        district:
          item.district || "",

        city:
          item.city || "",

        photo_url:
          item.photo_url || "",

        notes:
          item.notes || "",

        contact_id:
          contact?.contact_id ||
          null,
      });

    } catch (error) {

      console.log(error);

      alert(
        "Failed create property"
      );
    }

    setOpen(false);
  }

  return (

    <div
      ref={dropdownRef}
      className="relative"
    >

      {/* BUTTON */}

      <button
        onClick={(e) => {

          e.stopPropagation();

          setOpen(!open);

        }}
        className="
          h-9
          w-9
          rounded-xl
          border
          flex
          items-center
          justify-center
          hover:bg-gray-100
        "
      >

        <MoreVertical size={18} />

      </button>

      {/* MENU */}

      {open && (

        <div
          className="
            absolute
            right-0
            mt-2
            w-56
            bg-white
            border
            rounded-2xl
            shadow-xl
            overflow-hidden
            z-50
          "
        >

          {/* WHATSAPP */}

          <button
            disabled={loading}
            onClick={handleWhatsapp}
            className="
              w-full
              px-4
              py-3
              flex
              items-center
              gap-3
              text-sm
              hover:bg-gray-50
            "
          >

            <MessageCircle
              size={16}
            />

            WhatsApp

          </button>

          {/* EDIT */}

          <button
            onClick={() => {

              onEdit?.(item);

              setOpen(false);

            }}
            className="
              w-full
              px-4
              py-3
              flex
              items-center
              gap-3
              text-sm
              hover:bg-gray-50
            "
          >

            <Pencil
              size={16}
            />

            Edit

          </button>

          {/* CREATE PROPERTY */}

          {item.status !==
            "Converted" && (

            <button
              onClick={
                handleCreateProperty
              }
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                text-sm
                hover:bg-gray-50
              "
            >

              <Building2
                size={16}
              />

              Create Property

            </button>

          )}

          <div className="border-t" />

          {/* DELETE */}

          <button
            disabled={loading}
            onClick={handleDelete}
            className="
              w-full
              px-4
              py-3
              flex
              items-center
              gap-3
              text-sm
              text-red-600
              hover:bg-red-50
            "
          >

            <Trash2
              size={16}
            />

            Delete

          </button>

        </div>

      )}

    </div>
  );
}