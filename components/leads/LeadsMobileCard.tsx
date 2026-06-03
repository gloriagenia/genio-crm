"use client";

import {
  MapPin,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LeadsMobileCardProps = {
  lead: any;
  onViewDetail?: (lead: any) => void;
  onWhatsapp?: (lead: any) => void;
  onEdit?: (lead: any) => void;
  onDelete?: (lead: any) => void;
  onCreateInquiry?: (lead: any) => void;
};

export default function LeadsMobileCard({
  lead,
  onViewDetail,
  onWhatsapp,
  onEdit,
  onDelete,
  onCreateInquiry,
}: LeadsMobileCardProps) {
  const overdue = lead?.is_overdue;

  return (
    <div
      onClick={() => onViewDetail?.(lead)}
      className="
        cursor-pointer
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all
        hover:shadow-md
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-slate-900">
            {lead?.contacts?.name || "-"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {lead?.contacts?.phone || "-"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={
              overdue
                ? "rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600"
                : "rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-600"
            }
          >
            {overdue ? "Overdue" : "On Time"}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                hover:bg-slate-100
              "
            >
              <MoreHorizontal
                size={16}
                className="text-slate-600"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={() => onWhatsapp?.(lead)}
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEdit?.(lead)}
              >
                <Pencil size={15} />
                <span>Edit Lead</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete?.(lead)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 size={15} />
                <span>Delete Lead</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onCreateInquiry?.(lead)
                }
                className="border-t pt-3 font-medium"
              >
                <PlusCircle size={15} />
                <span>Create Inquiry</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body */}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <MapPin
              size={13}
              className="text-slate-400"
            />

            <span
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              Location
            </span>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-800">
            {lead?.district || "-"}
          </p>

          <p className="text-xs text-slate-500">
            {lead?.city || "-"}
          </p>
        </div>

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
            Follow Up
          </p>

          <div className="mt-2 space-y-1.5">
            <p className="text-xs text-slate-500">
              Last:{" "}
              {lead?.last_contact_relative || "-"}
            </p>

            <p className="text-xs font-semibold text-slate-800">
              Next:{" "}
              {lead?.next_followup_formatted ||
                "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}