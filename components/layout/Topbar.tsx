"use client";

import {
  Bell,
  Settings,
} from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        bg-white
        border-b
        border-slate-200
        px-4
        lg:px-8
        flex
        items-center
      "
    >
      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-3">
        
        {/* NOTIFICATION */}
        <button
          className="
            relative
            w-11
            h-11
            rounded-2xl
            bg-slate-100
            hover:bg-slate-200
            transition
            flex
            items-center
            justify-center
          "
        >
          <Bell className="w-5 h-5 text-slate-700" />

          {/* RED DOT */}
          <div
            className="
              absolute
              top-2
              right-2
              w-2.5
              h-2.5
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* SETTINGS */}
        <button
          className="
            w-11
            h-11
            rounded-2xl
            bg-slate-100
            hover:bg-slate-200
            transition
            flex
            items-center
            justify-center
          "
        >
          <Settings className="w-5 h-5 text-slate-700" />
        </button>

        {/* PROFILE */}
        <button
          className="
            flex
            items-center
            gap-3
            bg-slate-100
            hover:bg-slate-200
            transition
            rounded-2xl
            px-3
            h-12
          "
        >
          {/* AVATAR */}
          <div
            className="
              w-9
              h-9
              rounded-full
              bg-yellow-400
              flex
              items-center
              justify-center
              font-bold
              text-black
              text-sm
            "
          >
            G
          </div>

          {/* TEXT */}
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-none">
              Gloria
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Property Agent
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}