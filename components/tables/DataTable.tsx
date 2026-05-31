type Column = {
  key: string;
  label: string;
};

type DataTableProps = {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
};

export default function DataTable({
  columns,
  data,
  onRowClick,
}: DataTableProps) {

  return (

    <div
      className="
        rounded-xl
        border
        bg-white
        overflow-visible
      "
    >

      <div
        className="
          overflow-x-auto
          overflow-y-visible
        "
      >

        <table
          className="
            min-w-full
            text-sm
            border-separate
            border-spacing-0
          "
        >

          <thead
            className="
              bg-black
              text-white
            "
          >

            <tr>

              {columns.map((column) => (

                <th
                  key={column.key}

                  className="
                    px-4
                    py-3
                    text-left
                    font-semibold
                    whitespace-nowrap
                  "
                >
                  {column.label}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.length === 0 && (

              <tr>

                <td
                  colSpan={columns.length}

                  className="
                    px-4
                    py-10
                    text-center
                    text-gray-400
                  "
                >
                  No Data
                </td>

              </tr>

            )}

            {data.map((row, index) => (

              <tr
                key={index}

                onClick={() =>
                  onRowClick?.(row)
                }

                className="
                  border-t
                  hover:bg-gray-50
                  cursor-pointer
                  transition
                "
              >

                {columns.map((column) => (

                  <td
                    key={column.key}

                    className="
                      px-4
                      py-3
                      whitespace-nowrap
                      align-middle
                    "
                  >
                    {row[column.key]}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}