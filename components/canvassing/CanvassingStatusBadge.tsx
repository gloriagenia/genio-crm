"use client";

type CanvassingStatus =
  | "New"
  | "Need Review"
  | "Ready to Contact"
  | "No Response"
  | "Interested"
  | "Rejected"
  | "Invalid Number"
  | "Converted";

type CanvassingStatusBadgeProps = {
  status?: string | null;
};

export default function CanvassingStatusBadge({
  status,
}: CanvassingStatusBadgeProps) {

  const badgeConfig: Record<
    string,
    {
      bg: string;
      text: string;
    }
  > = {

    New: {
      bg: "bg-gray-100",
      text: "text-gray-700",
    },

    "Need Review": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },

    "Ready to Contact": {
      bg: "bg-blue-100",
      text: "text-blue-700",
    },

    "No Response": {
      bg: "bg-slate-100",
      text: "text-slate-700",
    },

    Interested: {
      bg: "bg-green-100",
      text: "text-green-700",
    },

    Rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
    },

    "Invalid Number": {
      bg: "bg-orange-100",
      text: "text-orange-700",
    },

    Converted: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
    },
  };

  const config =
    badgeConfig[status || "New"] ||
    badgeConfig["New"];

  return (

    <div
      className={`
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
        whitespace-nowrap
        ${config.bg}
        ${config.text}
      `}
    >
      {status || "New"}
    </div>

  );
}