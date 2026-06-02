"use client";

import { useEffect, useState } from "react";

import clsx from "clsx";

import {
  Zap,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Props = {
  template: any;

  onUpdated?: () => void;
};

export default function WATriggerRulesSection({
  template,
  onUpdated,
}: Props) {
  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    sourceModule,
    setSourceModule,
  ] = useState("");

  const [
    contactType,
    setContactType,
  ] = useState("");

  const [
    pipelineStage,
    setPipelineStage,
  ] = useState("");

  const [
    timingTrigger,
    setTimingTrigger,
  ] = useState("");

  const [isActive, setIsActive] =
    useState(true);

  // ======================================================
  // INIT
  // ======================================================

  useEffect(() => {
    if (!template) return;

    setSourceModule(
      template.source_module || ""
    );

    setContactType(
      template.contact_type || ""
    );

    setPipelineStage(
      template.pipeline_stage || ""
    );

    setTimingTrigger(
      template.timing_trigger || ""
    );

    setIsActive(
      template.is_active ?? true
    );
  }, [template]);

  // ======================================================
  // SAVE
  // ======================================================

  async function handleSave() {
    if (!template?.id) return;

    try {
      setSaving(true);

      const { error } =
        await supabase
          .from("wa_templates")
          .update({
            source_module:
              sourceModule,

            contact_type:
              contactType,

            pipeline_stage:
              pipelineStage,

            timing_trigger:
              timingTrigger,

            is_active:
              isActive,

            updated_at:
              new Date(),
          })
          .eq(
            "id",
            template.id
          );

      if (error) {
        console.error(error);

        alert(
          "Failed to update trigger rules"
        );

        return;
      }

      alert(
        "Trigger rules updated successfully"
      );

      onUpdated?.();
    } catch (error) {
      console.error(error);

      alert("Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  // ======================================================
  // EMPTY
  // ======================================================

  if (!template) {
    return (
      <div
        className="
          rounded-3xl border
          border-gray-200
          bg-white p-6
        "
      >
        <p className="text-sm text-gray-500">
          Select template to manage
          trigger rules
        </p>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      className="
        rounded-3xl border
        border-gray-200
        bg-white
      "
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex items-center
          justify-between
          border-b border-gray-100
          px-6 py-5
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-2xl
              bg-[#f4ebff]
              text-[#7f56d9]
            "
          >
            <Zap size={20} />
          </div>

          <div>
            <h2
              className="
                text-lg font-bold
                text-[#0f172a]
              "
            >
              Trigger Rules
            </h2>

            <p className="text-sm text-gray-500">
              Contextual automation
              rules
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div
          className={clsx(
            `
            inline-flex items-center
            gap-2 rounded-2xl
            border px-4 py-3
            text-sm font-medium
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
          <CheckCircle2
            size={16}
          />

          {isActive
            ? "Active"
            : "Inactive"}
        </div>
      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="p-6">
        <div className="grid grid-cols-2 gap-5">
          {/* ============================================= */}
          {/* SOURCE MODULE */}
          {/* ============================================= */}

          <div>
            <label
              className="
                mb-2 block text-sm
                font-medium
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
                h-12 w-full
                rounded-2xl border
                border-gray-200
                bg-white px-4
                text-sm outline-none
                transition
                focus:border-[#7f56d9]
              "
            >
              <option value="">
                Select source module
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

          {/* ============================================= */}
          {/* CONTACT TYPE */}
          {/* ============================================= */}

          <div>
            <label
              className="
                mb-2 block text-sm
                font-medium
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
                h-12 w-full
                rounded-2xl border
                border-gray-200
                bg-white px-4
                text-sm outline-none
                transition
                focus:border-[#7f56d9]
              "
            >
              <option value="">
                Select contact type
              </option>

              <option value="buyer">
                Buyer
              </option>

              <option value="owner">
                Owner
              </option>

              <option value="renter">
                Renter
              </option>

              <option value="vendor">
                Vendor
              </option>

              <option value="agent">
                Agent
              </option>
            </select>
          </div>

          {/* ============================================= */}
          {/* PIPELINE STAGE */}
          {/* ============================================= */}

          <div>
            <label
              className="
                mb-2 block text-sm
                font-medium
                text-[#0f172a]
              "
            >
              Pipeline Stage
            </label>

            <select
              value={pipelineStage}
              onChange={(e) =>
                setPipelineStage(
                  e.target.value
                )
              }
              className="
                h-12 w-full
                rounded-2xl border
                border-gray-200
                bg-white px-4
                text-sm outline-none
                transition
                focus:border-[#7f56d9]
              "
            >
              <option value="">
                Select pipeline stage
              </option>

              <option value="new">
                New
              </option>

              <option value="contacted">
                Contacted
              </option>

              <option value="viewing">
                Viewing
              </option>

              <option value="negotiation">
                Negotiation
              </option>

              <option value="closing">
                Closing
              </option>

              <option value="no_response">
                No Response
              </option>

              <option value="closed">
                Closed
              </option>
            </select>
          </div>

          {/* ============================================= */}
          {/* TIMING */}
          {/* ============================================= */}

          <div>
            <label
              className="
                mb-2 block text-sm
                font-medium
                text-[#0f172a]
              "
            >
              Timing Trigger
            </label>

            <select
              value={timingTrigger}
              onChange={(e) =>
                setTimingTrigger(
                  e.target.value
                )
              }
              className="
                h-12 w-full
                rounded-2xl border
                border-gray-200
                bg-white px-4
                text-sm outline-none
                transition
                focus:border-[#7f56d9]
              "
            >
              <option value="">
                Select timing trigger
              </option>

              <option value="instant">
                Instant
              </option>

              <option value="1_day">
                1 Day After
              </option>

              <option value="3_days">
                3 Days After
              </option>

              <option value="7_days">
                7 Days After
              </option>

              <option value="14_days">
                14 Days After
              </option>
            </select>
          </div>
        </div>

        {/* ================================================= */}
        {/* ACTIVE STATUS */}
        {/* ================================================= */}

        <div className="mt-6">
          <label
            className="
              mb-2 block text-sm
              font-medium
              text-[#0f172a]
            "
          >
            Template Status
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
              inline-flex h-12
              items-center gap-2
              rounded-2xl border
              px-5 text-sm
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
            <CheckCircle2
              size={16}
            />

            {isActive
              ? "Active"
              : "Inactive"}
          </button>
        </div>

        {/* ================================================= */}
        {/* INFO */}
        {/* ================================================= */}

        <div
          className="
            mt-6 rounded-2xl
            border border-[#e9d7fe]
            bg-[#f9f5ff]
            p-5
          "
        >
          <h3
            className="
              text-sm font-semibold
              text-[#6941c6]
            "
          >
            Trigger Logic
          </h3>

          <div
            className="
              mt-3 space-y-2
              text-xs leading-6
              text-[#6941c6]
            "
          >
            <p>
              • Template akan muncul
              berdasarkan source
              module
            </p>

            <p>
              • Pipeline stage digunakan
              untuk contextual follow up
            </p>

            <p>
              • Contact type membantu
              filtering template
            </p>

            <p>
              • Timing trigger digunakan
              untuk automation future
              feature
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* SAVE */}
        {/* ================================================= */}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="
              inline-flex h-12
              items-center gap-2
              rounded-2xl
              bg-[#7f56d9]
              px-5 text-sm
              font-semibold
              text-white
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={16} />

                Save Trigger Rules
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}