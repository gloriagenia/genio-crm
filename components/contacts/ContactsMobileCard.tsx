"use client";

import {
  Phone,
  CalendarClock,
  UserRound,
} from "lucide-react";

interface ContactsMobileCardProps {
  data: any[];

  loading: boolean;

  onRowClick: (
    row: any
  ) => void;
}

export default function ContactsMobileCard({
  data,
  loading,
  onRowClick,
}: ContactsMobileCardProps) {
  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <div
        className="
          lg:hidden

          bg-white
          rounded-3xl
          border
          border-slate-200

          p-10

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
  // EMPTY STATE
  // =========================

  if (data.length === 0) {
    return (
      <div
        className="
          lg:hidden

          bg-white
          rounded-3xl
          border
          border-slate-200

          p-10

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
            <span className="text-3xl">
              📇
            </span>
          </div>

          {/* TITLE */}
          <h2
            className="
              mt-6

              text-2xl

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

              text-slate-500

              leading-relaxed
            "
          >
            Tidak ada data contact
            yang sesuai dengan
            pencarian atau filter.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // MOBILE CARDS
  // =========================

  return (
    <div
      className="
        lg:hidden

        space-y-4
      "
    >
      {data.map((item) => (
        <button
          key={item.contact_id}
          onClick={() =>
            onRowClick(item)
          }
          className="
            w-full

            bg-white

            rounded-3xl

            border
            border-slate-200

            p-5

            shadow-sm

            text-left

            transition-all
            duration-200

            active:scale-[0.99]

            hover:border-yellow-300
          "
        >
          {/* TOP */}
          <div className="flex items-start justify-between gap-4">
            {/* LEFT */}
            <div className="min-w-0 flex-1">
              {/* NAME */}
              <h2
                className="
                  text-xl

                  font-bold

                  text-slate-900

                  leading-snug

                  break-words
                "
              >
                {item.name ||
                  "-"}
              </h2>

              {/* PHONE */}
              <div
                className="
                  flex
                  items-center
                  gap-2

                  mt-3
                "
              >
                <Phone
                  className="
                    w-4
                    h-4

                    text-slate-400
                  "
                />

                <p
                  className="
                    text-base

                    text-slate-500
                  "
                >
                  {item.phone ||
                    "-"}
                </p>
              </div>
            </div>

            {/* STATUS */}
            <div>
              {item.status}
            </div>
          </div>

          {/* INFO SECTION */}
          <div
            className="
              mt-5

              grid
              grid-cols-1

              gap-4
            "
          >
            {/* CONTACT TYPE */}
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              {/* ICON */}
              <div
                className="
                  w-10
                  h-10

                  rounded-2xl

                  bg-yellow-50

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <UserRound
                  className="
                    w-5
                    h-5

                    text-yellow-600
                  "
                />
              </div>

              {/* CONTENT */}
              <div>
                <p
                  className="
                    text-sm

                    text-slate-400
                  "
                >
                  Contact Type
                </p>

                <p
                  className="
                    text-base

                    font-semibold

                    text-slate-700

                    mt-1
                  "
                >
                  {item.contact_type ||
                    "-"}
                </p>
              </div>
            </div>

            {/* FOLLOWUP */}
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              {/* ICON */}
              <div
                className="
                  w-10
                  h-10

                  rounded-2xl

                  bg-blue-50

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <CalendarClock
                  className="
                    w-5
                    h-5

                    text-blue-600
                  "
                />
              </div>

              {/* CONTENT */}
              <div>
                <p
                  className="
                    text-sm

                    text-slate-400
                  "
                >
                  Next Followup
                </p>

                <p
                  className="
                    text-base

                    font-semibold

                    text-slate-700

                    mt-1
                  "
                >
                  {item.next_followup_at ||
                    "-"}
                </p>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}