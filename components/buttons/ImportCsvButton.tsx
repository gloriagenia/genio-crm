"use client";

import { ChangeEvent } from "react";

type ImportCsvButtonProps = {
  label?: string;

  onParsed: (data: any[]) => void;
};

export default function ImportCsvButton({
  label = "Import CSV",
  onParsed,
}: ImportCsvButtonProps) {

  async function handleImport(
    e: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const text =
      await file.text();

    const lines = text
      .split("\n")
      .filter((line) => line.trim());

    if (lines.length === 0) return;

    const headers = lines[0]
      .split(",")
      .map((header) =>
        header.trim()
      );

    const rows = lines.slice(1);

    const parsedData = rows.map(
      (row) => {

        const values =
          row.split(",");

        const rowData: any = {};

        headers.forEach(
          (header, index) => {

            rowData[header] =
              values[index]?.trim();
          }
        );

        return rowData;
      }
    );

    onParsed(parsedData);
  }

  return (
    <label
      className="
        cursor-pointer
        rounded-xl
        border
        px-4
        py-2
        text-sm
        font-medium
        hover:bg-gray-100
      "
    >

      {label}

      <input
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />

    </label>
  );
}