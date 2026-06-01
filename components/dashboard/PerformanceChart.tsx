"use client";

import Link from "next/link";

const pipelineData = [
  {
    label: "New",
    value: 120,
    color: "bg-blue-200",
  },
  {
    label: "Contacted",
    value: 80,
    color: "bg-yellow-200",
  },
  {
    label: "Qualified",
    value: 45,
    color: "bg-green-200",
  },
  {
    label: "Viewing",
    value: 32,
    color: "bg-cyan-200",
  },
  {
    label: "Negotiation",
    value: 20,
    color: "bg-purple-200",
  },
  {
    label: "Won",
    value: 10,
    color: "bg-emerald-200",
  },
  {
    label: "Lost",
    value: 8,
    color: "bg-red-200",
  },
];

export default function PerformanceChart() {
  // MAX VALUE
  const maxValue = Math.max(
    ...pipelineData.map((item) => item.value)
  );

  // TOTAL PIPELINE
  const totalPipeline = pipelineData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-slate-200
        shadow-sm

        p-5
        lg:p-6
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}
        <div>
          <h2
            className="
              text-2xl
              lg:text-xl

              font-bold
              text-slate-900
            "
          >
            Pipeline Leads
          </h2>

          <p
            className="
              text-base
              lg:text-sm

              text-slate-500

              mt-2

              leading-relaxed
            "
          >
            Monitoring progress inquiry & deal
          </p>
        </div>

        {/* VIEW ALL */}
        <Link
          href="/inquiries"
          className="
            text-base
            lg:text-sm

            font-medium
            text-yellow-600

            hover:text-yellow-700

            whitespace-nowrap
          "
        >
          View All
        </Link>
      </div>

      {/* PIPELINE */}
      <div className="mt-8 space-y-6">
        {pipelineData.map((item) => {
          // PERCENTAGE
          const width =
            (item.value / maxValue) * 100;

          return (
            <div key={item.label}>
              {/* LABEL + VALUE */}
              <div className="flex items-center justify-between mb-3">
                {/* LABEL */}
                <div
                  className="
                    text-base
                    lg:text-sm

                    font-semibold
                    text-slate-700
                  "
                >
                  {item.label}
                </div>

                {/* VALUE */}
                <div
                  className="
                    text-lg
                    lg:text-sm

                    font-bold
                    text-slate-900
                  "
                >
                  {item.value}
                </div>
              </div>

              {/* BAR WRAPPER */}
              <div
                className="
                  w-full

                  h-5
                  lg:h-4

                  bg-slate-100

                  rounded-full
                  overflow-hidden
                "
              >
                {/* BAR */}
                <div
                  className={`
                    h-full
                    rounded-full

                    transition-all
                    duration-500

                    ${item.color}
                  `}
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div
        className="
          mt-8
          pt-6

          border-t
          border-slate-100

          flex
          flex-col
          lg:flex-row

          lg:items-center
          lg:justify-between

          gap-5
        "
      >
        {/* TOTAL */}
        <div>
          <p
            className="
              text-base
              lg:text-sm

              text-slate-500
            "
          >
            Total Pipeline
          </p>

          <h3
            className="
              text-4xl
              lg:text-2xl

              font-bold
              text-slate-900

              mt-2
            "
          >
            {totalPipeline}
          </h3>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap gap-3">
          {pipelineData.map((item) => (
            <div
              key={item.label}
              className="
                flex
                items-center
                gap-2

                bg-slate-50

                px-3
                py-2

                rounded-xl
              "
            >
              {/* COLOR */}
              <div
                className={`
                  w-3
                  h-3
                  rounded-full

                  ${item.color}
                `}
              />

              {/* TEXT */}
              <span
                className="
                  text-sm
                  lg:text-xs

                  text-slate-600
                  font-medium
                "
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}