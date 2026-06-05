"use client";

type ListingStatusBadgeProps = {
  status?: string | null;
};

export default function ListingStatusBadge({
  status,
}: ListingStatusBadgeProps) {

  const value =
    status?.trim() || "Draft";

  function getClassName() {

    switch (value) {

      case "Draft":
        return `
          bg-gray-100
          text-gray-700
          border-gray-200
        `;

      case "Published":
        return `
          bg-blue-100
          text-blue-700
          border-blue-200
        `;

      case "Featured":
        return `
          bg-purple-100
          text-purple-700
          border-purple-200
        `;

      case "Pending":
        return `
          bg-orange-100
          text-orange-700
          border-orange-200
        `;

      case "Sold":
        return `
          bg-green-100
          text-green-700
          border-green-200
        `;

      case "Rented":
        return `
          bg-emerald-100
          text-emerald-700
          border-emerald-200
        `;

      case "Expired":
        return `
          bg-red-100
          text-red-700
          border-red-200
        `;

      case "Archived":
        return `
          bg-slate-100
          text-slate-700
          border-slate-200
        `;

      default:
        return `
          bg-gray-100
          text-gray-700
          border-gray-200
        `;
    }
  }

  return (

    <span
      className={`
        inline-flex
        items-center
        justify-center

        min-w-[90px]

        px-3
        py-1

        rounded-full

        border

        text-xs
        font-medium

        whitespace-nowrap

        ${getClassName()}
      `}
    >
      {value}
    </span>

  );
}