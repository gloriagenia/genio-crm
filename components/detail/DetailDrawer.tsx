"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import {
  X,
} from "lucide-react";

import clsx from "clsx";

import useIsMobile from "@/components/hooks/useIsMobile";

// =========================
// TYPES
// =========================

type DetailDrawerProps = {
  open: boolean;

  onClose: () => void;

  children: ReactNode;

  title?: string;

  closeOnOverlay?: boolean;

  showCloseButton?: boolean;

  className?: string;

  contentClassName?: string;
};

// =========================
// COMPONENT
// =========================

export default function DetailDrawer({
  open,

  onClose,

  children,

  title,

  closeOnOverlay = true,

  showCloseButton = true,

  className,

  contentClassName,
}: DetailDrawerProps) {
  // =========================
  // HOOKS
  // =========================

  const isMobile =
    useIsMobile();

  // =========================
  // ESC CLOSE
  // =========================

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener(
        "keydown",
        handleKeyDown
      );

      // LOCK BODY SCROLL

      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [open, onClose]);

  // =========================
  // HIDE
  // =========================

  if (!open)
    return null;

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
      "
    >
      {/* OVERLAY */}

      <div
        onClick={() => {
          if (
            closeOnOverlay
          ) {
            onClose();
          }
        }}
        className={clsx(
          // BASE

          "absolute",
          "inset-0",

          "bg-black/50",

          // ANIMATION

          "animate-in",
          "fade-in",
          "duration-200"
        )}
      />

      {/* CONTAINER */}

      <div
        className={clsx(
          // BASE

          "absolute",
          "inset-0",

          "flex",

          // MOBILE

          isMobile
            ? clsx(
                "items-end",
                "justify-center"
              )
            : clsx(
                "items-center",
                "justify-center",

                "p-4"
              )
        )}
      >
        {/* PANEL */}

        <div
          className={clsx(
            // BASE

            "relative",

            "bg-white",

            "shadow-2xl",

            "overflow-hidden",

            "flex",
            "flex-col",

            // MOBILE

            isMobile
              ? clsx(
                  "w-full",

                  "h-screen",

                  "rounded-t-3xl",

                  // ANIMATION

                  "animate-in",
                  "slide-in-from-bottom",
                  "duration-300"
                )
              : clsx(
                  "w-full",

                  "max-w-[1200px]",

                  "h-[92vh]",

                  "rounded-3xl",

                  // ANIMATION

                  "animate-in",
                  "zoom-in-95",
                  "fade-in",
                  "duration-200"
                ),

            // CUSTOM

            className
          )}
        >
          {/* MOBILE HANDLE */}

          {isMobile && (
            <div
              className="
                flex
                justify-center

                pt-3
                pb-1

                shrink-0
              "
            >
              <div
                className="
                  w-12
                  h-1.5

                  rounded-full

                  bg-slate-300
                "
              />
            </div>
          )}

          {/* TOP BAR */}

          {(title ||
            showCloseButton) && (
            <div
              className="
                sticky
                top-0
                z-20

                bg-white/95
                backdrop-blur

                border-b
                border-slate-200

                px-4
                xl:px-6

                py-3

                flex
                items-center
                justify-between

                gap-3

                shrink-0
              "
            >
              {/* TITLE */}

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                {title && (
                  <div
                    className="
                      text-base
                      xl:text-lg

                      font-semibold

                      text-slate-900

                      truncate
                    "
                  >
                    {title}
                  </div>
                )}
              </div>

              {/* CLOSE */}

              {showCloseButton && (
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
          )}

          {/* CONTENT */}

        <div
        className={clsx(
            // IMPORTANT

            "flex-1",
            "min-h-0",

            // FLEX COLUMN

            "flex",
            "flex-col",

            // PREVENT OVERFLOW

            "overflow-hidden",

            contentClassName
        )}
        >
        {children}
        </div>
        </div>
      </div>
    </div>
  );
}