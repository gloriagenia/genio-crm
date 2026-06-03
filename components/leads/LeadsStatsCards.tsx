"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BadgeCheck,
  CalendarClock,
  TrendingUp,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import StatCard from "@/components/cards/StatCard";

// =========================
// TYPES
// =========================

type LeadsStatsCardsProps = {

  refreshKey?: number;

  totalLeads?: number;

  followUpToday?: number;

  converted?: number;

  conversionRate?: number;
};

// =========================
// COMPONENT
// =========================

export default function LeadsStatsCards({

  refreshKey,

  totalLeads: totalLeadsProps,

  followUpToday: followUpTodayProps,

  converted: convertedProps,

  conversionRate: conversionRateProps,

}: LeadsStatsCardsProps) {

  // =========================
  // STATES
  // =========================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    totalLeads,
    setTotalLeads,
  ] = useState(
    totalLeadsProps || 0
  );

  const [
    followUpToday,
    setFollowUpToday,
  ] = useState(
    followUpTodayProps || 0
  );

  const [
    totalInquiry,
    setTotalInquiry,
  ] = useState(
    convertedProps || 0
  );

  const [
    conversionRate,
    setConversionRate,
  ] = useState(
    conversionRateProps || 0
  );

  // =========================
  // FETCH STATS
  // =========================

  async function fetchStats() {

    try {

      setLoading(true);

      // =========================
      // TODAY
      // =========================

      const today =
        new Date();

      const startToday =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        ).toISOString();

      const endToday =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59
        ).toISOString();

      // =========================
      // TOTAL LEADS
      // =========================

      const {
        count:
          totalLeadsCount,
      } = await supabase

        .from("leads")

        .select("*", {
          count: "exact",
          head: true,
        });

      // =========================
      // FOLLOW UP TODAY
      // =========================

      const {
        count:
          followUpTodayCount,
      } = await supabase

        .from("leads")

        .select("*", {
          count: "exact",
          head: true,
        })

        .gte(
          "next_followup",
          startToday
        )

        .lte(
          "next_followup",
          endToday
        );

      // =========================
      // TOTAL INQUIRY
      // =========================

      const {
        count:
          inquiryCount,
      } = await supabase

        .from("inquiries")

        .select("*", {
          count: "exact",
          head: true,
        });

      // =========================
      // SET STATES
      // =========================

      const leads =
        totalLeadsCount || 0;

      const inquiry =
        inquiryCount || 0;

      const rate =
        leads > 0
          ? Number(
              (
                (
                  inquiry /
                  leads
                ) * 100
              ).toFixed(1)
            )
          : 0;

      setTotalLeads(
        leads
      );

      setFollowUpToday(
        followUpTodayCount ||
          0
      );

      setTotalInquiry(
        inquiry
      );

      setConversionRate(
        rate
      );

    } catch (error) {

      console.error(
        "Fetch stats error:",
        error
      );

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {

    // =========================
    // IF PROPS EXISTS
    // USE PROPS
    // =========================

    if (
      totalLeadsProps !==
        undefined &&
      followUpTodayProps !==
        undefined &&
      convertedProps !==
        undefined &&
      conversionRateProps !==
        undefined
    ) {

      setTotalLeads(
        totalLeadsProps
      );

      setFollowUpToday(
        followUpTodayProps
      );

      setTotalInquiry(
        convertedProps
      );

      setConversionRate(
        conversionRateProps
      );

      return;
    }

    // =========================
    // OTHERWISE FETCH
    // =========================

    fetchStats();

  }, [
    refreshKey,

    totalLeadsProps,

    followUpTodayProps,

    convertedProps,

    conversionRateProps,
  ]);

  // =========================
  // RENDER
  // =========================

  return (

    <div
      className="
        grid
        grid-cols-1
        gap-4

        sm:grid-cols-2

        xl:grid-cols-4
      "
    >

      {/* TOTAL LEADS */}

      <StatCard
        title="Total Leads"

        value={totalLeads}

        subtitle="
          Total seluruh leads
          yang sudah dibuat
        "

        icon={Users}

        loading={loading}

        iconBgColor="
          bg-[#FFF8E1]
        "

        iconColor="
          text-[#D4A017]
        "

        tableName="leads"
      />

      {/* FOLLOW UP TODAY */}

      <StatCard
        title="Follow Up Today"

        value={
          followUpToday
        }

        subtitle="
          Leads yang perlu
          difollow up hari ini
        "

        icon={
          CalendarClock
        }

        loading={loading}

        iconBgColor="
          bg-[#FFF4D6]
        "

        iconColor="
          text-[#E0A500]
        "

        tableName="leads"

        filterLabel="
          next_followup
        "
      />

      {/* TOTAL INQUIRY */}

      <StatCard
        title="Converted Inquiry"

        value={
          totalInquiry
        }

        subtitle="
          Total inquiry hasil
          convert dari leads
        "

        icon={
          BadgeCheck
        }

        loading={loading}

        iconBgColor="
          bg-[#FFF7E8]
        "

        iconColor="
          text-[#C28B00]
        "

        tableName="
          inquiries
        "
      />

      {/* CONVERSION RATE */}

      <StatCard
        title="
          Conversion Rate
        "

        value={
          conversionRate
        }

        valueSuffix="%"

        subtitle="
          Persentase inquiry
          dibanding total leads
        "

        icon={
          TrendingUp
        }

        loading={loading}

        trend={
          conversionRate >= 20
            ? "up"
            : "neutral"
        }

        percentage={
          conversionRate
        }

        iconBgColor="
          bg-[#FFF9EB]
        "

        iconColor="
          text-[#C79200]
        "

        tableName="
          analytics
        "
      />

    </div>
  );
}