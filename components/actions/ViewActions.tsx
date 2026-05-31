"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import{
    ChevronDown,
} from "lucide-react";

type ActionItem = {
  label?: string;

  onClick?: () => void;

  danger?: boolean;

  divider?: boolean;
};

type ViewActionsProps = {
  items: ActionItem[];
};

export default function ViewActions({
  items,
}: ViewActionsProps) {

  return (

    <DropdownMenu>

      <DropdownMenuTrigger
        onClick={(e) => {
         e.stopPropagation();
        }}

         className="
         inline-flex
        items-center
        gap-2
        rounded-lg
        border
        px-3
        py-1.5
        text-sm
        font-medium
        bg-white
        hover:bg-gray-100
        transition
        outline-none
        "
        >
        View Actions

        <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"

        className="
          w-48
          z-[9999]
        "
      >

        {items.map(
          (
            item,
            index
          ) => {

            if (item.divider) {

              return (
                <DropdownMenuSeparator
                  key={index}
                />
              );
            }

            return (

              <DropdownMenuItem
                key={index}

                onClick={(e) => {

                  e.stopPropagation();

                  item.onClick?.();

                }}

                className={
                  item.danger
                    ? "text-red-500"
                    : ""
                }
              >
                {item.label}
              </DropdownMenuItem>

            );
          }
        )}

      </DropdownMenuContent>

    </DropdownMenu>
  );
}