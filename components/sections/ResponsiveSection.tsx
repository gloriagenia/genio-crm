"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import clsx from "clsx";

import useAccordion from "@/components/hooks/useAccordion";
import useIsMobile from "@/components/hooks/useIsMobile";

import SectionHeader from "@/components/sections/SectionHeader";
import SectionContent from "@/components/sections/SectionContent";

// =========================
// TYPES
// =========================

type ResponsiveSectionProps = {
  title: string;

  subtitle?: string;

  icon?: ReactNode;

  badge?: ReactNode;

  action?: ReactNode;

  children: ReactNode;

  defaultOpen?: boolean;

  collapsibleMobile?: boolean;

  padding?: "none" | "sm" | "md" | "lg";

  scrollable?: boolean;

  contentClassName?: string;

  className?: string;
};

// =========================
// COMPONENT
// =========================

export default function ResponsiveSection({
  title,

  subtitle,

  icon,

  badge,

  action,

  children,

  defaultOpen = true,

  collapsibleMobile = true,

  padding = "md",

  scrollable = false,

  contentClassName,

  className,
}: ResponsiveSectionProps) {
  // =========================
  // HOOKS
  // =========================

  const isMobile =
    useIsMobile();

  const {
    open,

    setOpen,

    toggle,
  } = useAccordion({
    defaultOpen,
  });

  // =========================
  // RESPONSIVE BEHAVIOR
  // =========================

  useEffect(() => {
    // Desktop always open

    if (!isMobile) {
      setOpen(true);
    }

    // Mobile follows defaultOpen

    if (
      isMobile &&
      collapsibleMobile
    ) {
      setOpen(
        defaultOpen
      );
    }
  }, [
    isMobile,

    defaultOpen,

    collapsibleMobile,

    setOpen,
  ]);

  // =========================
  // STATES
  // =========================

  const collapsible =
    isMobile &&
    collapsibleMobile;

  // =========================
  // RENDER
  // =========================

  return (
    <section
      className={clsx(
        // BASE

        "overflow-hidden",

        "rounded-2xl",

        "border",
        "border-slate-200",

        "bg-white",

        // CUSTOM

        className
      )}
    >
      {/* HEADER */}

      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        badge={badge}
        action={action}
        collapsible={
          collapsible
        }
        open={open}
        onToggle={toggle}
      />

      {/* CONTENT */}

      {open && (
        <SectionContent
          padding={padding}
          scrollable={
            scrollable
          }
          className={clsx(
            // ANIMATION

            "animate-in",
            "fade-in",
            "duration-200",

            contentClassName
          )}
        >
          {children}
        </SectionContent>
      )}
    </section>
  );
}