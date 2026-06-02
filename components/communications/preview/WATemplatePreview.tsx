"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import clsx from "clsx";

import {
  Smartphone,
  Send,
  Copy,
  Check,
  Eye,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// ======================================================
// TYPES
// ======================================================

type Variable = {
  id: number;

  variable_key: string;

  variable_label: string;

  sample_value?: string;
};

type Props = {
  template: any;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplatePreview({
  template,
}: Props) {
  // ======================================================
  // STATES
  // ======================================================

  const [variables, setVariables] =
    useState<Variable[]>([]);

  const [testNumber, setTestNumber] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  // ======================================================
  // FETCH VARIABLES
  // ======================================================

  async function fetchVariables() {
    if (!template?.id) {
      setVariables([]);
      return;
    }

    try {
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
        console.error(error);
        return;
      }

      setVariables(
        (data ||
          []) as Variable[]
      );
    } catch (error) {
      console.error(error);
    }
  }

  // ======================================================
  // INIT
  // ======================================================

  useEffect(() => {
    fetchVariables();
  }, [template]);

  // ======================================================
  // PARSED MESSAGE
  // ======================================================

  const parsedMessage =
    useMemo(() => {
      if (!template?.message)
        return "";

      let finalMessage =
        template.message;

      variables.forEach(
        (variable) => {
          const regex =
            new RegExp(
              `{{${variable.variable_key}}}`,
              "g"
            );

          finalMessage =
            finalMessage.replace(
              regex,
              variable.sample_value ||
                variable.variable_label ||
                variable.variable_key
            );
        }
      );

      return finalMessage;
    }, [template, variables]);

  // ======================================================
  // CHARACTER COUNT
  // ======================================================

  const characterCount =
    useMemo(() => {
      return parsedMessage.length;
    }, [parsedMessage]);

  // ======================================================
  // COPY MESSAGE
  // ======================================================

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        parsedMessage
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  // ======================================================
  // TEST SEND
  // ======================================================

  function handleTestSend() {
    if (!testNumber) return;

    const cleanNumber =
      testNumber.replace(
        /\D/g,
        ""
      );

    const encodedMessage =
      encodeURIComponent(
        parsedMessage
      );

    window.open(
      `https://wa.me/${cleanNumber}?text=${encodedMessage}`,
      "_blank"
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
        <div className="text-center">
          <div
            className="
              mx-auto
              flex h-16 w-16
              items-center
              justify-center
              rounded-3xl
              bg-[#f4ebff]
            "
          >
            <Eye
              size={28}
              className="
                text-[#7f56d9]
              "
            />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-bold
              text-[#0f172a]
            "
          >
            WhatsApp Preview
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-7
              text-gray-500
            "
          >
            Select template to
            preview WhatsApp
            message appearance
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-5">
      {/* ============================================== */}
      {/* HEADER */}
      {/* ============================================== */}

      <div
        className="
          rounded-3xl
          border border-gray-200
          bg-white
          p-5
        "
      >
        <div className="flex items-start gap-3">
          {/* ICON */}

          <div
            className="
              flex h-12 w-12
              items-center
              justify-center
              rounded-2xl
              bg-[#ecfdf3]
              text-[#16a34a]
            "
          >
            <Smartphone
              size={22}
            />
          </div>

          {/* CONTENT */}

          <div>
            <h2
              className="
                text-lg
                font-bold
                text-[#0f172a]
              "
            >
              WhatsApp Preview
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Live template preview
            </p>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* PHONE */}
      {/* ============================================== */}

      <div
        className="
          overflow-hidden
          rounded-[42px]
          border-[10px]
          border-[#111827]
          bg-[#efeae2]
          shadow-xl
        "
      >
        {/* TOP BAR */}

        <div
          className="
            flex
            items-center
            justify-between
            bg-[#075e54]
            px-4 py-3
            text-white
          "
        >
          <div className="flex items-center gap-3">
            {/* AVATAR */}

            <div
              className="
                flex
                h-10 w-10
                items-center
                justify-center
                rounded-full
                bg-white/20
                text-sm
                font-bold
              "
            >
              PA
            </div>

            {/* USER */}

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                "
              >
                Gloria
              </p>

              <p
                className="
                  text-[11px]
                  text-white/70
                "
              >
                online
              </p>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}

        <div
          className="
            min-h-[520px]
            bg-[#efeae2]
            bg-cover
            bg-center
            p-4
          "
          style={{backgroundImage: "url('/images/wa-bg.png')",}}
        >
          <div
            className="
              ml-auto
              max-w-[90%]
              rounded-2xl
              rounded-tr-sm
              bg-[#dcf8c6]
              px-4 py-3
              shadow-sm
            "
          >
            {/* MESSAGE */}

            <p
              className="
                whitespace-pre-line
                text-sm
                leading-7
                text-[#0f172a]
              "
            >
              {parsedMessage}
            </p>

            {/* TIME */}

            <div className="mt-2 text-right">
              <span
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                09:41
              </span>
            </div>
          </div>
        </div>

        {/* INPUT BAR */}

        <div
          className="
            border-t
            border-gray-200
            bg-white
            p-3
          "
        >
          {/* TEST NUMBER */}

          <input
            type="text"
            value={testNumber}
            onChange={(e) =>
              setTestNumber(
                e.target.value
              )
            }
            placeholder="Input test WhatsApp number"
            className="
              h-11
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

          {/* ACTIONS */}

          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* COPY */}

            <button
              onClick={handleCopy}
              className={clsx(
                `
                flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                text-sm
                font-medium
                transition
              `,
                copied
                  ? `
                    border-[#abefc6]
                    bg-[#ecfdf3]
                    text-[#027a48]
                  `
                  : `
                    border-gray-200
                    bg-white
                    text-[#0f172a]
                  `
              )}
            >
              {copied ? (
                <Check
                  size={16}
                />
              ) : (
                <Copy
                  size={16}
                />
              )}

              {copied
                ? "Copied"
                : "Copy"}
            </button>

            {/* TEST SEND */}

            <button
              onClick={
                handleTestSend
              }
              disabled={!testNumber}
              className="
                flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#25d366]
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
                disabled:opacity-50
              "
            >
              <Send size={16} />

              Test Send
            </button>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* META */}
      {/* ============================================== */}

      <div
        className="
          rounded-3xl
          border border-gray-200
          bg-white
          p-5
        "
      >
        {/* TOP */}

        <div className="flex items-center justify-between">
          <h3
            className="
              text-sm
              font-semibold
              text-[#0f172a]
            "
          >
            Preview Information
          </h3>

          <div
            className="
              rounded-xl
              bg-gray-100
              px-3 py-1
              text-xs
              font-medium
              text-gray-600
            "
          >
            {characterCount} chars
          </div>
        </div>

        {/* VARIABLES */}

        <div className="mt-5">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-gray-400
            "
          >
            Variables
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {variables.length ===
            0 ? (
              <div
                className="
                  rounded-2xl
                  border border-dashed
                  border-gray-200
                  px-4 py-3
                  text-xs
                  text-gray-400
                "
              >
                No variables
              </div>
            ) : (
              variables.map(
                (item) => (
                  <div
                    key={item.id}
                    className="
                      rounded-2xl
                      border border-[#d6bbfb]
                      bg-[#f9f5ff]
                      px-3 py-2
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-[#7f56d9]
                      "
                    >
                      {"{{"}
                      {
                        item.variable_key
                      }
                      {"}}"}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        text-[#6941c6]
                      "
                    >
                      {item.sample_value ||
                        item.variable_label}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* TEMPLATE INFO */}

        <div
          className="
            mt-6
            border-t
            border-gray-100
            pt-5
          "
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Category
              </p>

              <p
                className="
                  text-xs
                  font-medium
                  text-[#0f172a]
                "
              >
                {
                  template.category
                }
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Contact Type
              </p>

              <p
                className="
                  text-xs
                  font-medium
                  text-[#0f172a]
                "
              >
                {template.contact_type ||
                  "-"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Pipeline Stage
              </p>

              <p
                className="
                  text-xs
                  font-medium
                  text-[#0f172a]
                "
              >
                {template.pipeline_stage ||
                  "-"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Status
              </p>

              <div
                className={clsx(
                  `
                  rounded-xl
                  px-2.5 py-1
                  text-[10px]
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
          </div>
        </div>
      </div>
    </div>
  );
}