"use client";

import clsx from "clsx";

import {
  Clock3,
  MessageSquare,
} from "lucide-react";

// ======================================================
// TYPES
// ======================================================

export type WATemplateCardData = {
  id: number;

  title: string;

  category: string;

  message: string;

  contact_type?: string;

  source_module?: string;

  pipeline_stage?: string;

  is_active?: boolean;

  created_at?: string;

  updated_at?: string;
};

type Props = {
  template: WATemplateCardData;

  selected?: boolean;

  onClick?: () => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateCard({
  template,
  selected = false,
  onClick,
}: Props) {
  // ======================================================
  // FORMAT DATE
  // ======================================================

  function formatDate(
    value?: string
  ) {
    if (!value) return "-";

    return new Date(
      value
    ).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        `
        w-full
        rounded-2xl
        border
        bg-white
        p-4
        text-left
        transition
        hover:shadow-sm
      `,
        selected
          ? `
            border-[#7f56d9]
            bg-[#f9f5ff]
            ring-2
            ring-[#7f56d9]/20
          `
          : `
            border-gray-200
            hover:border-[#d6bbfb]
          `
      )}
    >
      {/* ============================================== */}
      {/* TOP */}
      {/* ============================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        {/* LEFT */}

        <div className="flex gap-3">
          {/* ICON */}

          <div
            className={clsx(
              `
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-2xl
            `,
              selected
                ? `
                  bg-[#7f56d9]
                  text-white
                `
                : `
                  bg-[#f4ebff]
                  text-[#7f56d9]
                `
            )}
          >
            <MessageSquare
              size={18}
            />
          </div>

          {/* CONTENT */}

          <div className="min-w-0">
            {/* TITLE */}

            <h3
              className="
                truncate
                text-sm
                font-semibold
                text-[#0f172a]
              "
            >
              {template.title}
            </h3>

            {/* MESSAGE */}

            <p
              className="
                mt-1
                line-clamp-1
                text-xs
                text-gray-500
              "
            >
              {template.message}
            </p>
          </div>
        </div>

        {/* STATUS */}

        <div
          className={clsx(
            `
            shrink-0
            rounded-xl
            px-2.5 py-1
            text-[11px]
            font-semibold
          `,
            template.is_active
              ? `
                bg-[#ecfdf3]
                text-[#027a48]
              `
              : `
                bg-gray-100
                text-gray-500
              `
          )}
        >
          {template.is_active
            ? "Active"
            : "Draft"}
        </div>
      </div>

      {/* ============================================== */}
      {/* TAGS */}
      {/* ============================================== */}

      <div
        className="
          mt-3
          flex
          flex-wrap
          gap-2
        "
      >
        {/* CONTACT TYPE */}

        {template.contact_type && (
          <div
            className="
              rounded-xl
              bg-[#f4ebff]
              px-2.5 py-1
              text-[10px]
              font-medium
              text-[#7f56d9]
            "
          >
            {
              template.contact_type
            }
          </div>
        )}

        {/* PIPELINE */}

        {template.pipeline_stage && (
          <div
            className="
              rounded-xl
              bg-[#ecfdf3]
              px-2.5 py-1
              text-[10px]
              font-medium
              text-[#027a48]
            "
          >
            {
              template.pipeline_stage
            }
          </div>
        )}

        {/* MODULE */}

        {template.source_module && (
          <div
            className="
              rounded-xl
              bg-gray-100
              px-2.5 py-1
              text-[10px]
              font-medium
              text-gray-600
            "
          >
            {
              template.source_module
            }
          </div>
        )}
      </div>

      {/* ============================================== */}
      {/* FOOTER */}
      {/* ============================================== */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          border-t
          border-gray-100
          pt-3
        "
      >
        {/* UPDATED */}

        <div
          className="
            flex
            items-center
            gap-1.5
            text-[11px]
            text-gray-400
          "
        >
          <Clock3 size={12} />

          Updated{" "}
          {formatDate(
            template.updated_at
          )}
        </div>

        {/* CATEGORY */}

        <div
          className="
            rounded-xl
            bg-gray-100
            px-2.5 py-1
            text-[10px]
            font-medium
            text-gray-600
          "
        >
          {template.category}
        </div>
      </div>
    </button>
  );
}