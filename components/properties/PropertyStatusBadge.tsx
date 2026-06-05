"use client";

type PropertyStatusBadgeProps = {
  status?: string | null;
};

export default function PropertyStatusBadge({
  status,
}: PropertyStatusBadgeProps) {

  const value =
    status?.trim() || "Draft";

  const getClassName = () => {

    switch (value) {

      case "Draft":
        return `
          bg-gray-100
          text-gray-700
          border-gray-200
        `;

      case "Active":
        return `
          bg-blue-100
          text-blue-700
          border-blue-200
        `;

      case "Exclusive":
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

      case "Hold":
        return `
          bg-yellow-100
          text-yellow-700
          border-yellow-200
        `;

      case "Inactive":
        return `
          bg-red-100
          text-red-700
          border-red-200
        `;

      default:
        return `
          bg-gray-100
          text-gray-700
          border-gray-200
        `;
    }
  };

  return (

    <span
      className={`
        inline-flex
        items-center
        justify-center

        min-w-[80px]

        px-3
        py-1

        rounded-full

        text-xs
        font-medium

        border

        whitespace-nowrap

        ${getClassName()}
      `}
    >
      {value}
    </span>

  );
}