"use client";

import clsx from "clsx";

import {
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// ======================================================
// TYPES
// ======================================================

type Props = {
  template?: any;

  saving?: boolean;

  saved?: boolean;

  isDirty?: boolean;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateHeader({
  template,

  saving = false,

  saved = false,

  isDirty = false,
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
  // EMPTY
  // ======================================================

  if (!template) {
    return (
      <div
        className="
          rounded-3xl
          border border-gray-200
          bg-white
          p-6
        "
      >
        <div className="flex items-start gap-4">
          {/* ICON */}

          <div
            className="
              flex h-14 w-14
              items-center
              justify-center
              rounded-3xl
              bg-[#f4ebff]
              text-[#7f56d9]
            "
          >
            <MessageSquare
              size={26}
            />
          </div>

          {/* CONTENT */}

          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-[#0f172a]
              "
            >
              Template Workspace
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Select template to
              start editing WhatsApp
              communication flow
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      className="
        rounded-3xl
        border border-gray-200
        bg-white
        p-6
      "
    >
      <div className="flex items-start justify-between gap-5">
        {/* ========================================== */}
        {/* LEFT */}
        {/* ========================================== */}

        <div className="flex gap-4">
          {/* ICON */}

          <div
            className="
              flex h-16 w-16
              items-center
              justify-center
              rounded-3xl
              bg-[#f4ebff]
              text-[#7f56d9]
            "
          >
            <MessageSquare
              size={30}
            />
          </div>

          {/* CONTENT */}

          <div>
            {/* TITLE */}

            <div className="flex items-center gap-3">
              <h1
                className="
                  text-2xl
                  font-bold
                  text-[#0f172a]
                "
              >
                {template.title}
              </h1>

              {/* ACTIVE STATUS */}

              <div
                className={clsx(
                  `
                  rounded-2xl
                  px-3 py-1
                  text-xs
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
                  : "Inactive"}
              </div>
            </div>

            {/* DESCRIPTION */}

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-7
                text-gray-500
              "
            >
              Manage WhatsApp
              template message,
              variables, trigger
              automation, and
              communication workflow.
            </p>

            {/* META */}

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              {/* CATEGORY */}

              {template.category && (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-[#f4ebff]
                    px-3 py-2
                    text-xs
                    font-medium
                    text-[#7f56d9]
                  "
                >
                  <FileText
                    size={14}
                  />

                  {
                    template.category
                  }
                </div>
              )}

              {/* CONTACT TYPE */}

              {template.contact_type && (
                <div
                  className="
                    rounded-2xl
                    bg-[#ecfdf3]
                    px-3 py-2
                    text-xs
                    font-medium
                    text-[#027a48]
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
                    rounded-2xl
                    bg-gray-100
                    px-3 py-2
                    text-xs
                    font-medium
                    text-gray-600
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
                    rounded-2xl
                    bg-[#fffaeb]
                    px-3 py-2
                    text-xs
                    font-medium
                    text-[#b54708]
                  "
                >
                  {
                    template.source_module
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT */}
        {/* ========================================== */}

        <div className="flex flex-col items-end gap-3">
          {/* SAVE STATUS */}

          {saving ? (
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                border border-[#d6bbfb]
                bg-[#f9f5ff]
                px-4 py-2
                text-sm
                font-medium
                text-[#7f56d9]
              "
            >
              <Sparkles
                size={15}
                className="
                  animate-pulse
                "
              />

              Saving changes...
            </div>
          ) : saved ? (
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                border border-[#abefc6]
                bg-[#ecfdf3]
                px-4 py-2
                text-sm
                font-medium
                text-[#027a48]
              "
            >
              <CheckCircle2
                size={15}
              />

              Saved
            </div>
          ) : isDirty ? (
            <div
              className="
                rounded-2xl
                border border-[#fedf89]
                bg-[#fffaeb]
                px-4 py-2
                text-sm
                font-medium
                text-[#b54708]
              "
            >
              Unsaved Changes
            </div>
          ) : null}

          {/* UPDATED */}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-400
            "
          >
            <Clock3 size={13} />

            Last updated{" "}
            {formatDate(
              template.updated_at
            )}
          </div>
        </div>
      </div>
    </div>
  );
}