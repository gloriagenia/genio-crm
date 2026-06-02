"use client";

import WATemplateEditor from "@/components/communications/templates/WATemplateEditor";

import WATriggerRulesSection from "@/components/communications/templates/WATriggerRulesSection";

// ======================================================
// TYPES
// ======================================================

type Props = {
  template: any;

  onRefresh?: () => void;

  onLiveChange?: (
    template: any
  ) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateWorkspace({
  template,
  onRefresh,
  onLiveChange,
}: Props) {
  // ======================================================
  // EMPTY
  // ======================================================

  if (!template) {
    return (
      <div
        className="
          flex
          min-h-[520px]
          items-center
          justify-center
          rounded-3xl
          border border-dashed
          border-gray-200
          bg-white
          p-10
        "
      >
        <div className="text-center">
          {/* ICON */}

          <div
            className="
              mx-auto
              flex h-20 w-20
              items-center
              justify-center
              rounded-3xl
              bg-[#f4ebff]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="
                h-10 w-10
                text-[#7f56d9]
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z"
              />
            </svg>
          </div>

          {/* TITLE */}

          <h2
            className="
              mt-6
              text-2xl
              font-bold
              text-[#0f172a]
            "
          >
            Select Template
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-7
              text-gray-500
            "
          >
            Choose WhatsApp template
            from template list to
            edit message content,
            variables, workflow
            settings, and automation
            rules.
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">
      {/* ============================================== */}
      {/* TEMPLATE EDITOR */}
      {/* ============================================== */}

      <div
        className="
          rounded-3xl
          border border-gray-200
          bg-white
          p-6
        "
      >
        <WATemplateEditor
          template={template}
          onUpdated={onRefresh}
          onLiveChange={
            onLiveChange
          }
        />
      </div>

      {/* ============================================== */}
      {/* TRIGGER RULES */}
      {/* ============================================== */}

      <div
        className="
          rounded-3xl
          border border-gray-200
          bg-white
          p-6
        "
      >
        <WATriggerRulesSection
          template={template}
          onUpdated={onRefresh}
        />
      </div>
    </div>
  );
}