"use client";

import {
  useEffect,
  useState,
} from "react";

import clsx from "clsx";

import {
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// ======================================================
// TYPES
// ======================================================

type Props = {
  open: boolean;

  onClose: () => void;

  selectedGroup?: string;

  onSuccess?: () => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateModal({
  open,
  onClose,
  selectedGroup,
  onSuccess,
}: Props) {
  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    contactType,
    setContactType,
  ] = useState("");

  const [
    sourceModule,
    setSourceModule,
  ] = useState("");

  const [
    pipelineStage,
    setPipelineStage,
  ] = useState("");

  const [message, setMessage] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  // ======================================================
  // INIT
  // ======================================================

  useEffect(() => {
    if (!open) return;

    setCategory(
      selectedGroup || ""
    );
  }, [open, selectedGroup]);

  // ======================================================
  // RESET
  // ======================================================

  function resetForm() {
    setTitle("");

    setCategory("");

    setContactType("");

    setSourceModule("");

    setPipelineStage("");

    setMessage("");

    setIsActive(true);
  }

  // ======================================================
  // CLOSE
  // ======================================================

  function handleClose() {
    resetForm();

    onClose();
  }

  // ======================================================
  // SUBMIT
  // ======================================================

  async function handleSubmit() {
    if (
      !title ||
      !category ||
      !message
    ) {
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase
          .from("wa_templates")
          .insert([
            {
              title,

              category,

              contact_type:
                contactType,

              source_module:
                sourceModule,

              pipeline_stage:
                pipelineStage,

              message,

              is_active:
                isActive,

              created_at:
                new Date(),

              updated_at:
                new Date(),
            },
          ]);

      if (error) {
        console.error(
          "Create template error:",
          error
        );

        return;
      }

      resetForm();

      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // HIDE
  // ======================================================

  if (!open) return null;

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      className="
        fixed inset-0
        z-[999]
        flex items-center
        justify-center
        bg-black/40
        p-5
        backdrop-blur-sm
      "
    >
      {/* ============================================== */}
      {/* MODAL */}
      {/* ============================================== */}

      <div
        className="
          w-full
          max-w-3xl
          rounded-[32px]
          bg-white
          shadow-2xl
        "
      >
        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div
          className="
            flex items-start
            justify-between
            border-b
            border-gray-100
            p-6
          "
        >
          {/* LEFT */}

          <div className="flex gap-4">
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
              <Plus size={24} />
            </div>

            {/* CONTENT */}

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#0f172a]
                "
              >
                Create Template
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Create new WhatsApp
                communication template
              </p>
            </div>
          </div>

          {/* CLOSE */}

          <button
            onClick={handleClose}
            className="
              flex h-11 w-11
              items-center
              justify-center
              rounded-2xl
              border border-gray-200
              text-gray-500
              transition
              hover:bg-gray-50
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* ========================================== */}
        {/* BODY */}
        {/* ========================================== */}

        <div
          className="
            max-h-[80vh]
            overflow-y-auto
            p-6
          "
        >
          {/* ====================================== */}
          {/* FORM */}
          {/* ====================================== */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* TITLE */}

            <div className="md:col-span-2">
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-[#0f172a]
                "
              >
                Template Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Example: Follow Up Buyer Warm"
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border border-gray-200
                  px-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#7f56d9]
                "
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-[#0f172a]
                "
              >
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                placeholder="Example: Buyer Follow Up"
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border border-gray-200
                  px-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#7f56d9]
                "
              />
            </div>

            {/* CONTACT TYPE */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-[#0f172a]
                "
              >
                Contact Type
              </label>

              <select
                value={contactType}
                onChange={(e) =>
                  setContactType(
                    e.target.value
                  )
                }
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border border-gray-200
                  px-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#7f56d9]
                "
              >
                <option value="">
                  Select contact type
                </option>

                <option value="Buyer">
                  Buyer
                </option>

                <option value="Owner">
                  Owner
                </option>

                <option value="Renter">
                  Renter
                </option>

                <option value="Agent">
                  Agent
                </option>

                <option value="Vendor">
                  Vendor
                </option>
              </select>
            </div>

            {/* SOURCE MODULE */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-[#0f172a]
                "
              >
                Source Module
              </label>

              <select
                value={sourceModule}
                onChange={(e) =>
                  setSourceModule(
                    e.target.value
                  )
                }
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border border-gray-200
                  px-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#7f56d9]
                "
              >
                <option value="">
                  Select module
                </option>

                <option value="contacts">
                  Contacts
                </option>

                <option value="leads">
                  Leads
                </option>

                <option value="inquiries">
                  Inquiries
                </option>

                <option value="properties">
                  Properties
                </option>

                <option value="canvassing">
                  Canvassing
                </option>
              </select>
            </div>

            {/* PIPELINE */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-[#0f172a]
                "
              >
                Pipeline Stage
              </label>

              <input
                type="text"
                value={pipelineStage}
                onChange={(e) =>
                  setPipelineStage(
                    e.target.value
                  )
                }
                placeholder="Example: Warm"
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border border-gray-200
                  px-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#7f56d9]
                "
              />
            </div>

            {/* STATUS */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-[#0f172a]
                "
              >
                Status
              </label>

              <button
                type="button"
                onClick={() =>
                  setIsActive(
                    !isActive
                  )
                }
                className={clsx(
                  `
                  h-12
                  w-full
                  rounded-2xl
                  border
                  text-sm
                  font-medium
                  transition
                `,
                  isActive
                    ? `
                      border-[#abefc6]
                      bg-[#ecfdf3]
                      text-[#027a48]
                    `
                    : `
                      border-gray-200
                      bg-gray-50
                      text-gray-500
                    `
                )}
              >
                {isActive
                  ? "Active"
                  : "Inactive"}
              </button>
            </div>

            {/* MESSAGE */}

            <div className="md:col-span-2">
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-[#0f172a]
                "
              >
                Message Template
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder={`Hallo Bapak/Ibu,

Saya Gloria 😊

Saya melihat nomor Bapak/Ibu tertera di banner properti di {{location}}.

Apakah benar saya sedang menghubungi pemilik properti tersebut?`}
                rows={12}
                className="
                  w-full
                  rounded-3xl
                  border border-gray-200
                  px-5 py-5
                  text-sm
                  leading-7
                  outline-none
                  transition
                  focus:border-[#7f56d9]
                "
              />
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* FOOTER */}
        {/* ========================================== */}

        <div
          className="
            flex items-center
            justify-between
            border-t
            border-gray-100
            p-6
          "
        >
          {/* LEFT */}

          <p
            className="
              text-xs
              text-gray-400
            "
          >
            WhatsApp template will
            be saved into database
          </p>

          {/* RIGHT */}

          <div className="flex gap-3">
            {/* CANCEL */}

            <button
              onClick={handleClose}
              className="
                h-12
                rounded-2xl
                border border-gray-200
                px-5
                text-sm
                font-medium
                text-gray-600
                transition
                hover:bg-gray-50
              "
            >
              Cancel
            </button>

            {/* SUBMIT */}

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !title ||
                !category ||
                !message
              }
              className="
                inline-flex
                h-12
                items-center
                gap-2
                rounded-2xl
                bg-[#7f56d9]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="
                      animate-spin
                    "
                  />

                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />

                  Create Template
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}