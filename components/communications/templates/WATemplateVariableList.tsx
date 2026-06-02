"use client";

import clsx from "clsx";

import {
  Copy,
  Sparkles,
} from "lucide-react";

// ======================================================
// TYPES
// ======================================================

export type WATemplateVariable = {
  id: number;

  variable_key: string;

  variable_label?: string;

  sample_value?: string;

  description?: string;
};

type Props = {
  variables: WATemplateVariable[];

  loading?: boolean;

  onInsertVariable?: (
    variable: string
  ) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateVariableList({
  variables,

  loading = false,

  onInsertVariable,
}: Props) {
  // ======================================================
  // COPY VARIABLE
  // ======================================================

  async function copyVariable(
    variable: string
  ) {
    try {
      await navigator.clipboard.writeText(
        `{{${variable}}}`
      );
    } catch (error) {
      console.error(error);
    }
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      className="
        rounded-3xl
        border border-gray-200
        bg-[#fcfcfd]
        p-5
      "
    >
      {/* ============================================== */}
      {/* HEADER */}
      {/* ============================================== */}

      <div className="flex items-start gap-3">
        {/* ICON */}

        <div
          className="
            flex h-12 w-12
            items-center
            justify-center
            rounded-2xl
            bg-[#f4ebff]
            text-[#7f56d9]
          "
        >
          <Sparkles
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
            Template Variables
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Dynamic placeholders for
            WhatsApp templates
          </p>
        </div>
      </div>

      {/* ============================================== */}
      {/* LOADING */}
      {/* ============================================== */}

      {loading && (
        <div className="mt-6">
          <p
            className="
              text-sm
              text-gray-400
            "
          >
            Loading variables...
          </p>
        </div>
      )}

      {/* ============================================== */}
      {/* EMPTY */}
      {/* ============================================== */}

      {!loading &&
        variables.length ===
          0 && (
          <div
            className="
              mt-6
              rounded-2xl
              border border-dashed
              border-gray-200
              bg-white
              p-8
              text-center
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-[#0f172a]
              "
            >
              No variables found
            </p>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              Create variable for this
              template
            </p>
          </div>
        )}

      {/* ============================================== */}
      {/* VARIABLE LIST */}
      {/* ============================================== */}

      <div className="mt-6 space-y-3">
        {!loading &&
          variables.map(
            (variable) => (
              <div
                key={variable.id}
                className="
                  rounded-2xl
                  border border-gray-200
                  bg-white
                  p-4
                  transition
                  hover:border-[#d6bbfb]
                "
              >
                {/* TOP */}

                <div className="flex items-start justify-between gap-3">
                  {/* LEFT */}

                  <div className="min-w-0">
                    {/* VARIABLE */}

                    <div
                      className="
                        inline-flex
                        items-center
                        rounded-2xl
                        bg-[#f4ebff]
                        px-3 py-2
                        text-xs
                        font-semibold
                        text-[#7f56d9]
                      "
                    >
                      {"{{"}
                      {
                        variable.variable_key
                      }
                      {"}}"}
                    </div>

                    {/* LABEL */}

                    {variable.variable_label && (
                      <p
                        className="
                          mt-3
                          text-sm
                          font-semibold
                          text-[#0f172a]
                        "
                      >
                        {
                          variable.variable_label
                        }
                      </p>
                    )}

                    {/* DESCRIPTION */}

                    {variable.description && (
                      <p
                        className="
                          mt-1
                          text-xs
                          leading-6
                          text-gray-500
                        "
                      >
                        {
                          variable.description
                        }
                      </p>
                    )}

                    {/* SAMPLE */}

                    {variable.sample_value && (
                      <div className="mt-3">
                        <p
                          className="
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-400
                          "
                        >
                          Sample Value
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-[#6941c6]
                          "
                        >
                          {
                            variable.sample_value
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2">
                    {/* COPY */}

                    <button
                      type="button"
                      onClick={() =>
                        copyVariable(
                          variable.variable_key
                        )
                      }
                      className="
                        flex h-10 w-10
                        items-center
                        justify-center
                        rounded-2xl
                        border border-gray-200
                        text-gray-500
                        transition
                        hover:border-[#d6bbfb]
                        hover:bg-[#f9f5ff]
                        hover:text-[#7f56d9]
                      "
                    >
                      <Copy
                        size={15}
                      />
                    </button>

                    {/* INSERT */}

                    <button
                      type="button"
                      onClick={() =>
                        onInsertVariable?.(
                          variable.variable_key
                        )
                      }
                      className={clsx(
                        `
                        rounded-2xl
                        px-4 py-2
                        text-xs
                        font-semibold
                        transition
                      `,
                        onInsertVariable
                          ? `
                            bg-[#7f56d9]
                            text-white
                            hover:opacity-90
                          `
                          : `
                            cursor-not-allowed
                            bg-gray-100
                            text-gray-400
                          `
                      )}
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
      </div>

      {/* ============================================== */}
      {/* INFO */}
      {/* ============================================== */}

      {variables.length > 0 && (
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
            Variables will automatically
            replace dynamic values such
            as contact name, property
            location, price, and inquiry
            information during WhatsApp
            message generation.
          </p>
        </div>
      )}
    </div>
  );
}