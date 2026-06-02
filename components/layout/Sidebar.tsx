"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Users,
  Target,
  Building2,
  Route,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
  MessageSquare,
  ClipboardList,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Target,
  },
  {
    name: "Inquiries",
    href: "/inquiries",
    icon: ClipboardList,
  },
  {
    name: "Listings",
    href: "/listings",
    icon: Building2,
  },
  {
    name: "Canvassing",
    href: "/canvassing",
    icon: Route,
  },
  {
    name: "Properties",
    href: "/properties",
    icon: Briefcase,
  },

  {
    name: "Meetings",
    href: "/meetings",
    icon: Calendar,
  },
  {
    name: "Communications",
    href: "/communications",
    icon: MessageSquare,
  },

];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  mobileExpanded: boolean;
  setMobileExpanded: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileExpanded,
  setMobileExpanded,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        h-screen
        z-50
        bg-[#0e1526]
        border-r
        border-[#1B2445]
        transition-all
        duration-300
        ease-in-out
        flex
        flex-col

        /* MOBILE */
        ${
          mobileExpanded
            ? "w-[240px]"
            : "w-[72px]"
        }

        /* DESKTOP */
        ${
          collapsed
            ? "lg:w-[90px]"
            : "lg:w-[260px]"
        }
      `}
    >
      {/* HEADER */}
      <div
        className="
          h-20
          flex
          items-center
          justify-between
          px-4
          border-b
          border-[#1B2445]
        "
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="
              min-w-[44px]
              w-11
              h-11
              rounded-2xl
              bg-yellow-400
              flex
              items-center
              justify-center
              font-bold
              text-black
              shadow-lg
            "
          >
            GG
          </div>

          {/* MOBILE */}
          {mobileExpanded && (
            <div className="lg:hidden">
              <h1 className="text-white font-semibold text-base whitespace-nowrap">
                Genio CRM
              </h1>

              <p className="text-slate-400 text-xs whitespace-nowrap">
                Property System
              </p>
            </div>
          )}

          {/* DESKTOP */}
          {!collapsed && (
            <div className="hidden lg:block">
              <h1 className="text-white font-semibold text-lg whitespace-nowrap">
                Genio CRM
              </h1>

              <p className="text-slate-400 text-xs whitespace-nowrap">
                Property System
              </p>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() =>
            setMobileExpanded(!mobileExpanded)
          }
          className="
            lg:hidden
            text-slate-400
            hover:text-white
          "
        >
          {mobileExpanded ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        {/* DESKTOP TOGGLE */}
        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="
            hidden
            lg:flex
            text-slate-400
            hover:text-white
          "
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 py-6 px-2 overflow-y-auto">
        <div className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            const active =
              pathname === menu.href;

            return (
              <Link
                key={menu.name}
                href={menu.href}
                className={`
                  group
                  flex
                  items-center
                  rounded-2xl
                  transition-all
                  duration-200

                  ${
                    active
                      ? "bg-yellow-400/15 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.15)]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }

                  /* MOBILE */
                  ${
                    mobileExpanded
                      ? "px-4 py-4 gap-4 justify-start"
                      : "justify-center py-4"
                  }

                  /* DESKTOP */
                  ${
                    collapsed
                      ? "lg:justify-center"
                      : "lg:px-4 lg:py-4 lg:gap-4 lg:justify-start"
                  }
                `}
              >
                <Icon className="w-6 h-6 min-w-[24px]" />

                {/* MOBILE TEXT */}
                {mobileExpanded && (
                  <span className="lg:hidden font-medium text-sm whitespace-nowrap">
                    {menu.name}
                  </span>
                )}

                {/* DESKTOP TEXT */}
                {!collapsed && (
                  <span className="hidden lg:block font-medium text-sm whitespace-nowrap">
                    {menu.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-[#1B2445] p-4">
        <div
          className={`
            flex
            items-center

            /* MOBILE */
            ${
              mobileExpanded
                ? "gap-3 justify-start"
                : "justify-center"
            }

            /* DESKTOP */
            ${
              collapsed
                ? "lg:justify-center"
                : "lg:gap-3 lg:justify-start"
            }
          `}
        >
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-yellow-400
              flex
              items-center
              justify-center
              font-bold
              text-black
            "
          >
            G
          </div>

          {/* MOBILE */}
          {mobileExpanded && (
            <div className="lg:hidden">
              <p className="text-white text-sm font-semibold whitespace-nowrap">
                Gloria
              </p>

              <p className="text-slate-400 text-xs whitespace-nowrap">
                Property Agent
              </p>
            </div>
          )}

          {/* DESKTOP */}
          {!collapsed && (
            <div className="hidden lg:block">
              <p className="text-white text-sm font-semibold whitespace-nowrap">
                Gloria
              </p>

              <p className="text-slate-400 text-xs whitespace-nowrap">
                Property Agent
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}