"use client";

import clsx from "clsx";

import {
  MessageCircle,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// =========================
// TYPES
// =========================

type LeadsTableRowProps = {
  lead: any;

  index: number;

  onViewDetail?: (
    lead: any
  ) => void;

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

export default function LeadsTableRow({
  lead,

  index,

  onViewDetail,

  onWhatsapp,

  onEdit,

  onDelete,

  onCreateInquiry,
}: LeadsTableRowProps) {

  // =========================
  // DATA
  // =========================

  const overdue =
    lead?.is_overdue;

  const lastFollowUp =
    lead?.last_contact_relative ||
    "-";

  const nextFollowUp =
    lead?.next_followup_formatted ||
    "-";

  const district =
    lead?.district || "-";

  const city =
    lead?.city || "-";

  const contactName =
    lead?.contacts?.name || "-";

  const contactPhone =
    lead?.contacts?.phone || "-";

  // =========================
  // RENDER
  // =========================

  return (

    <tr
      onClick={() =>
        onViewDetail?.(
          lead
        )
      }
      className="
        cursor-pointer

        border-b
        border-slate-100

        transition-all

        hover:bg-amber-50/40
      "
    >

      {/* ========================= */}
      {/* NO */}
      {/* ========================= */}

      <td
        className="
          px-6
          py-5

          align-top
        "
      >

        <p
          className="
            text-sm
            font-medium

            text-slate-700
          "
        >
          {index}
        </p>

      </td>

      {/* ========================= */}
      {/* CONTACT */}
      {/* ========================= */}

      <td
        className="
          px-6
          py-5

          align-top
        "
      >

        <div
          className="
            min-w-[180px]
          "
        >

          <p
            className="
              text-sm
              font-semibold

              text-slate-900
            "
          >
            {contactName}
          </p>

          <p
            className="
              mt-1

              text-sm

              text-slate-500
            "
          >
            {contactPhone}
          </p>

        </div>

      </td>

      {/* ========================= */}
      {/* LOCATION */}
      {/* ========================= */}

      <td
        className="
          px-6
          py-5

          align-top
        "
      >

        <div
          className="
            min-w-[160px]
          "
        >

          <p
            className="
              text-sm
              font-medium

              text-slate-800
            "
          >
            {district}
          </p>

          <p
            className="
              mt-1

              text-sm

              text-slate-500
            "
          >
            {city}
          </p>

        </div>

      </td>

      {/* ========================= */}
      {/* FOLLOW UP */}
      {/* ========================= */}

      <td
        className="
          px-6
          py-5

          align-top
        "
      >

        <div
          className="
            min-w-[180px]
            space-y-2
          "
        >

          {/* LAST */}

          <div>

            <p
              className="
                text-[11px]
                font-medium

                uppercase
                tracking-wide

                text-slate-400
              "
            >
              Last
            </p>

            <p
              className="
                mt-1

                text-sm
                font-medium

                text-slate-700
              "
            >
              {lastFollowUp}
            </p>

          </div>

          {/* NEXT */}

          <div>

            <p
              className="
                text-[11px]
                font-medium

                uppercase
                tracking-wide

                text-slate-400
              "
            >
              Next
            </p>

            <p
              className="
                mt-1

                text-sm
                font-semibold

                text-slate-900
              "
            >
              {nextFollowUp}
            </p>

          </div>

        </div>

      </td>

      {/* ========================= */}
      {/* OVERDUE */}
      {/* ========================= */}

      <td
        className="
          px-6
          py-5

          align-top
        "
      >

        <div
          className="
            min-w-[120px]
          "
        >

          {overdue ? (

            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                bg-red-100

                px-3
                py-1.5

                text-xs
                font-semibold

                text-red-600
              "
            >

              <span
                className="
                  h-2
                  w-2

                  rounded-full

                  bg-red-500
                "
              />

              Overdue

            </div>

          ) : (

            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                bg-emerald-100

                px-3
                py-1.5

                text-xs
                font-semibold

                text-emerald-600
              "
            >

              <span
                className="
                  h-2
                  w-2

                  rounded-full

                  bg-emerald-500
                "
              />

              On Time

            </div>

          )}

        </div>

      </td>

      {/* ========================= */}
      {/* ACTION */}
      {/* ========================= */}

      <td
        className="
          px-6
          py-5

          align-top
          text-right
        "
      >

        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            flex
            items-center
            justify-end
          "
        >

          <DropdownMenu>

            {/* ========================= */}
            {/* TRIGGER */}
            {/* ========================= */}

            <DropdownMenuTrigger

              onClick={(e) =>
                e.stopPropagation()
              }

              className="
                rounded-xl

                border
                border-slate-200

                bg-white

                px-3
                py-2

                text-sm
                font-medium

                text-slate-700

                transition-all

                hover:bg-slate-50
              "
            >

              View Actions

            </DropdownMenuTrigger>

            {/* ========================= */}
            {/* CONTENT */}
            {/* ========================= */}

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
                onClick={() =>
                  onWhatsapp?.(
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

                <MessageCircle
                  size={15}
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
                  size={15}
                />

                Edit Lead

              </DropdownMenuItem>

              {/* DELETE */}

              <DropdownMenuItem
                onClick={() =>
                  onDelete?.(
                    lead
                  )
                }
                className={clsx(
                  `
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

                    focus:text-red-600
                  `
                )}
              >

                <Trash2
                  size={15}
                />

                Delete Lead

              </DropdownMenuItem>

              {/* DIVIDER */}

              <div
                className="
                  my-2
                  border-t
                "
              />

              {/* CREATE INQUIRY */}

              <DropdownMenuItem
                onClick={() =>
                  onCreateInquiry?.(
                    lead
                  )
                }
                className="
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
                  size={15}
                />

                Create Inquiry

              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </td>

    </tr>
  );
}