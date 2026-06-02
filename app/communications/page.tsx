"use client";

import {
  useEffect,
  useState,
} from "react";

import MainLayout from "@/components/layout/MainLayout";

import WATemplateGroupPanel from "@/components/communications/groups/WATemplateGroupPanel";

import WATemplateSelector from "@/components/communications/templates/WATemplateSelector";

import WATemplateWorkspace from "@/components/communications/templates/WATemplateWorkspace";

import WATemplatePreview from "@/components/communications/preview/WATemplatePreview";

import WATemplateModal from "@/components/communications/modals/WATemplateModal";

// ======================================================
// TYPES
// ======================================================

export type WATemplate = {
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

// ======================================================
// COMPONENT
// ======================================================

export default function CommunicationsPage() {
  // ======================================================
  // STATES
  // ======================================================

  const [selectedGroup, setSelectedGroup] =
    useState("");

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] =
    useState<WATemplate | null>(
      null
    );

  const [
    editingTemplate,
    setEditingTemplate,
  ] =
    useState<WATemplate | null>(
      null
    );

  const [openModal, setOpenModal] =
    useState(false);

  // ======================================================
  // SYNC EDITING TEMPLATE
  // ======================================================

  useEffect(() => {
    setEditingTemplate(
      selectedTemplate
    );
  }, [selectedTemplate]);

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* ========================================== */}
        {/* PAGE HEADER */}
        {/* ========================================== */}

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
                flex h-16 w-16
                items-center
                justify-center
                rounded-3xl
                bg-[#f4ebff]
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="
                  h-8 w-8
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

            {/* CONTENT */}

            <div>
              <h1
                className="
                  text-3xl
                  font-bold
                  text-[#0f172a]
                "
              >
                Communications
              </h1>

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
                communication
                templates, automation
                flow, dynamic variables,
                and CRM messaging
                workflow.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* MAIN GRID */}
        {/* ========================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-12
          "
        >
          {/* ====================================== */}
          {/* LEFT PANEL */}
          {/* ====================================== */}

          <div className="xl:col-span-2">
            <div className="sticky top-6">
              <WATemplateGroupPanel
                selectedGroup={
                  selectedGroup
                }
                onSelectGroup={
                  (
                    group
                  ) => {
                    setSelectedGroup(
                      group
                    );

                    setSelectedTemplate(
                      null
                    );
                  }
                }
              />
            </div>
          </div>

          {/* ====================================== */}
          {/* CENTER */}
          {/* ====================================== */}

          <div
            className="
              space-y-6
              xl:col-span-7
            "
          >
            {/* TEMPLATE SELECTOR */}

            <WATemplateSelector
              selectedGroup={
                selectedGroup
              }
              selectedTemplate={
                selectedTemplate
              }
              onSelectTemplate={
                (
                  template
                ) =>
                  setSelectedTemplate(
                    template
                  )
              }
              onCreateNew={() =>
                setOpenModal(true)
              }
            />

            {/* WORKSPACE */}

            <WATemplateWorkspace
              template={
                selectedTemplate
              }
              onRefresh={() => {
                setSelectedTemplate(
                  null
                );
              }}
              onLiveChange={
                (
                  updatedTemplate
                ) => {
                  setEditingTemplate(
                    updatedTemplate
                  );
                }
              }
            />
          </div>

          {/* ====================================== */}
          {/* RIGHT PREVIEW */}
          {/* ====================================== */}

          <div className="xl:col-span-3">
            <div className="sticky top-6">
              <WATemplatePreview
                template={
                  editingTemplate
                }
              />
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* MODAL */}
        {/* ========================================== */}

        <WATemplateModal
          open={openModal}
          selectedGroup={
            selectedGroup
          }
          onClose={() =>
            setOpenModal(false)
          }
          onSuccess={() => {
            setOpenModal(false);
          }}
        />
      </div>
    </MainLayout>
  );
}