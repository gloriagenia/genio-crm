"use client";

import DataTable from "@/components/tables/DataTable";

interface ContactsTableProps {
  loading: boolean;

  data: any[];

  columns: any[];

  onRowClick: (
    row: any
  ) => void;
}

export default function ContactsTable({
  loading,
  data,
  columns,
  onRowClick,
}: ContactsTableProps) {
  // =========================
  // EMPTY STATE
  // =========================

  if (
    !loading &&
    data.length === 0
  ) {
    return (
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200

          p-10
          lg:p-12

          text-center

          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
          "
        >
          {/* ICON */}
          <div
            className="
              w-20
              h-20

              rounded-full

              bg-slate-100

              flex
              items-center
              justify-center
            "
          >
            <span
              className="
                text-3xl
              "
            >
              📇
            </span>
          </div>

          {/* TITLE */}
          <h2
            className="
              mt-6

              text-2xl
              lg:text-xl

              font-bold

              text-slate-900
            "
          >
            No Contacts Found
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-3

              text-base
              lg:text-sm

              text-slate-500

              max-w-md

              leading-relaxed
            "
          >
            Tidak ada data contact yang
            sesuai dengan filter atau
            pencarian.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200

          p-10
          lg:p-12

          text-center

          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
          "
        >
          {/* LOADER */}
          <div
            className="
              w-12
              h-12

              rounded-full

              border-4
              border-slate-200
              border-t-yellow-500

              animate-spin
            "
          />

          {/* TEXT */}
          <p
            className="
              mt-5

              text-base
              lg:text-sm

              text-slate-500
            "
          >
            Loading contacts...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // TABLE
  // =========================

  return (
    <div
      className="
        hidden
        lg:block

        bg-white
        rounded-3xl

        border
        border-slate-200

        shadow-sm

        overflow-hidden
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between

          px-6
          py-5

          border-b
          border-slate-100
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-bold
              text-slate-900
            "
          >
            Contacts List
          </h2>

          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            Manage contact relationship
            & follow up activity
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={data}
          onRowClick={
            onRowClick
          }
        />
      </div>
    </div>
  );
}