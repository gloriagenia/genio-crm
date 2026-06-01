"use client";

import {
  ReactNode,
} from "react";

import {
  X,
} from "lucide-react";

import clsx from "clsx";

import Avatar from "@/components/ui/Avatar";

import useIsMobile from "@/components/hooks/useIsMobile";

// =========================
// TYPES
// =========================

type DetailHeaderProps = {
  title: string;

  subtitle?: string;

  avatarSrc?: string;

  avatarName?: string;

  avatarIcon?: ReactNode;

  badges?: ReactNode;

  actions?: ReactNode;

  onClose?: () => void;

  sticky?: boolean;

  showCloseButton?: boolean;

  className?: string;
};

// =========================
// COMPONENT
// =========================

export default function DetailHeader({
  title,

  subtitle,

  avatarSrc,

  avatarName,

  avatarIcon,

  badges,

  actions,

  onClose,

  sticky = true,

  showCloseButton = true,

  className,
}: DetailHeaderProps) {
  // =========================
  // HOOKS
  // =========================

  const isMobile =
    useIsMobile();

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className={clsx(
        // BASE

        "bg-white",

        "border-b",
        "border-slate-200",

        "shrink-0",

        // STICKY

        sticky &&
          clsx(
            "sticky",
            "top-0",
            "z-30",

            "bg-white/95",
            "backdrop-blur"
          ),

        // CUSTOM

        className
      )}
    >
      {/* CONTAINER */}

      <div
        className={clsx(
          // LAYOUT

          "flex",

          "items-start",

          "justify-between",

          "gap-3",

          // PADDING

          "px-4",
          "py-4",

          "xl:px-6",
          "xl:py-5"
        )}
      >
        {/* LEFT */}

        <div
          className="
            min-w-0
            flex-1

            flex
            items-start

            gap-3
            xl:gap-4
          "
        >
          {/* AVATAR */}

          <Avatar
            src={avatarSrc}
            name={avatarName}
            icon={avatarIcon}
            size={
              isMobile
                ? "md"
                : "lg"
            }
          />

          {/* CONTENT */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            {/* TITLE */}

            <div
              className="
                text-lg
                xl:text-2xl

                font-bold

                text-slate-900

                break-words
              "
            >
              {title}
            </div>

            {/* SUBTITLE */}

            {subtitle && (
              <div
                className="
                  mt-1

                  text-sm
                  xl:text-base

                  text-slate-500

                  break-words
                "
              >
                {subtitle}
              </div>
            )}

            {/* BADGES */}

            {badges && (
              <div
                className="
                  mt-3

                  flex
                  flex-wrap

                  gap-2
                "
              >
                {badges}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            items-start

            gap-2

            shrink-0
          "
        >
          {/* ACTIONS */}

          {actions}

          {/* CLOSE */}

          {showCloseButton &&
            onClose && (
              <button
                type="button"
                onClick={
                  onClose
                }
                className="
                  w-10
                  h-10

                  rounded-xl

                  flex
                  items-center
                  justify-center

                  hover:bg-slate-100

                  transition-colors

                  shrink-0
                "
              >
                <X
                  size={20}
                  className="
                    text-slate-500
                  "
                />
              </button>
            )}
        </div>
      </div>
    </div>
  );
}