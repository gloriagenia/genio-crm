"use client";

type ImportCsvPreviewModalProps = {
  open: boolean;

  title?: string;

  columns: {
    key: string;
    label: string;
  }[];

  data: any[];

  onClose: () => void;

  onImport: () => void;
};

export default function ImportCsvPreviewModal({
  open,
  title = "Import CSV Preview",
  columns,
  data,
  onClose,
  onImport,
}: ImportCsvPreviewModalProps) {

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-6xl
          p-6
          space-y-5
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2 className="text-xl font-bold">
              {title}
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Total Data: {data.length}
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              text-lg
              cursor-pointer
            "
          >
            ✕
          </button>

        </div>

        <div
          className="
            overflow-auto
            max-h-[500px]
            border
            rounded-xl
          "
        >

          <table className="w-full">

            <thead
              className="
                bg-gray-100
                sticky
                top-0
              "
            >

              <tr>

                <th
                  className="
                    p-3
                    border
                    text-left
                  "
                >
                  No
                </th>

                {columns.map((column) => (

                  <th
                    key={column.key}
                    className="
                      p-3
                      border
                      text-left
                    "
                  >
                    {column.label}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan={
                      columns.length + 1
                    }

                    className="
                      p-6
                      text-center
                      text-gray-400
                    "
                  >
                    No Data
                  </td>

                </tr>

              ) : (

                data.map((item, index) => (

                  <tr
                    key={index}
                    className="
                      hover:bg-gray-50
                    "
                  >

                    <td
                      className="
                        p-3
                        border
                      "
                    >
                      {index + 1}
                    </td>

                    {columns.map((column) => (

                      <td
                        key={column.key}
                        className="
                          p-3
                          border
                        "
                      >
                        {
                          item[column.key]
                        }
                      </td>

                    ))}

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            Ready to import{" "}
            <span className="font-semibold">
              {data.length}
            </span>{" "}
            rows
          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <button
              onClick={onClose}

              className="
                border
                rounded-xl
                px-4
                py-2
                cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              onClick={onImport}

              className="
                bg-black
                text-white
                rounded-xl
                px-4
                py-2
                cursor-pointer
                hover:bg-gray-800
              "
            >
              Import Data
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}