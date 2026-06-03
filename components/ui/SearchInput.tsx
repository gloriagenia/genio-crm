"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import clsx from "clsx";

import {
  Loader2,
  Search,
  X,
} from "lucide-react";

// =========================
// TYPES
// =========================

type SearchInputProps = {

  // =========================
  // VALUE
  // =========================

  value: string;

  onChange: (
    value: string
  ) => void;

  // =========================
  // OPTIONAL
  // =========================

  placeholder?: string;

  className?: string;

  disabled?: boolean;

  loading?: boolean;

  autoFocus?: boolean;

  debounceMs?: number;

  // =========================
  // EVENTS
  // =========================

  onSearch?: (
    value: string
  ) => void;

  onClear?: () => void;

  onFocus?: () => void;

  onBlur?: () => void;

  // =========================
  // DATABASE SEARCH MODE
  // =========================

  searchFields?: string[];

  // Example:
  // [
  //   "contacts.name",
  //   "contacts.phone",
  //   "city",
  //   "district",
  //   "property_type",
  //   "market_type",
  // ]

  // =========================
  // UI
  // =========================

  rounded?: "lg" | "xl" | "2xl";

  size?: "sm" | "md" | "lg";

  clearable?: boolean;
};

// =========================
// COMPONENT
// =========================

export default function SearchInput({
  value,
  onChange,

  placeholder = "Search...",

  className,

  disabled = false,

  loading = false,

  autoFocus = false,

  debounceMs = 400,

  onSearch,

  onClear,

  onFocus,

  onBlur,

  rounded = "2xl",

  size = "md",

  clearable = true,
}: SearchInputProps) {

  // =========================
  // STATES
  // =========================

  const [
    internalValue,
    setInternalValue,
  ] = useState(value || "");

  const [
    isFocused,
    setIsFocused,
  ] = useState(false);

  // =========================
  // REFS
  // =========================

  const debounceRef =
    useRef<NodeJS.Timeout | null>(
      null
    );

  // =========================
  // SYNC EXTERNAL VALUE
  // =========================

  useEffect(() => {

    setInternalValue(
      value || ""
    );

  }, [value]);

  // =========================
  // DEBOUNCE SEARCH
  // =========================

  useEffect(() => {

    if (!onSearch) return;

    if (
      debounceRef.current
    ) {

      clearTimeout(
        debounceRef.current
      );
    }

    debounceRef.current =
      setTimeout(() => {

        onSearch(
          internalValue.trim()
        );

      }, debounceMs);

    return () => {

      if (
        debounceRef.current
      ) {

        clearTimeout(
          debounceRef.current
        );
      }
    };

  }, [
    internalValue,
    debounceMs,
    onSearch,
  ]);

  // =========================
  // HANDLE CHANGE
  // =========================

  function handleChange(
    e: ChangeEvent<HTMLInputElement>
  ) {

    const newValue =
      e.target.value;

    setInternalValue(
      newValue
    );

    onChange(
      newValue
    );
  }

  // =========================
  // HANDLE CLEAR
  // =========================

  function handleClear() {

    setInternalValue("");

    onChange("");

    onClear?.();

    onSearch?.("");
  }

  // =========================
  // HANDLE ENTER
  // =========================

  function handleKeyDown(
    e: KeyboardEvent<HTMLInputElement>
  ) {

    if (
      e.key === "Enter"
    ) {

      onSearch?.(
        internalValue.trim()
      );
    }
  }

  // =========================
  // ROUNDED
  // =========================

  const roundedClass =
    useMemo(() => {

      switch (
        rounded
      ) {

        case "lg":
          return "rounded-lg";

        case "xl":
          return "rounded-xl";

        default:
          return "rounded-2xl";
      }

    }, [rounded]);

  // =========================
  // SIZE
  // =========================

  const sizeClass =
    useMemo(() => {

      switch (
        size
      ) {

        case "sm":
          return `
            h-10
            text-sm
          `;

        case "lg":
          return `
            h-14
            text-base
          `;

        default:
          return `
            h-12
            text-sm
          `;
      }

    }, [size]);

  // =========================
  // RENDER
  // =========================

  return (

    <div
      className={clsx(
        `
          relative
          w-full
        `,
        className
      )}
    >

      {/* SEARCH ICON */}

      <div
        className="
          pointer-events-none

          absolute
          left-4
          top-1/2

          -translate-y-1/2

          text-slate-400
        "
      >

        <Search
          size={18}
        />

      </div>

      {/* INPUT */}

      <input
        type="text"

        value={
          internalValue
        }

        onChange={
          handleChange
        }

        onKeyDown={
          handleKeyDown
        }

        disabled={
          disabled
        }

        autoFocus={
          autoFocus
        }

        placeholder={
          placeholder
        }

        onFocus={() => {

          setIsFocused(
            true
          );

          onFocus?.();
        }}

        onBlur={() => {

          setIsFocused(
            false
          );

          onBlur?.();
        }}

        className={clsx(
          `
            w-full

            border

            bg-white

            pl-12
            pr-12

            font-medium

            text-slate-900

            outline-none

            transition-all
            duration-200

            placeholder:text-slate-400

            disabled:cursor-not-allowed
            disabled:bg-slate-100

            md:text-sm
          `,

          roundedClass,

          sizeClass,

          isFocused
            ? `
              border-[#F4C842]

              ring-4
              ring-[#F4C842]/10
            `
            : `
              border-slate-200
            `
        )}
      />

      {/* RIGHT ACTION */}

      <div
        className="
          absolute
          right-3
          top-1/2

          flex
          -translate-y-1/2
          items-center
          gap-2
        "
      >

        {/* LOADING */}

        {loading && (

          <Loader2
            size={16}
            className="
              animate-spin
              text-slate-400
            "
          />

        )}

        {/* CLEAR */}

        {!loading &&
          clearable &&
          internalValue && (

          <button
            type="button"

            onClick={
              handleClear
            }

            className="
              flex
              h-7
              w-7

              items-center
              justify-center

              rounded-full

              text-slate-400

              transition-all

              hover:bg-slate-100
              hover:text-slate-700
            "
          >

            <X
              size={16}
            />

          </button>

        )}

      </div>

    </div>
  );
}