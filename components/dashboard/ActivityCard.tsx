import Link from "next/link";

import {
  Calendar,
  MapPinned,
  Phone,
  MessageCircle,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Viewing Rumah Tebet",
    description:
      "Survey bersama Pak Ade Fauzan",
    time: "09:00 WIB",
    type: "viewing",
  },
  {
    id: 2,
    title: "Follow Up Inquiry",
    description:
      "Hubungi Bu Fany terkait rumah Pejaten",
    time: "11:30 WIB",
    type: "call",
  },
  {
    id: 3,
    title: "Survey Ruko Cipinang",
    description:
      "Cek akses parkir dan lingkungan",
    time: "14:00 WIB",
    type: "survey",
  },
  {
    id: 4,
    title: "WhatsApp Owner",
    description:
      "Follow up listing baru area Tebet",
    time: "16:30 WIB",
    type: "wa",
  },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "viewing":
      return (
        <Calendar className="w-6 h-6 lg:w-5 lg:h-5 text-blue-600" />
      );

    case "survey":
      return (
        <MapPinned className="w-6 h-6 lg:w-5 lg:h-5 text-green-600" />
      );

    case "call":
      return (
        <Phone className="w-6 h-6 lg:w-5 lg:h-5 text-orange-600" />
      );

    case "wa":
      return (
        <MessageCircle className="w-6 h-6 lg:w-5 lg:h-5 text-emerald-600" />
      );

    default:
      return (
        <Calendar className="w-6 h-6 lg:w-5 lg:h-5 text-slate-600" />
      );
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "viewing":
      return "bg-blue-100";

    case "survey":
      return "bg-green-100";

    case "call":
      return "bg-orange-100";

    case "wa":
      return "bg-emerald-100";

    default:
      return "bg-slate-100";
  }
}

export default function ActivityCard() {
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
        <div>
          <h2
            className="
              text-2xl
              lg:text-xl

              font-bold
              text-slate-900
            "
          >
            Today's Activities
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
            Aktivitas dan appointment hari ini
          </p>
        </div>

        <Link
          href="/followups"
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

      {/* ACTIVITIES */}
      <div className="mt-6 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="
              flex
              items-start
              gap-4

              p-4
              lg:p-4

              rounded-2xl

              border
              border-slate-100

              hover:border-yellow-200
              hover:bg-yellow-50/30

              transition-all
              duration-200
            "
          >
            {/* ICON */}
            <div
              className={`
                w-14
                h-14

                lg:w-12
                lg:h-12

                rounded-2xl

                flex
                items-center
                justify-center

                shrink-0

                ${getActivityColor(activity.type)}
              `}
            >
              {getActivityIcon(activity.type)}
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                {/* LEFT */}
                <div className="min-w-0">
                  <h3
                    className="
                      text-lg
                      lg:text-base

                      font-semibold
                      text-slate-900

                      leading-snug
                    "
                  >
                    {activity.title}
                  </h3>

                  <p
                    className="
                      text-base
                      lg:text-sm

                      text-slate-500

                      mt-2

                      leading-relaxed
                    "
                  >
                    {activity.description}
                  </p>
                </div>

                {/* TIME */}
                <div
                  className="
                    text-sm
                    lg:text-xs

                    font-medium
                    text-slate-400

                    whitespace-nowrap
                  "
                >
                  {activity.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}