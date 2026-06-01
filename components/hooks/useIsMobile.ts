"use client";

import {
  useEffect,
  useState,
} from "react";

// =========================
// BREAKPOINT
// =========================

const MOBILE_BREAKPOINT =
  1280;

// =========================
// HOOK
// =========================

export default function useIsMobile() {
  const [isMobile, setIsMobile] =
    useState(false);

  // =========================
  // HANDLE RESIZE
  // =========================

  useEffect(() => {
    function handleResize() {
      setIsMobile(
        window.innerWidth <
          MOBILE_BREAKPOINT
      );
    }

    // INITIAL CHECK

    handleResize();

    // LISTENER

    window.addEventListener(
      "resize",
      handleResize
    );

    // CLEANUP

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // =========================
  // RETURN
  // =========================

  return isMobile;
}