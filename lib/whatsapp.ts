import { supabase } from "@/lib/supabase";

// ========================================
// TYPES
// ========================================

export type WATemplate = {
  id: number;
  title: string;
  category: string;
  message: string;
  contact_type?: string;
  source_module?: string;
  pipeline_stage?: string;
  is_active?: boolean;
};

// ========================================
// GET ACTIVE TEMPLATE
// ========================================

export async function getWhatsAppTemplate(
  category: string
): Promise<WATemplate | null> {
  const { data, error } =
    await supabase
      .from("wa_templates")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .limit(1)
      .single();

  if (error) {
    console.error(
      "Failed loading WA template:",
      error
    );

    return null;
  }

  return data as WATemplate;
}

// ========================================
// APPLY VARIABLES
// ========================================

export function applyTemplateVariables(
  template: string,
  data: Record<string, any>
) {
  let result = template;

  Object.entries(data).forEach(
    ([key, value]) => {
      result = result.replaceAll(
        `{{${key}}}`,
        value?.toString() || ""
      );
    }
  );

  return result;
}

// ========================================
// FORMAT PHONE
// ========================================

export function formatPhone(
  phone?: string
) {
  if (!phone) return "";

  let cleaned = phone.replace(
    /\D/g,
    ""
  );

  if (
    cleaned.startsWith("0")
  ) {
    cleaned =
      "62" +
      cleaned.substring(1);
  }

  return cleaned;
}

// ========================================
// OPEN WHATSAPP
// ========================================

export async function openWhatsAppTemplate(
  category: string,
  phone: string,
  variables: Record<
    string,
    any
  >
) {
  try {
    const template =
      await getWhatsAppTemplate(
        category
      );

    if (!template) {
      alert(
        "Template WhatsApp tidak ditemukan"
      );

      return;
    }

    const message =
      applyTemplateVariables(
        template.message,
        variables
      );

    const formattedPhone =
      formatPhone(phone);

    const url =
      `https://wa.me/${formattedPhone}?text=` +
      encodeURIComponent(
        message
      );

    window.open(
      url,
      "_blank"
    );
  } catch (err) {
    console.error(err);

    alert(
      "Gagal membuka WhatsApp"
    );
  }
}