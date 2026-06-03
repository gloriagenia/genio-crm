// ========================================
// FILE:
// src/utils/openWhatsApp.ts
// ========================================

"use client";

import { supabase } from "@/lib/supabase";

import {
  normalizePhone,
  formatWhatsAppUrl,
} from "@/src/utils/formatPhone";

// ========================================
// TYPES
// ========================================

export type OpenWhatsAppParams = {
  phone?: string | null;

  contactId?: string | null;

  contactName?: string | null;

  source?: string;

  updateContact?: boolean;

  createActivity?: boolean;

  autoUpdateStatus?: boolean;

  message?: string;
};

// ========================================
// DEFAULT FOLLOWUP MESSAGE
// ========================================

export function buildFollowupMessage(
  name?: string
) {
  return `Halo ${
    name || "Bapak/Ibu"
  }, saya Gloria 😊

Beberapa waktu lalu kita sempat diskusi terkait properti.

Saya izin follow up kembali, apakah saat ini masih ada kebutuhan beli, sewa, atau jual properti?`;
}

// ========================================
// CREATE ACTIVITY
// ========================================

async function createWhatsAppActivity({
  contactId,
  source,
}: {
  contactId?: string | null;

  source?: string;
}) {
  try {
    // =========================
    // VALIDATION
    // =========================

    if (!contactId) {
      return;
    }

    const now =
      new Date().toISOString();

    // =========================
    // INSERT ACTIVITY
    // =========================

    const { error } =
      await supabase
        .from("activities")
        .insert([
          {
            contact_id:
              contactId,

            activity_type:
              "WHATSAPP_OPENED",

            title:
              "WhatsApp Opened",

            notes: source
              ? `WhatsApp opened from ${source}`
              : "WhatsApp opened",

            activity_date:
              now,

            created_at:
              now,
          },
        ]);

    // =========================
    // ERROR
    // =========================

    if (error) {
      console.log(
        "CREATE ACTIVITY ERROR",
        error
      );
    }
  } catch (error) {
    console.log(
      "CREATE ACTIVITY CATCH ERROR",
      error
    );
  }
}

// ========================================
// UPDATE CONTACT
// ========================================

async function updateContactAfterWA({
  contactId,
  autoUpdateStatus = true,
}: {
  contactId?: string | null;

  autoUpdateStatus?: boolean;
}) {
  try {
    // =========================
    // VALIDATION
    // =========================

    if (!contactId) {
      return;
    }

    // =========================
    // GET CURRENT CONTACT
    // =========================

    const {
      data: currentContact,
      error: fetchError,
    } = await supabase
      .from("contacts")
      .select(`
        contact_id,
        status,
        contact_attempted_at
      `)
      .eq(
        "contact_id",
        contactId
      )
      .single();

    // =========================
    // FETCH ERROR
    // =========================

    if (fetchError) {
      console.log(
        "FETCH CONTACT ERROR",
        fetchError
      );

      return;
    }

    const now =
      new Date().toISOString();

    // =========================
    // PAYLOAD
    // =========================

    const payload: any = {
      last_whatsapp_opened_at:
        now,

      last_contacted_at:
        now,

      updated_at:
        now,
    };

    // =========================
    // ONLY SET FIRST ATTEMPT
    // =========================

    if (
      !currentContact?.contact_attempted_at
    ) {
      payload.contact_attempted_at =
        now;
    }

    // =========================
    // AUTO UPDATE STATUS
    // =========================

    if (
      autoUpdateStatus &&
      currentContact?.status ===
        "New"
    ) {
      payload.status =
        "Contacted";
    }

    // =========================
    // UPDATE CONTACT
    // =========================

    const { error } =
      await supabase
        .from("contacts")
        .update(payload)
        .eq(
          "contact_id",
          contactId
        );

    // =========================
    // ERROR
    // =========================

    if (error) {
      console.log(
        "UPDATE CONTACT ERROR",
        error
      );
    }
  } catch (error) {
    console.log(
      "UPDATE CONTACT CATCH ERROR",
      error
    );
  }
}

// ========================================
// MAIN FUNCTION
// ========================================

export async function openWhatsApp({
  phone,
  contactId,
  contactName,
  source = "Unknown Source",
  updateContact = true,
  createActivity = true,
  autoUpdateStatus = true,
  message,
}: OpenWhatsAppParams) {
  try {
    // =========================
    // VALIDATION
    // =========================

    if (!phone) {
      console.log(
        "Phone number not found"
      );

      return;
    }

    // =========================
    // NORMALIZE PHONE
    // =========================

    const cleanPhone =
      normalizePhone(phone);

    // =========================
    // INVALID PHONE
    // =========================

    if (!cleanPhone) {
      console.log(
        "Invalid phone number"
      );

      return;
    }

    // =========================
    // GENERATE URL
    // =========================

    let whatsappUrl =
      formatWhatsAppUrl(
        cleanPhone
      );

    // =========================
    // AUTO MESSAGE
    // =========================

    const finalMessage =
      message ||
      buildFollowupMessage(
        contactName || ""
      );

    // =========================
    // WITH MESSAGE
    // =========================

    if (finalMessage) {
      whatsappUrl += `?text=${encodeURIComponent(
        finalMessage
      )}`;
    }

    // =========================
    // OPEN WHATSAPP
    // =========================

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    // =========================
    // UPDATE CONTACT
    // =========================

    if (
      updateContact &&
      contactId
    ) {
      await updateContactAfterWA({
        contactId,
        autoUpdateStatus,
      });
    }

    // =========================
    // CREATE ACTIVITY
    // =========================

    if (
      createActivity &&
      contactId
    ) {
      await createWhatsAppActivity({
        contactId,
        source,
      });
    }
  } catch (error) {
    console.log(
      "OPEN WHATSAPP ERROR",
      error
    );
  }
}