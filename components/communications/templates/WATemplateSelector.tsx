"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import clsx from "clsx";

import {
  Loader2,
  MessageSquare,
  Plus,
  Search,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import WATemplateCard from "@/components/communications/cards/WATemplateCard";

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

type Props = {
  selectedGroup: string;

  selectedTemplate:
    | WATemplate
    | null;

  onSelectTemplate: (
    template: WATemplate
  ) => void;

  onCreateNew?: () => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateSelector({
  selectedGroup,

  selectedTemplate,

  onSelectTemplate,

  onCreateNew,
}: Props) {
  // ======================================================
  // STATES
  // ======================================================

  const [templates, setTemplates] =
    useState<WATemplate[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // ======================================================
  // FETCH TEMPLATES
  // ======================================================

  async function fetchTemplates() {
    try {
      setLoading(true);

      // EMPTY GROUP

      if (!selectedGroup) {
        setTemplates([]);
        return;
      }

      // QUERY

      const { data, error } =
        await supabase
          .from("wa_templates")
          .select("*")
          .ilike(
            "category",
            selectedGroup
          )
          .order("id", {
            ascending: true,
          });

      // ERROR

      if (error) {
        console.error(
          "Fetch templates error:",
          error
        );

        alert(
          JSON.stringify(
            error,
            null,
            2
          )
        );

        return;
      }

      // SUCCESS

      const finalData =
        (data as WATemplate[]) ||
        [];

      setTemplates(finalData);

      // AUTO SELECT FIRST

      if (
        finalData.length > 0 &&
        !selectedTemplate
      ) {
        onSelectTemplate(
          finalData[0]
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // INIT
  // ======================================================

  useEffect(() => {
    fetchTemplates();
  }, [selectedGroup]);

  // ======================================================
  // FILTERED
  // ======================================================

  const filteredTemplates =
    useMemo(() => {
      if (!search)
        return templates;

      return templates.filter(
        (item) => {
          const keyword =
            search.toLowerCase();

          return (
            item.title
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            item.message
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            item.contact_type
              ?.toLowerCase()
              .includes(
                keyword
              )
          );
        }
      );
    }, [templates, search]);

  // ======================================================
  // EMPTY GROUP
  // ======================================================

  if (!selectedGroup) {
    return (
      <div
        className="
          rounded-3xl
          border border-gray-200
          bg-white
          p-10
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
              text-[#7f56d9]
            "
          >
            <MessageSquare
              size={28}
            />
          </div>

          <h2
            className="
              mt-5
              text-2xl
              font-bold
              text-[#0f172a]
            "
          >
            Select Template Group
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            Choose WhatsApp
            template category from
            left panel
          </p>
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
      {/* ============================================== */}
      {/* HEADER */}
      {/* ============================================== */}

      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}

        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-[#0f172a]
            "
          >
            {selectedGroup}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            {
              filteredTemplates.length
            }{" "}
            templates available
          </p>
        </div>

        {/* RIGHT */}

        <button
          type="button"
          onClick={onCreateNew}
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-2xl
            bg-[#7f56d9]
            px-4
            text-sm
            font-semibold
            text-white
            transition
            hover:opacity-90
          "
        >
          <Plus size={16} />

          New Template
        </button>
      </div>

      {/* ============================================== */}
      {/* SEARCH */}
      {/* ============================================== */}

      <div className="relative mt-6">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search templates..."
          className="
            h-12
            w-full
            rounded-2xl
            border border-gray-200
            bg-white
            pl-11
            pr-4
            text-sm
            outline-none
            transition
            focus:border-[#7f56d9]
          "
        />
      </div>

      {/* ============================================== */}
      {/* LOADING */}
      {/* ============================================== */}

      {loading && (
        <div
          className="
            flex
            items-center
            justify-center
            py-20
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-gray-500
            "
          >
            <Loader2
              size={18}
              className="
                animate-spin
              "
            />

            Loading templates...
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* TEMPLATE LIST */}
      {/* ============================================== */}

      {!loading && (
        <div className="mt-6 space-y-4">
          {filteredTemplates.map(
            (template) => (
              <WATemplateCard
                key={template.id}
                template={
                  template
                }
                selected={
                  selectedTemplate?.id ===
                  template.id
                }
                onClick={() =>
                  onSelectTemplate(
                    template
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* ============================================== */}
      {/* EMPTY */}
      {/* ============================================== */}

      {!loading &&
        filteredTemplates.length ===
          0 && (
          <div
            className="
              mt-6
              rounded-3xl
              border border-dashed
              border-gray-200
              p-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex h-16 w-16
                items-center
                justify-center
                rounded-3xl
                bg-gray-100
                text-gray-400
              "
            >
              <MessageSquare
                size={26}
              />
            </div>

            <h3
              className="
                mt-5
                text-lg
                font-bold
                text-[#0f172a]
              "
            >
              No Templates Found
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Create first template
              for this category
            </p>

            <button
              type="button"
              onClick={onCreateNew}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-[#7f56d9]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
              "
            >
              <Plus size={16} />

              Create Template
            </button>
          </div>
        )}
    </div>
  );
}