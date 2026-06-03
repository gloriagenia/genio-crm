"use client";

import {
  Building2,
  MessageCircle,
  Search,
} from "lucide-react";

import { openWhatsApp } from "@/src/utils/openWhatsApp";

// =========================
// TYPES
// =========================

interface ContactQuickActionProps {
  contact: any;

  onCreateLead?: (
    contact: any
  ) => void;

  onCreateInquiry?: (
    contact: any
  ) => void;

  className?: string;
}

// =========================
// COMPONENT
// =========================

export default function ContactQuickAction({
  contact,
  onCreateLead,
  onCreateInquiry,
  className = "",
}: ContactQuickActionProps) {
  // =========================
  // VALIDATION
  // =========================

  if (!contact) {
    return null;
  }

  // =========================
  // HANDLERS
  // =========================

  async function handleWhatsApp(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    await openWhatsApp({
      phone: contact.phone,

      contactId:
        contact.contact_id,

      source:
        "Contact Quick Action",
    });
  }

  function handleCreateLead(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    onCreateLead?.(contact);
  }

  function handleCreateInquiry(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    onCreateInquiry?.(
      contact
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className={`
        flex
        items-center
        gap-3

        ${className}
      `}
    >
      {/* WHATSAPP */}
      <button
        onClick={
          handleWhatsApp
        }
        className="
          flex-1

          inline-flex
          items-center
          justify-center
          gap-2

          rounded-2xl

          bg-green-500

          px-4
          py-3

          text-sm
          font-semibold

          text-white

          shadow-sm

          transition-all
          duration-200

          hover:bg-green-600

          active:scale-[0.98]
        "
      >
        <MessageCircle
          size={16}
        />

        <span>
          WhatsApp
        </span>
      </button>

      {/* CREATE LEAD */}
      <button
        onClick={
          handleCreateLead
        }
        className="
          inline-flex
          items-center
          justify-center

          rounded-2xl

          border
          border-slate-200

          bg-white

          p-3

          text-slate-700

          shadow-sm

          transition-all
          duration-200

          hover:bg-slate-50

          active:scale-[0.98]
        "
      >
        <Building2
          size={18}
        />
      </button>

      {/* CREATE INQUIRY */}
      <button
        onClick={
          handleCreateInquiry
        }
        className="
          inline-flex
          items-center
          justify-center

          rounded-2xl

          border
          border-slate-200

          bg-white

          p-3

          text-slate-700

          shadow-sm

          transition-all
          duration-200

          hover:bg-slate-50

          active:scale-[0.98]
        "
      >
        <Search size={18} />
      </button>
    </div>
  );
}