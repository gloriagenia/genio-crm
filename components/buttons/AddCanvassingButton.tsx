"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Papa from "papaparse";

type AddCanvassingButtonProps = {
  onAdd?: () => void;

  onImport?: (
    data: any[]
  ) => void;

  onUploadPhoto?: () => void;
};

export default function AddCanvassingButton({
  onAdd,
  onImport,
  onUploadPhoto,
}: AddCanvassingButtonProps) {

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

  function handleImportFile(
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
          bg-black
          text-white
          rounded-xl
          px-4
          py-2
          text-sm
          font-medium
          hover:bg-gray-800
          transition
        "
      >
        + Add Canvassing
      </button>

      {open && (

        <div
          className="
            absolute
            right-0
            mt-2
            w-56
            rounded-2xl
            border
            bg-white
            shadow-xl
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
              px-4
              py-3
              text-left
              text-sm
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
              px-4
              py-3
              text-left
              text-sm
              hover:bg-gray-100
            "
          >
            Import CSV
          </button>

          <button
            onClick={() => {

              onUploadPhoto?.();

              setOpen(false);

            }}

            className="
              w-full
              px-4
              py-3
              text-left
              text-sm
              hover:bg-gray-100
            "
          >
            Upload Photo
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