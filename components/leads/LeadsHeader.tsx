"use client";

import {
  Plus,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// =========================
// TYPES
// =========================

type LeadsHeaderProps = {

  // =========================
  // DATA
  // =========================

  totalLeads?: number;

  loading?: boolean;

  // =========================
  // ACTIONS
  // =========================

  onAddLead?: () => void;

  onRefresh?: () => void;
};

// =========================
// COMPONENT
// =========================

export default function LeadsHeader({
  totalLeads = 0,

  loading = false,

  onAddLead,

  onRefresh,
}: LeadsHeaderProps) {

  return (

    <div
      className="
        flex
        flex-col
        gap-4

        md:flex-row
        md:items-center
        md:justify-between
      "
    >

      {/* LEFT */}

      <div>

        {/* TITLE */}

        <h1
          className="
            text-[28px]
            font-bold
            tracking-tight

            text-slate-900
          "
        >
          Leads
        </h1>

        {/* SUBTITLE */}

        <div
          className="
            mt-2

            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <p
            className="
              text-sm

              text-slate-500
            "
          >
            Manage all incoming property leads
          </p>

          <span
            className="
              rounded-full

              bg-[#FFF6D8]

              px-2.5
              py-1

              text-xs
              font-semibold

              text-[#B88900]
            "
          >

            {loading
              ? "Loading..."
              : `${totalLeads.toLocaleString()} Leads`}

          </span>

        </div>

      </div>

      {/* RIGHT */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        {/* REFRESH */}

        <button
          type="button"

          onClick={onRefresh}

          disabled={loading}

          className="
            flex
            h-12
            w-12

            items-center
            justify-center

            rounded-2xl

            border
            border-slate-200

            bg-white

            text-slate-600

            transition-all

            hover:bg-slate-50
            hover:text-slate-900

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <RefreshCcw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

        </button>

        {/* ADD BUTTON */}

        <Button
          onClick={onAddLead}
          variant="default"
          size="lg"
          >
            + Add Lead
          </Button>

      </div>

    </div>
  );
}