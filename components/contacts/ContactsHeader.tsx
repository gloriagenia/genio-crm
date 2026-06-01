"use client";

import AddButton from "@/components/buttons/AddButton";

interface ContactsHeaderProps {
  onAdd: () => void;

  onImport?: (
    data: any[]
  ) => void;
}

export default function ContactsHeader({
  onAdd,
  onImport,
}: ContactsHeaderProps) {
  return (
    <div
      className="
        flex
        flex-col
        lg:flex-row

        lg:items-center
        lg:justify-between

        gap-5
      "
    >
      {/* LEFT */}
      <div>
        {/* TITLE */}
        <h1
          className="
            text-3xl
            lg:text-2xl

            font-bold

            text-slate-900

            tracking-tight
          "
        >
          Contacts
        </h1>

        {/* SUBTITLE */}
        <p
          className="
            mt-2

            text-base
            lg:text-sm

            text-slate-500

            leading-relaxed
          "
        >
          Relationship &
          operational memory center
        </p>
      </div>

      {/* RIGHT */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <AddButton
          label="Add Contact"
          onAdd={onAdd}
          onImport={onImport}
        />
      </div>
    </div>
  );
}