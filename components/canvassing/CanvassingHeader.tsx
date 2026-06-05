"use client";

import {
  Plus,
  Upload,
  FileSpreadsheet,
} from "lucide-react";

type CanvassingHeaderProps = {

  totalData?: number;

  onAdd?: () => void;

  onUploadPhoto?: () => void;

  onImportCsv?: () => void;
};

export default function CanvassingHeader({
  totalData = 0,
  onAdd,
  onUploadPhoto,
  onImportCsv,
}: CanvassingHeaderProps) {

  return (

    <div
      className="
        bg-white
        border
        rounded-2xl
        p-4
        md:p-6
      "
    >

      {/* TOP */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div>

          <h1
            className="
              text-2xl
              md:text-3xl
              font-bold
            "
          >
            Canvassing
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Manage canvassing leads and
            convert them into properties.
          </p>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-2
          "
        >

          <button
            onClick={onUploadPhoto}
            className="
              flex
              items-center
              justify-center
              gap-2

              border
              rounded-xl

              px-4
              py-3

              text-sm
              font-medium

              hover:bg-gray-100
              transition
            "
          >

            <Upload size={18} />

            Upload Photo

          </button>

          <button
            onClick={onImportCsv}
            className="
              flex
              items-center
              justify-center
              gap-2

              border
              rounded-xl

              px-4
              py-3

              text-sm
              font-medium

              hover:bg-gray-100
              transition
            "
          >

            <FileSpreadsheet
              size={18}
            />

            Import CSV

          </button>

          <button
            onClick={onAdd}
            className="
              flex
              items-center
              justify-center
              gap-2

              bg-black
              text-white

              rounded-xl

              px-4
              py-3

              text-sm
              font-medium

              hover:bg-gray-800
              transition
            "
          >

            <Plus size={18} />

            Add Canvassing

          </button>

        </div>

      </div>

      {/* STATS */}

      <div
        className="
          mt-5
          pt-5
          border-t
        "
      >

        <div
          className="
            inline-flex
            items-center
            gap-2

            px-4
            py-2

            rounded-xl

            bg-gray-100
          "
        >

          <span
            className="
              text-xs
              text-gray-500
            "
          >
            Total Data
          </span>

          <span
            className="
              font-semibold
            "
          >
            {totalData}
          </span>

        </div>

      </div>

    </div>

  );
}