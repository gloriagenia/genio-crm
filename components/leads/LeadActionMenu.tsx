"use client";

import {
  MessageCircle,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// =========================
// TYPES
// =========================

type LeadActionMenuProps = {

  lead: any;

  onWhatsapp?: (
    lead: any
  ) => void;

  onEdit?: (
    lead: any
  ) => void;

  onDelete?: (
    lead: any
  ) => void;

  onCreateInquiry?: (
    lead: any
  ) => void;
};

// =========================
// COMPONENT
// =========================

export default function LeadActionMenu({

  lead,

  onWhatsapp,

  onEdit,

  onDelete,

  onCreateInquiry,

}: LeadActionMenuProps) {

  // =========================
  // WHATSAPP
  // =========================

  function handleWhatsapp() {

    if (onWhatsapp) {

      onWhatsapp(
        lead
      );

      return;
    }

    const phone =
      lead?.contacts
        ?.phone;

    if (!phone)
      return;

    let cleanPhone =
      phone.replace(
        /\D/g,
        ""
      );

    // 0812 -> 62812

    if (
      cleanPhone.startsWith(
        "0"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone.slice(1);
    }

    // 812 -> 62812

    if (
      cleanPhone.startsWith(
        "8"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone;
    }

    // fallback

    if (
      !cleanPhone.startsWith(
        "62"
      )
    ) {

      cleanPhone =
        "62" +
        cleanPhone;
    }

    window.open(
      `https://wa.me/${cleanPhone}`,
      "_blank"
    );
  }

  // =========================
  // DELETE
  // =========================

  function handleDelete() {

    const confirmed =
      confirm(
        `Delete lead "${lead?.contacts?.name}" ?`
      );

    if (!confirmed)
      return;

    onDelete?.(
      lead
    );
  }

  // =========================
  // RENDER
  // =========================

  return (

    <DropdownMenu>

      {/* TRIGGER */}

      <DropdownMenuTrigger>

        <button
          className="
            flex
            h-8
            w-8
            items-center
            justify-center

            rounded-xl

            border
            border-slate-200

            bg-white

            transition-all

            hover:bg-slate-100
          "
        >

          <MoreHorizontal
            size={16}
            className="
              text-slate-600
            "
          />

        </button>

      </DropdownMenuTrigger>

      {/* CONTENT */}

      <DropdownMenuContent
        align="end"
        className="
          w-56
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-2
          shadow-xl
        "
      >

        {/* WHATSAPP */}

        <DropdownMenuItem
          onClick={
            handleWhatsapp
          }
          className="
            flex
            cursor-pointer
            items-center
            gap-2

            rounded-xl

            px-3
            py-2.5

            text-sm

            hover:bg-slate-100
          "
        >

          <MessageCircle
            size={16}
          />

          WhatsApp

        </DropdownMenuItem>

        {/* EDIT */}

        <DropdownMenuItem
          onClick={() =>
            onEdit?.(
              lead
            )
          }
          className="
            flex
            cursor-pointer
            items-center
            gap-2

            rounded-xl

            px-3
            py-2.5

            text-sm

            hover:bg-slate-100
          "
        >

          <Pencil
            size={16}
          />

          Edit Lead

        </DropdownMenuItem>

        {/* DELETE */}

        <DropdownMenuItem
          onClick={
            handleDelete
          }
          className="
            flex
            cursor-pointer
            items-center
            gap-2

            rounded-xl

            px-3
            py-2.5

            text-sm

            text-red-600

            hover:bg-red-50
          "
        >

          <Trash2
            size={16}
          />

          Delete Lead

        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* CREATE INQUIRY */}

        <DropdownMenuItem
          onClick={() =>
            onCreateInquiry?.(
              lead
            )
          }
          className="
            mt-1

            flex
            cursor-pointer
            items-center
            gap-2

            rounded-xl

            bg-[#091B44]

            px-3
            py-2.5

            text-sm
            font-medium

            text-white

            hover:bg-[#12285F]
          "
        >

          <PlusCircle
            size={16}
          />

          Create Inquiry

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}