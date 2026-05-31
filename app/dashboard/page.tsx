"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import MainLayout from "@/components/layout/MainLayout";

import {
  AlertTriangle,
  Building2,
  ClipboardList,
  FileText,
  Flame,
  Home,
  Phone,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function DashboardPage() {

  // =========================
  // STATES
  // =========================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    summary,
    setSummary,
  ] = useState<any>({

    totalProperties: 0,

    activeListings: 0,

    totalLeads: 0,

    hotLeads: 0,

    overSLA: 0,

    activeInquiry: 0,

    totalContacts: 0,

    exclusiveProperties: 0,
  });

  const [
    overSLAData,
    setOverSLAData,
  ] = useState<any[]>([]);

  const [
    followupLeads,
    setFollowupLeads,
  ] = useState<any[]>([]);

  const [
    activeInquiries,
    setActiveInquiries,
  ] = useState<any[]>([]);

  const [
    pipeline,
    setPipeline,
  ] = useState<any[]>([]);

  // =========================
  // FETCH DASHBOARD
  // =========================

  async function fetchDashboard() {

    try {

      setLoading(true);

      // =========================
      // FETCH DATA
      // =========================

      const [

        propertiesRes,

        listingsRes,

        leadsRes,

        inquiriesRes,

        contactsRes,

      ] = await Promise.all([

        supabase

          .from("properties")

          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase

          .from("listing")

          .select("*", {
            count: "exact",
            head: true,
          })

          .eq(
            "listing_status",
            "Published"
          ),

        supabase

          .from("leads")

          .select(`
            *,
            contacts (
              name,
              phone
            ),
            lead_statuses (
              lead_status_name
            )
          `)

          .order(
            "next_followup",
            {
              ascending: true,
            }
          ),

        supabase

          .from("inquiries")

          .select(`
            *
          `)

          .neq(
            "inquiry_status",
            "Closed"
          )

          .order(
            "created_at",
            {
              ascending: false,
            }
          ),

        supabase

          .from("contacts")

          .select("*", {
            count: "exact",
            head: true,
          }),
      ]);

      const leads =
        leadsRes.data || [];

      const inquiries =
        inquiriesRes.data || [];

      // =========================
      // HOT LEADS
      // =========================

      const hotLeads =
        leads.filter(
          (item: any) =>
            item.priority ===
            "HOT"
        ).length;

      // =========================
      // OVER SLA
      // =========================

      const overSLA =
        leads.filter(
          (item: any) => {

            if (
              !item.last_contact
            )
              return true;

            const today =
              new Date();

            const last =
              new Date(
                item.last_contact
              );

            const diff =
              today.getTime() -
              last.getTime();

            const days =
              Math.floor(
                diff /
                  (1000 *
                    60 *
                    60 *
                    24)
              );

            return days > 3;
          }
        );

      // =========================
      // PIPELINE
      // =========================

      const grouped =
        leads.reduce(
          (
            acc: any,
            item: any
          ) => {

            const status =
              item
                .lead_statuses
                ?.lead_status_name ||
              "Unknown";

            acc[status] =
              (acc[status] || 0) +
              1;

            return acc;

          },
          {}
        );

      const pipelineData =
        Object.entries(
          grouped
        ).map(
          ([key, value]) => ({

            status: key,

            total: value,
          })
        );

      // =========================
      // SET STATE
      // =========================

      setSummary({

        totalProperties:
          propertiesRes.count || 0,

        activeListings:
          listingsRes.count || 0,

        totalLeads:
          leads.length || 0,

        hotLeads,

        overSLA:
          overSLA.length,

        activeInquiry:
          inquiries.length || 0,

        totalContacts:
          contactsRes.count || 0,

        exclusiveProperties: 0,
      });

      setOverSLAData(
        overSLA
      );

      setFollowupLeads(
        leads.filter(
          (item: any) =>
            item.next_followup
        )
      );

      setActiveInquiries(
        inquiries
      );

      setPipeline(
        pipelineData
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL
  // =========================

  useEffect(() => {

    fetchDashboard();

  }, []);

  // =========================
  // SUMMARY CARD
  // =========================

  function SummaryCard({
    title,
    value,
    icon,
    href,
  }: any) {

    return (

      <Link href={href}>

        <div
          className="
            bg-white
            border
            rounded-2xl
            p-5
            flex
            items-start
            justify-between
            hover:shadow-md
            hover:border-black
            transition
            cursor-pointer
          "
        >

          <div className="space-y-2">

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              {title}
            </div>

            <div
              className="
                text-3xl
                font-bold
              "
            >
              {value}
            </div>

          </div>

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-gray-100
              flex
              items-center
              justify-center
            "
          >
            {icon}
          </div>

        </div>

      </Link>
    );
  }

  return (

    <MainLayout>

      <div className="space-y-6">

        {/* HEADER */}

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Dashboard
          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            CRM Property Overview
          </p>

        </div>

        {/* LOADING */}

        {loading ? (

          <div
            className="
              bg-white
              border
              rounded-2xl
              p-10
              text-center
              text-gray-500
            "
          >
            Loading dashboard...
          </div>

        ) : (

          <>

            {/* SUMMARY */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-4
                gap-4
              "
            >

              <SummaryCard
                title="Total Properties"
                value={
                  summary.totalProperties
                }
                icon={
                  <Home size={22} />
                }
                href="/properties"
              />

              <SummaryCard
                title="Active Listings"
                value={
                  summary.activeListings
                }
                icon={
                  <Building2 size={22} />
                }
                href="/listing"
              />

              <SummaryCard
                title="Total Leads"
                value={
                  summary.totalLeads
                }
                icon={
                  <Users size={22} />
                }
                href="/leads"
              />

              <SummaryCard
                title="HOT Leads"
                value={
                  summary.hotLeads
                }
                icon={
                  <Flame size={22} />
                }
                href="/leads"
              />

              <SummaryCard
                title="Over SLA"
                value={
                  summary.overSLA
                }
                icon={
                  <AlertTriangle size={22} />
                }
                href="/leads"
              />

              <SummaryCard
                title="Active Inquiry"
                value={
                  summary.activeInquiry
                }
                icon={
                  <ClipboardList size={22} />
                }
                href="/inquiries"
              />

              <SummaryCard
                title="Contacts"
                value={
                  summary.totalContacts
                }
                icon={
                  <Phone size={22} />
                }
                href="/contacts"
              />

              <SummaryCard
                title="Exclusive Property"
                value={
                  summary.exclusiveProperties
                }
                icon={
                  <FileText size={22} />
                }
                href="/properties"
              />

            </div>

            {/* SECOND ROW */}

            <div
              className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-6
              "
            >

              {/* OVER SLA */}

              <div
                className="
                  bg-white
                  border
                  rounded-2xl
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <h2
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      Leads Over SLA
                    </h2>

                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Leads requiring immediate follow up
                    </p>

                  </div>

                  <Link
                    href="/leads"
                    className="
                      text-sm
                      font-medium
                      underline
                    "
                  >
                    View All
                  </Link>

                </div>

                <div className="space-y-3">

                  {overSLAData
                    .slice(0, 6)

                    .map(
                      (
                        item: any,
                        index
                      ) => {

                        const diff =
                          item.last_contact

                            ? Math.floor(
                                (
                                  new Date()
                                    .getTime() -

                                  new Date(
                                    item.last_contact
                                  ).getTime()
                                ) /

                                  (1000 *
                                    60 *
                                    60 *
                                    24)
                              )

                            : "-";

                        return (

                          <Link
                            href="/leads"
                            key={index}
                          >

                            <div
                              className="
                                border
                                rounded-xl
                                p-4
                                flex
                                items-center
                                justify-between
                                hover:bg-gray-50
                                transition
                                cursor-pointer
                              "
                            >

                              <div>

                                <div
                                  className="
                                    font-medium
                                  "
                                >
                                  {
                                    item
                                      .contacts
                                      ?.name
                                  }
                                </div>

                                <div
                                  className="
                                    text-xs
                                    text-gray-500
                                  "
                                >
                                  Last Contact:
                                  {" "}
                                  {diff}
                                  {" "}
                                  days ago
                                </div>

                              </div>

                              <span
                                className="
                                  bg-red-100
                                  text-red-700
                                  text-xs
                                  font-semibold
                                  px-3
                                  py-1
                                  rounded-full
                                "
                              >
                                OVER SLA
                              </span>

                            </div>

                          </Link>
                        );
                      }
                    )}

                </div>

              </div>

              {/* PIPELINE */}

              <div
                className="
                  bg-white
                  border
                  rounded-2xl
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <h2
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      Leads Pipeline
                    </h2>

                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Current leads distribution
                    </p>

                  </div>

                  <Link
                    href="/leads"
                    className="
                      text-sm
                      font-medium
                      underline
                    "
                  >
                    Open Leads
                  </Link>

                </div>

                <div className="space-y-3">

                  {pipeline.map(
                    (
                      item: any,
                      index
                    ) => (

                      <Link
                        href="/leads"
                        key={index}
                      >

                        <div
                          className="
                            border
                            rounded-xl
                            p-4
                            flex
                            items-center
                            justify-between
                            hover:bg-gray-50
                            transition
                            cursor-pointer
                          "
                        >

                          <div
                            className="
                              font-medium
                            "
                          >
                            {
                              item.status
                            }
                          </div>

                          <div
                            className="
                              text-xl
                              font-bold
                            "
                          >
                            {
                              item.total
                            }
                          </div>

                        </div>

                      </Link>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* THIRD ROW */}

            <div
              className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-6
              "
            >

              {/* FOLLOWUP */}

              <div
                className="
                  bg-white
                  border
                  rounded-2xl
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <h2
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      Leads To Be Followed Up
                    </h2>

                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Upcoming followup schedule
                    </p>

                  </div>

                  <Link
                    href="/leads"
                    className="
                      text-sm
                      font-medium
                      underline
                    "
                  >
                    View All
                  </Link>

                </div>

                <div className="space-y-3">

                  {followupLeads
                    .slice(0, 6)

                    .map(
                      (
                        item: any,
                        index
                      ) => {

                        const followupDate =
                          new Date(
                            item.next_followup
                          );

                        const today =
                          new Date();

                        const overdue =
                          followupDate <
                          today;

                        return (

                          <Link
                            href="/leads"
                            key={index}
                          >

                            <div
                              className="
                                border
                                rounded-xl
                                p-4
                                hover:bg-gray-50
                                transition
                                cursor-pointer
                                space-y-3
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-start
                                  justify-between
                                  gap-3
                                "
                              >

                                <div>

                                  <div
                                    className="
                                      font-medium
                                    "
                                  >
                                    {
                                      item
                                        .contacts
                                        ?.name
                                    }
                                  </div>

                                  <div
                                    className="
                                      text-xs
                                      text-gray-500
                                    "
                                  >
                                    Followup:
                                    {" "}
                                    {followupDate.toLocaleDateString(
                                      "id-ID"
                                    )}
                                  </div>

                                </div>

                                <span
                                  className={`
                                    text-xs
                                    font-semibold
                                    px-3
                                    py-1
                                    rounded-full

                                    ${
                                      overdue

                                        ? `
                                          bg-red-100
                                          text-red-700
                                        `

                                        : `
                                          bg-yellow-100
                                          text-yellow-700
                                        `
                                    }
                                  `}
                                >

                                  {overdue
                                    ? "Overdue"
                                    : "Upcoming"}

                                </span>

                              </div>

                              <div
                                className="
                                  text-sm
                                  text-gray-700
                                  line-clamp-2
                                "
                              >
                                {
                                  item.requirements ||
                                  "-"
                                }
                              </div>

                            </div>

                          </Link>
                        );
                      }
                    )}

                </div>

              </div>

              {/* ACTIVE INQUIRIES */}

              <div
                className="
                  bg-white
                  border
                  rounded-2xl
                  p-5
                  space-y-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <h2
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      Active Inquiries
                    </h2>

                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Inquiry still in progress
                    </p>

                  </div>

                  <Link
                    href="/inquiries"
                    className="
                      text-sm
                      font-medium
                      underline
                    "
                  >
                    View All
                  </Link>

                </div>

                <div className="space-y-3">

                  {activeInquiries
                    .slice(0, 6)

                    .map(
                      (
                        item: any,
                        index
                      ) => (

                        <Link
                          href="/inquiries"
                          key={index}
                        >

                          <div
                            className="
                              border
                              rounded-xl
                              p-4
                              hover:bg-gray-50
                              transition
                              cursor-pointer
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <div>

                              <div
                                className="
                                  font-medium
                                "
                              >
                                {
                                  item.client_name ||
                                  "Inquiry"
                                }
                              </div>

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                {
                                  item.property_type ||
                                  "-"
                                }
                              </div>

                            </div>

                            <span
                              className="
                                bg-blue-100
                                text-blue-700
                                text-xs
                                font-semibold
                                px-3
                                py-1
                                rounded-full
                              "
                            >
                              {
                                item.inquiry_status ||
                                "Open"
                              }
                            </span>

                          </div>

                        </Link>
                      )
                    )}

                </div>

              </div>

            </div>

          </>
        )}

      </div>

    </MainLayout>
  );
}