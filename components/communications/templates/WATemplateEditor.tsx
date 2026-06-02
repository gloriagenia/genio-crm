"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import clsx from "clsx";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// ======================================================
// TYPES
// ======================================================

type Variable = {
  id: number;

  variable_key: string;

  variable_label?: string;

  sample_value?: string;
};

type Template = {
  id: number;

  title: string;

  category: string;

  contact_type?: string;

  source_module?: string;

  pipeline_stage?: string;

  message: string;

  is_active?: boolean;
};

type Props = {
  template: Template | null;

  onUpdated?: () => void;

  onLiveChange?: (
    template: Template
  ) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateEditor({
  template,
  onUpdated,
  onLiveChange,
}: Props) {
  // ======================================================
  // REFS
  // ======================================================

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  // ======================================================
  // STATES
  // ======================================================

  const [loadingVariables, setLoadingVariables] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [isDirty, setIsDirty] =
    useState(false);

  const [variables, setVariables] =
    useState<Variable[]>([]);

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
    if (!template) return;

    setTitle(template.title || "");

    setCategory(
      template.category || ""
    );

    setContactType(
      template.contact_type || ""
    );

    setSourceModule(
      template.source_module || ""
    );

    setPipelineStage(
      template.pipeline_stage || ""
    );

    setMessage(
      template.message || ""
    );

    setIsActive(
      template.is_active ?? true
    );

    setIsDirty(false);

    fetchVariables();
  }, [template]);

  // ======================================================
  // LIVE CHANGE
  // ======================================================

  useEffect(() => {
    if (!template) return;

    onLiveChange?.({
      ...template,

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
    });
  }, [
    title,
    category,
    contactType,
    sourceModule,
    pipelineStage,
    message,
    isActive,
  ]);

  // ======================================================
  // AUTO RESIZE
  // ======================================================

  useEffect(() => {
    if (!textareaRef.current)
      return;

    textareaRef.current.style.height =
      "auto";

    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [message]);

  // ======================================================
  // FETCH VARIABLES
  // ======================================================

  async function fetchVariables() {
    if (!template?.id) return;

    try {
      setLoadingVariables(true);

      const { data, error } =
        await supabase
          .from(
            "wa_template_variables"
          )
          .select("*")
          .eq(
            "template_id",
            template.id
          )
          .order("id", {
            ascending: true,
          });

      if (error) {

        alert(JSON.stringify(error, null, 2));
        console.error(error);
        /*
        console.log("SAVE ERROR:", error);
        console.log("MESSAGE:", error.message);
        console.log("DETAILS:", error.details);
        console.log("HINT:", error.hint); 
        */
        return;
      }

      setVariables(
        (data ||
          []) as Variable[]
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingVariables(false);
    }
  }

  // ======================================================
  // INSERT VARIABLE
  // ======================================================

  function insertVariable(
    variable: string
  ) {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const variableText = `{{${variable}}}`;

    const newValue =
      message.substring(
        0,
        start
      ) +
      variableText +
      message.substring(end);

    setMessage(newValue);

    setIsDirty(true);

    setTimeout(() => {
      textarea.focus();

      textarea.selectionStart =
        start +
        variableText.length;

      textarea.selectionEnd =
        start +
        variableText.length;
    }, 0);
  }

  // ======================================================
  // SAVE
  // ======================================================

  async function handleSave() {
    if (!template?.id) return;

    if (!title || !message) {
      return;
    }

    try {
      setSaving(true);

      const { error } =
        await supabase
          .from("wa_templates")
          .update({
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

            updated_at:
              new Date(),
          })
          .eq(
            "id",
            template.id
          );

      if (error) {
        console.error(error);
        return;
      }

      setSaved(true);

      setIsDirty(false);

      onUpdated?.();

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  // ======================================================
  // SHORTCUT SAVE
  // ======================================================

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key === "s"
      ) {
        event.preventDefault();

        handleSave();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    title,
    category,
    contactType,
    sourceModule,
    pipelineStage,
    message,
    isActive,
  ]);

  // ======================================================
  // CHARACTER COUNT
  // ======================================================

  const characterCount =
    useMemo(() => {
      return message.length;
    }, [message]);

  // ======================================================
  // EMPTY
  // ======================================================

  if (!template) {
    return (
      <div
        className="
          rounded-3xl
          border border-dashed
          border-gray-200
          bg-white
          p-10
        "
      >
        <div className="text-center">
          <h2
            className="
              text-xl
              font-bold
              text-[#0f172a]
            "
          >
            Select Template
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            Choose template to edit
            WhatsApp message
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
      {/* HEADER */}
      {/* ============================================== */}

      <div
        className="
          sticky top-0 z-20
          rounded-3xl
          border border-gray-200
          bg-white/90
          p-6
          backdrop-blur
        "
      >
        <div className="flex items-start justify-between gap-5">
          {/* LEFT */}

          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-[#0f172a]
              "
            >
              Template Editor
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Edit WhatsApp template
              and communication flow
            </p>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3">
            {/* STATUS */}

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
                <Loader2
                  size={15}
                  className="
                    animate-spin
                  "
                />

                Saving...
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
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  border border-[#fedf89]
                  bg-[#fffaeb]
                  px-4 py-2
                  text-sm
                  font-medium
                  text-[#b54708]
                "
              >
                <AlertCircle
                  size={15}
                />

                Unsaved Changes
              </div>
            ) : null}

            {/* SAVE */}

            <button
              onClick={handleSave}
              disabled={
                saving ||
                !title ||
                !message
              }
              className="
                inline-flex
                h-12
                items-center
                gap-2
                rounded-2xl
                bg-[#0f172a]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
                disabled:opacity-50
              "
            >
              {saving ? (
                <Loader2
                  size={16}
                  className="
                    animate-spin
                  "
                />
              ) : (
                <Save size={16} />
              )}

              Save Template
            </button>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* TEMPLATE INFO */}
      {/* ============================================== */}

      <div
        className="
          rounded-3xl
          border border-gray-200
          bg-white
          p-6
        "
      >
        <h3
          className="
            text-lg
            font-semibold
            text-[#0f172a]
          "
        >
          Template Information
        </h3>

        <div
          className="
            mt-6
            grid grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          {/* TITLE */}

          <div className="md:col-span-2">
            <label
              className="
                mb-2 block
                text-sm
                font-medium
                text-[#0f172a]
              "
            >
              Template Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(
                  e.target.value
                );

                setIsDirty(true);
              }}
              placeholder="Input template title"
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
                text-sm
                font-medium
                text-[#0f172a]
              "
            >
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(
                  e.target.value
                );

                setIsDirty(true);
              }}
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
                text-sm
                font-medium
                text-[#0f172a]
              "
            >
              Contact Type
            </label>

            <input
              type="text"
              value={contactType}
              onChange={(e) => {
                setContactType(
                  e.target.value
                );

                setIsDirty(true);
              }}
              placeholder="Example: Buyer"
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

          {/* MODULE */}

          <div>
            <label
              className="
                mb-2 block
                text-sm
                font-medium
                text-[#0f172a]
              "
            >
              Source Module
            </label>

            <input
              type="text"
              value={sourceModule}
              onChange={(e) => {
                setSourceModule(
                  e.target.value
                );

                setIsDirty(true);
              }}
              placeholder="Example: leads"
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

          {/* PIPELINE */}

          <div>
            <label
              className="
                mb-2 block
                text-sm
                font-medium
                text-[#0f172a]
              "
            >
              Pipeline Stage
            </label>

            <input
              type="text"
              value={pipelineStage}
              onChange={(e) => {
                setPipelineStage(
                  e.target.value
                );

                setIsDirty(true);
              }}
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
        </div>
      </div>

      {/* ============================================== */}
      {/* MESSAGE + VARIABLES */}
      {/* ============================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-12
        "
      >
        {/* MESSAGE */}

        <div className="xl:col-span-8">
          <div
            className="
              rounded-3xl
              border border-gray-200
              bg-white
              p-6
            "
          >
            <div className="flex items-center justify-between">
              <h3
                className="
                  text-lg
                  font-semibold
                  text-[#0f172a]
                "
              >
                Message Template
              </h3>

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                {characterCount} characters
              </p>
            </div>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(
                  e.target.value
                );

                setIsDirty(true);
              }}
              placeholder="Input WhatsApp template..."
              className="
                mt-5
                min-h-[420px]
                w-full
                resize-none
                rounded-3xl
                border border-gray-200
                px-5 py-5
                text-sm
                leading-7
                tracking-[0.01em]
                outline-none
                transition
                focus:border-[#7f56d9]
              "
            />

            <div
              className="
                mt-4
                flex items-center
                justify-between
              "
            >
              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Press CTRL + S to
                save
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsActive(
                    !isActive
                  );

                  setIsDirty(true);
                }}
                className={clsx(
                  `
                  rounded-2xl
                  px-4 py-2
                  text-xs
                  font-semibold
                  transition
                `,
                  isActive
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
                {isActive
                  ? "Active"
                  : "Inactive"}
              </button>
            </div>
          </div>
        </div>

        {/* VARIABLES */}

        <div className="xl:col-span-4">
          <div
            className="
              sticky top-28
              rounded-3xl
              border border-gray-200
              bg-[#fcfcfd]
              p-5
            "
          >
            {/* HEADER */}

            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className="
                  text-[#7f56d9]
                "
              />

              <h3
                className="
                  text-sm
                  font-semibold
                  text-[#0f172a]
                "
              >
                Available Variables
              </h3>
            </div>

            {/* LOADING */}

            {loadingVariables && (
              <p
                className="
                  mt-5
                  text-sm
                  text-gray-400
                "
              >
                Loading variables...
              </p>
            )}

            {/* EMPTY */}

            {!loadingVariables &&
              variables.length ===
                0 && (
                <p
                  className="
                    mt-5
                    text-sm
                    text-gray-400
                  "
                >
                  No variables found
                </p>
              )}

            {/* VARIABLE LIST */}

            <div className="mt-5 flex flex-wrap gap-2">
              {variables.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      insertVariable(
                        item.variable_key
                      )
                    }
                    className="
                      rounded-2xl
                      border border-[#d6bbfb]
                      bg-white
                      px-3 py-2
                      text-xs
                      font-medium
                      text-[#7f56d9]
                      transition
                      hover:bg-[#f9f5ff]
                    "
                  >
                    {"{{"}
                    {
                      item.variable_key
                    }
                    {"}}"}
                  </button>
                )
              )}
            </div>

            {/* INFO */}

            <div
              className="
                mt-6
                rounded-2xl
                border border-[#e9d7fe]
                bg-[#f9f5ff]
                px-4 py-4
              "
            >
              <p
                className="
                  text-xs
                  leading-6
                  text-[#6941c6]
                "
              >
                Click variable to
                insert into message
                template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}