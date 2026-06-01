import MainLayout from "@/components/layout/MainLayout";

import DashboardHeader from "@/components/dashboard/DashboardHeader";

import StatsCard from "@/components/dashboard/StatsCard";

import ActivityCard from "@/components/dashboard/ActivityCard";

import PerformanceChart from "@/components/dashboard/PerformanceChart";

import {
  Calendar,
  Users,
  Building2,
  Handshake,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
  // ========================================
  // TODAY DATE
  // ========================================

  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).toISOString();

  const endOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  ).toISOString();

  // ========================================
  // APPOINTMENTS TODAY
  // ========================================

  const {
    count: appointmentsTodayCount,
  } = await supabase
    .from("followups")
    .select("*", {
      count: "exact",
      head: true,
    })
    .in("followup_type", [
      "meeting",
      "viewing",
      "survey",
    ])
    .eq("status", "pending")
    .gte("followup_date", startOfToday)
    .lt("followup_date", endOfToday);

  // ========================================
  // FOLLOWUP LEADS
  // ========================================

  const {
    count: followupLeadsCount,
  } = await supabase
    .from("followups")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("source_type", "lead")
    .eq("status", "pending")
    .gte("followup_date", startOfToday)
    .lt("followup_date", endOfToday);

  // ========================================
  // FOLLOWUP INQUIRIES
  // ========================================

  const {
    count: followupInquiryCount,
  } = await supabase
    .from("followups")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("source_type", "inquiry")
    .eq("status", "pending")
    .gte("followup_date", startOfToday)
    .lt("followup_date", endOfToday);

  // ========================================
  // ACTIVE DEALS
  // ========================================

  const {
    count: activeDealsCount,
  } = await supabase
    .from("inquiries")
    .select("*", {
      count: "exact",
      head: true,
    })
    .in("deal_status", [
      "in_progress",
      "won",
    ]);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* ======================================== */}
        {/* DASHBOARD HEADER */}
        {/* ======================================== */}

        <DashboardHeader />

        {/* ======================================== */}
        {/* STATS CARDS */}
        {/* ======================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >
          {/* APPOINTMENTS TODAY */}
          <StatsCard
            title="Appointments Today"
            value={
              appointmentsTodayCount || 0
            }
            subtitle="Meeting, viewing & survey hari ini"
            icon={Calendar}
            href="/followups"
          />

          {/* FOLLOWUP LEADS */}
          <StatsCard
            title="Followup Leads"
            value={
              followupLeadsCount || 0
            }
            subtitle="Lead yang perlu di-follow up"
            icon={Users}
            href="/leads"
          />

          {/* FOLLOWUP INQUIRIES */}
          <StatsCard
            title="Followup Inquiry"
            value={
              followupInquiryCount || 0
            }
            subtitle="Inquiry aktif hari ini"
            icon={Building2}
            href="/inquiries"
          />

          {/* ACTIVE DEALS */}
          <StatsCard
            title="Deals"
            value={activeDealsCount || 0}
            subtitle="Deal ongoing & won"
            icon={Handshake}
            href="/deals"
          />
        </div>

        {/* ======================================== */}
        {/* CONTENT SECTION */}
        {/* ======================================== */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >
          {/* TODAY ACTIVITIES */}
          <ActivityCard />

          {/* PIPELINE LEADS */}
          <PerformanceChart />
        </div>
      </div>
    </MainLayout>
  );
}