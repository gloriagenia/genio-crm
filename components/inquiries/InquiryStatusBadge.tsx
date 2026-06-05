"use client";

type InquiryStatusBadgeProps = {
  status?: string | null;
};

export default function InquiryStatusBadge({
  status,
}: InquiryStatusBadgeProps) {

  const value =
    status?.trim() || "-";

  function getClassName() {

    switch (
      value.toLowerCase()
    ) {

      // =========================
      // NEW
      // =========================

      case "new":

      case "new inquiry":

        return `
          bg-gray-100
          text-gray-700
          border-gray-200
        `;

      // =========================
      // MATCHING
      // =========================

      case "matching":

      case "matching property":

        return `
          bg-blue-100
          text-blue-700
          border-blue-200
        `;

      // =========================
      // VIEWING
      // =========================

      case "viewing":

      case "site visit":

      case "survey":

        return `
          bg-purple-100
          text-purple-700
          border-purple-200
        `;

      // =========================
      // NEGOTIATION
      // =========================

      case "negotiation":

      case "negotiating":

        return `
          bg-orange-100
          text-orange-700
          border-orange-200
        `;

      // =========================
      // CLOSED WON
      // =========================

      case "closed won":

      case "won":

      case "deal":

      case "closing":

        return `
          bg-green-100
          text-green-700
          border-green-200
        `;

      // =========================
      // CLOSED LOST
      // =========================

      case "closed lost":

      case "lost":

      case "cancelled":

      case "rejected":

        return `
          bg-red-100
          text-red-700
          border-red-200
        `;

      // =========================
      // FOLLOW UP
      // =========================

      case "follow up":

      case "followup":

        return `
          bg-cyan-100
          text-cyan-700
          border-cyan-200
        `;

      // =========================
      // HOLD
      // =========================

      case "hold":

      case "pending":

        return `
          bg-yellow-100
          text-yellow-700
          border-yellow-200
        `;

      // =========================
      // DEFAULT
      // =========================

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