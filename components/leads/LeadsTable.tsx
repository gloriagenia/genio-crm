"use client";

import { Loader2 } from "lucide-react";

import TableContainer from "@/components/tables/TableContainer";

import LeadsTableRow from "@/components/leads/LeadsTableRow";

import LeadsMobileCard from "@/components/leads/LeadsMobileCard";

import LeadEmptyState from "@/components/leads/LeadEmptyState";

import Pagination from "@/components/ui/Pagination";

// =========================
// TYPES
// =========================

type LeadsTableProps = {
  leads: any[];

  loading?: boolean;

  total?: number;

  currentPage?: number;

  totalPages?: number;

  limit?: number;

  onPageChange?: (
    page: number
  ) => void;

  onViewDetail?: (
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

  onWhatsapp?: (
    lead: any
  ) => void;
};

// =========================
// COMPONENT
// =========================

export default function LeadsTable({
  leads,

  loading = false,

  total = 0,

  currentPage = 1,

  totalPages = 1,

  limit = 10,

  onPageChange,

  onViewDetail,

  onEdit,

  onDelete,

  onCreateInquiry,

  onWhatsapp,
}: LeadsTableProps) {

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div
        className="
          flex
          min-h-[420px]

          items-center
          justify-center

          rounded-[28px]

          border
          border-slate-200

          bg-white
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-3
          "
        >

          <Loader2
            size={28}
            className="
              animate-spin
              text-amber-500
            "
          />

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Loading leads...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (
    !loading &&
    leads.length === 0
  ) {

    return (
      <LeadEmptyState />
    );
  }

  // =========================
  // RENDER
  // =========================

  return (

    <div
      className="
        space-y-4
      "
    >

      {/* ========================= */}
      {/* MOBILE VIEW */}
      {/* ========================= */}

      <div
        className="
          space-y-3

          lg:hidden
        "
      >

        {leads.map(
          (lead) => (

            <LeadsMobileCard
              key={
                lead.leads_id
              }

              lead={lead}

              onViewDetail={
                onViewDetail
              }

              onWhatsapp={
                onWhatsapp
              }

              onEdit={
                onEdit
              }

              onDelete={
                onDelete
              }

              onCreateInquiry={
                onCreateInquiry
              }
            />

          )
        )}

      </div>

      {/* ========================= */}
      {/* DESKTOP VIEW */}
      {/* ========================= */}

      <div
        className="
          hidden

          lg:block
        "
      >

        <TableContainer
          className="
            overflow-hidden

            rounded-[28px]

            border
            border-slate-200

            bg-white
          "
        >

          <table
            className="
              min-w-full
            "
          >

            {/* ========================= */}
            {/* HEAD */}
            {/* ========================= */}

            <thead
              className="
                border-b

                bg-slate-50/80
              "
            >

              <tr>

                {/* NO */}

                <th
                  className="
                    px-6
                    py-4

                    text-left
                    text-xs
                    font-semibold

                    uppercase
                    tracking-wide

                    text-slate-500
                  "
                >
                  No
                </th>

                {/* CONTACT */}

                <th
                  className="
                    px-6
                    py-4

                    text-left
                    text-xs
                    font-semibold

                    uppercase
                    tracking-wide

                    text-slate-500
                  "
                >
                  Contact
                </th>

                {/* LOCATION */}

                <th
                  className="
                    px-6
                    py-4

                    text-left
                    text-xs
                    font-semibold

                    uppercase
                    tracking-wide

                    text-slate-500
                  "
                >
                  Location
                </th>

                {/* FOLLOW UP */}

                <th
                  className="
                    px-6
                    py-4

                    text-left
                    text-xs
                    font-semibold

                    uppercase
                    tracking-wide

                    text-slate-500
                  "
                >
                  Follow Up
                </th>

                {/* OVERDUE */}

                <th
                  className="
                    px-6
                    py-4

                    text-left
                    text-xs
                    font-semibold

                    uppercase
                    tracking-wide

                    text-slate-500
                  "
                >
                  Overdue
                </th>

                {/* ACTION */}

                <th
                  className="
                    px-6
                    py-4

                    text-right
                    text-xs
                    font-semibold

                    uppercase
                    tracking-wide

                    text-slate-500
                  "
                >
                  Action
                </th>

              </tr>

            </thead>

            {/* ========================= */}
            {/* BODY */}
            {/* ========================= */}

            <tbody>

              {leads.map(
                (
                  lead,
                  index
                ) => (

                  <LeadsTableRow
                    key={
                      lead.leads_id
                    }

                    lead={lead}

                    index={
                      (
                        (
                          currentPage - 1
                        ) * limit
                      ) + index + 1
                    }

                    onViewDetail={
                      onViewDetail
                    }

                    onWhatsapp={
                      onWhatsapp
                    }

                    onEdit={
                      onEdit
                    }

                    onDelete={
                      onDelete
                    }

                    onCreateInquiry={
                      onCreateInquiry
                    }
                  />

                )
              )}

            </tbody>

          </table>

        </TableContainer>

      </div>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <div
        className="
          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* TOTAL */}

        <div
          className="
            text-sm
            text-slate-500
          "
        >

          Showing{" "}

          <span
            className="
              font-semibold
              text-slate-700
            "
          >
            {leads.length}
          </span>

          {" "}of{" "}

          <span
            className="
              font-semibold
              text-slate-700
            "
          >
            {total}
          </span>

          {" "}leads

        </div>

        {/* PAGINATION */}

        <Pagination

          currentPage={
            currentPage
          }

          totalPages={
            totalPages
          }

          onFirst={() =>

            onPageChange?.(
              1
            )

          }

          onPrev={() =>

            onPageChange?.(
              currentPage - 1
            )

          }

          onNext={() =>

            onPageChange?.(
              currentPage + 1
            )

          }

          onLast={() =>

            onPageChange?.(
              totalPages
            )

          }

        />

      </div>

    </div>
  );
}