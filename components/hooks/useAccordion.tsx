"use client";

import {
  useCallback,
  useState,
} from "react";

// =========================
// TYPES
// =========================

type UseAccordionProps = {
  defaultOpen?: boolean;
};

// =========================
// HOOK
// =========================

export default function useAccordion({
  defaultOpen = false,
}: UseAccordionProps = {}) {
  // =========================
  // STATE
  // =========================

  const [open, setOpen] =
    useState(defaultOpen);

  // =========================
  // ACTIONS
  // =========================

  const toggle =
    useCallback(() => {
      setOpen((prev) => !prev);
    }, []);

  const openAccordion =
    useCallback(() => {
      setOpen(true);
    }, []);

  const closeAccordion =
    useCallback(() => {
      setOpen(false);
    }, []);

  // =========================
  // RETURN
  // =========================

  return {
    open,

    setOpen,

    toggle,

    openAccordion,

    closeAccordion,
  };
}