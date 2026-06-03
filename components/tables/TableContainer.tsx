"use client";

import { ReactNode } from "react";

import clsx from "clsx";

type TableContainerProps = {
  children: ReactNode;

  className?: string;

  maxHeight?: string;
};

export default function TableContainer({

  children,

  className,

  maxHeight = "calc(100vh - 320px)",

}: TableContainerProps) {

  return (

    <div
      className={clsx(
        `
          overflow-hidden

          rounded-[28px]

          border
          border-slate-200

          bg-white

          shadow-sm
        `,
        className
      )}
    >

      <div
        className="
          overflow-x-auto
          overflow-y-auto
        "
        style={{
          maxHeight,
        }}
      >

        {children}

      </div>

    </div>
  );
}