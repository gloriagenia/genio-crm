"use client";

import {
  MoreVertical,
  MessageCircle,
  Pencil,
  UserPlus,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ContactActionsDropdownProps {
  contact: any;

  onWhatsApp?: (
    contact: any
  ) => void;

  onEdit?: (
    contact: any
  ) => void;

  onCreateLead?: (
    contact: any
  ) => void;

  onDelete?: (
    contact: any
  ) => void;
}

export default function ContactActionsDropdown({
  contact,
  onWhatsApp,
  onEdit,
  onCreateLead,
  onDelete,
}: ContactActionsDropdownProps) {
  return (
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            text-slate-500
            transition-colors
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          <MoreVertical
            size={18}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="
            min-w-[220px]
          "
        >
          <DropdownMenuItem
            onClick={() =>
              onWhatsApp?.(
                contact
              )
            }
          >
            <MessageCircle
              className="
                h-4
                w-4
              "
            />
            WhatsApp
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              onEdit?.(
                contact
              )
            }
          >
            <Pencil
              className="
                h-4
                w-4
              "
            />
            Edit Contact
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              onCreateLead?.(
                contact
              )
            }
          >
            <UserPlus
              className="
                h-4
                w-4
              "
            />
            Create Lead
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              onDelete?.(
                contact
              )
            }
          >
            <Trash2
              className="
                h-4
                w-4
              "
            />
            Delete Contact
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}