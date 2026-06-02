"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import clsx from "clsx";

import {
  ChevronRight,
  FolderKanban,
  Layers3,
  Search,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// ======================================================
// TYPES
// ======================================================

type CategoryItem = {
  category: string;
};

type Props = {
  selectedGroup: string;

  onSelectGroup: (
    group: string
  ) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function WATemplateGroupPanel({
  selectedGroup,
  onSelectGroup,
}: Props) {
  // ======================================================
  // STATES
  // ======================================================

  const [groups, setGroups] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [counts, setCounts] =
    useState<
      Record<string, number>
    >({});

  // ======================================================
  // FETCH GROUPS
  // ======================================================

  async function fetchGroups() {
    try {
      setLoading(true);

      const { data, error } =
        await supabase
          .from("wa_templates")
          .select("category");

      if (error) {
        console.error(
          "Fetch groups error:",
          error
        );

        return;
      }

      const finalData =
        (data ||
          []) as CategoryItem[];

      // ============================================
      // UNIQUE CATEGORY
      // ============================================

      const uniqueGroups = [
        ...new Set(
          finalData
            .map(
              (item) =>
                item.category
            )
            .filter(Boolean)
        ),
      ];

      setGroups(uniqueGroups);

      // ============================================
      // TEMPLATE COUNTS
      // ============================================

      const groupCounts: Record<
        string,
        number
      > = {};

      finalData.forEach(
        (item) => {
          if (
            !item.category
          )
            return;

          groupCounts[
            item.category
          ] =
            (groupCounts[
              item.category
            ] || 0) + 1;
        }
      );

      setCounts(groupCounts);

      // ============================================
      // AUTO SELECT FIRST
      // ============================================

      if (
        uniqueGroups.length >
          0 &&
        !selectedGroup
      ) {
        onSelectGroup(
          uniqueGroups[0]
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // INIT
  // ======================================================

  useEffect(() => {
    fetchGroups();
  }, []);

  // ======================================================
  // FILTERED GROUPS
  // ======================================================

  const filteredGroups =
    useMemo(() => {
      if (!search)
        return groups;

      const keyword =
        search.toLowerCase();

      return groups.filter(
        (group) =>
          group
            .toLowerCase()
            .includes(keyword)
      );
    }, [groups, search]);

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      className="
        rounded-3xl
        border border-gray-200
        bg-[#fafafa]
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
          <FolderKanban
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
            Template Groups
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Organize WhatsApp
            templates by category
          </p>
        </div>
      </div>

      {/* ============================================== */}
      {/* SEARCH */}
      {/* ============================================== */}

      <div className="relative mt-5">
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
          placeholder="Search group..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            h-11
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
      {/* TOTAL */}
      {/* ============================================== */}

      <div
        className="
          mt-5
          flex items-center
          justify-between
          rounded-2xl
          border border-gray-200
          bg-white
          px-4 py-3
        "
      >
        <div className="flex items-center gap-2">
          <Layers3
            size={16}
            className="
              text-[#7f56d9]
            "
          />

          <p
            className="
              text-sm
              font-medium
              text-[#0f172a]
            "
          >
            Total Groups
          </p>
        </div>

        <div
          className="
            rounded-xl
            bg-[#f4ebff]
            px-3 py-1
            text-xs
            font-semibold
            text-[#7f56d9]
          "
        >
          {groups.length}
        </div>
      </div>

      {/* ============================================== */}
      {/* LOADING */}
      {/* ============================================== */}

      {loading && (
        <div className="mt-5">
          <p
            className="
              text-sm
              text-gray-400
            "
          >
            Loading groups...
          </p>
        </div>
      )}

      {/* ============================================== */}
      {/* GROUP LIST */}
      {/* ============================================== */}

      <div
        className="
          mt-5
          max-h-[720px]
          space-y-2
          overflow-y-auto
          pr-1
        "
      >
        {!loading &&
          filteredGroups.map(
            (group) => {
              const isSelected =
                selectedGroup ===
                group;

              return (
                <button
                  key={group}
                  type="button"
                  onClick={() =>
                    onSelectGroup(
                      group
                    )
                  }
                  className={clsx(
                    `
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition
                    hover:shadow-sm
                  `,
                    isSelected
                      ? `
                        border-[#7f56d9]
                        bg-[#f9f5ff]
                        ring-2
                        ring-[#7f56d9]/20
                      `
                      : `
                        border-gray-200
                        bg-white
                        hover:border-[#d6bbfb]
                      `
                  )}
                >
                  {/* LEFT */}

                  <div className="flex items-center gap-3">
                    {/* ICON */}

                    <div
                      className={clsx(
                        `
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-2xl
                        transition
                      `,
                        isSelected
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
                      <FolderKanban
                        size={18}
                      />
                    </div>

                    {/* CONTENT */}

                    <div>
                      <p
                        className="
                          text-sm
                          font-semibold
                          text-[#0f172a]
                        "
                      >
                        {group}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                        "
                      >
                        {counts[
                          group
                        ] || 0}{" "}
                        templates
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="flex items-center gap-2">
                    {/* COUNT */}

                    <div
                      className={clsx(
                        `
                        rounded-xl
                        px-2.5 py-1
                        text-[11px]
                        font-semibold
                      `,
                        isSelected
                          ? `
                            bg-white
                            text-[#7f56d9]
                          `
                          : `
                            bg-gray-100
                            text-gray-600
                          `
                      )}
                    >
                      {counts[
                        group
                      ] || 0}
                    </div>

                    {/* ARROW */}

                    <ChevronRight
                      size={16}
                      className={clsx(
                        `
                        transition
                      `,
                        isSelected
                          ? `
                            text-[#7f56d9]
                          `
                          : `
                            text-gray-400
                          `
                      )}
                    />
                  </div>
                </button>
              );
            }
          )}
      </div>

      {/* ============================================== */}
      {/* EMPTY */}
      {/* ============================================== */}

      {!loading &&
        filteredGroups.length ===
          0 && (
          <div
            className="
              mt-5
              rounded-2xl
              border border-dashed
              border-gray-200
              bg-white
              p-8
              text-center
            "
          >
            {search ? (
              <>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#0f172a]
                  "
                >
                  No group match your
                  search
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Try another keyword
                </p>
              </>
            ) : (
              <>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#0f172a]
                  "
                >
                  No groups found
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Create template to
                  generate category
                </p>
              </>
            )}
          </div>
        )}
    </div>
  );
}