"use client";

import {
  FileSearch,
  Plus,
} from "lucide-react";

import { Button }
from "@/components/ui/Button";

// =========================
// TYPES
// =========================

type LeadEmptyStateProps = {

  title?: string;

  description?: string;

  buttonLabel?: string;

  onAddLead?: () => void;
};

// =========================
// COMPONENT
// =========================

export default function LeadEmptyState({

  title = "No Leads Found",

  description = "You don’t have any leads yet. Start adding leads to track follow ups, inquiries, and conversions.",

  buttonLabel = "Add Lead",

  onAddLead,

}: LeadEmptyStateProps) {

  return (

    <div
      className="
        flex
        flex-col
        items-center
        justify-center

        rounded-[32px]

        border
        border-dashed
        border-slate-200

        bg-white

        px-6
        py-16

        text-center

        shadow-sm
      "
    >

      {/* ICON */}

      <div
        className="
          flex
          h-20
          w-20

          items-center
          justify-center

          rounded-full

          bg-amber-50
        "
      >

        <FileSearch
          size={36}
          className="
            text-amber-500
          "
        />

      </div>

      {/* TITLE */}

      <h3
        className="
          mt-6

          text-xl
          font-semibold

          text-slate-900
        "
      >
        {title}
      </h3>

      {/* DESCRIPTION */}

      <p
        className="
          mt-3

          max-w-md

          text-sm
          leading-relaxed

          text-slate-500
        "
      >
        {description}
      </p>

      {/* BUTTON */}

      {onAddLead && (

        <div
          className="
            mt-8
          "
        >

          <Button
            onClick={
              onAddLead
            }
            className="
              rounded-2xl
            "
          >

            <Plus size={16} />

            {buttonLabel}

          </Button>

        </div>

      )}

    </div>
  );
}