"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Papa from "papaparse";

type AddButtonProps = {
  label: string;

  onAdd?: () => void;

  onImport?: (data: any[]) => void;
};

export default function AddButton({
  label,
  onAdd,
  onImport,
}: AddButtonProps) {

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  async function handleImportFile(
    e: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    Papa.parse(file, {

      header: true,

      skipEmptyLines: true,

      complete: (results) => {

        onImport?.(
          results.data as any[]
        );

      },

    });

    e.target.value = "";
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >

      <button
        onClick={() =>
          setOpen(!open)
        }

        className="
          rounded-xl
          bg-black
          text-white
          px-4
          py-2
          text-sm
          font-medium
          hover:bg-gray-800
        "
      >
        + {label}
      </button>

      {open && (

        <div
          className="
            absolute
            right-0
            mt-2
            w-48
            rounded-xl
            border
            bg-white
            shadow-lg
            overflow-hidden
            z-50
          "
        >

          <button
            onClick={() => {

              onAdd?.();

              setOpen(false);

            }}

            className="
              w-full
              text-left
              px-4
              py-3
              hover:bg-gray-100
            "
          >
            Add Manually
          </button>

          <button
            onClick={() => {

              fileInputRef.current?.click();

              setOpen(false);

            }}

            className="
              w-full
              text-left
              px-4
              py-3
              hover:bg-gray-100
            "
          >
            Import CSV
          </button>

        </div>

      )}

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleImportFile}
        className="hidden"
      />

    </div>
  );
}