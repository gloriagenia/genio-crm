// =========================
// src/utils/formatPhone.ts
// =========================

// =========================
// NORMALIZE PHONE
// =========================

export function normalizePhone(
  phone?: string | null
) {
  // =========================
  // EMPTY
  // =========================

  if (!phone) {
    return "";
  }

  // =========================
  // REMOVE NON NUMBER
  // =========================

  let cleanPhone =
    phone.replace(/\D/g, "");

  // =========================
  // 0812xxxx -> 62812xxxx
  // =========================

  if (
    cleanPhone.startsWith("0")
  ) {
    cleanPhone =
      "62" +
      cleanPhone.slice(1);
  }

  // =========================
  // 812xxxx -> 62812xxxx
  // =========================

  if (
    cleanPhone.startsWith("8")
  ) {
    cleanPhone =
      "62" + cleanPhone;
  }

  // =========================
  // FALLBACK
  // =========================

  if (
    !cleanPhone.startsWith("62")
  ) {
    cleanPhone =
      "62" + cleanPhone;
  }

  return cleanPhone;
}

// =========================
// FORMAT PHONE DISPLAY
// =========================

export function formatPhone(
  phone?: string | null
) {
  // =========================
  // EMPTY
  // =========================

  if (!phone) {
    return "-";
  }

  // =========================
  // NORMALIZE
  // =========================

  const normalized =
    normalizePhone(phone);

  // =========================
  // INVALID
  // =========================

  if (!normalized) {
    return "-";
  }

  // =========================
  // FORMAT +62
  // =========================

  if (
    normalized.startsWith("62")
  ) {
    const number =
      normalized.slice(2);

    // =========================
    // GROUPING
    // =========================

    const chunks =
      number.match(
        /.{1,4}/g
      ) || [];

    return `+62 ${chunks.join(
      " "
    )}`;
  }

  return normalized;
}

// =========================
// FORMAT SHORT PHONE
// =========================

export function formatShortPhone(
  phone?: string | null
) {
  if (!phone) {
    return "-";
  }

  const normalized =
    normalizePhone(phone);

  if (
    normalized.length <= 8
  ) {
    return normalized;
  }

  return `${normalized.slice(
    0,
    6
  )}****${normalized.slice(
    -3
  )}`;
}

// =========================
// FORMAT WHATSAPP URL
// =========================

export function formatWhatsAppUrl(
  phone?: string | null
) {
  if (!phone) {
    return "";
  }

  const normalized =
    normalizePhone(phone);

  return `https://wa.me/${normalized}`;
}

// =========================
// VALIDATE PHONE
// =========================

export function isValidPhone(
  phone?: string | null
) {
  if (!phone) {
    return false;
  }

  const normalized =
    normalizePhone(phone);

  // =========================
  // BASIC VALIDATION
  // =========================

  return (
    normalized.length >=
      10 &&
    normalized.length <=
      15
  );
}

// =========================
// FORMAT INPUT PHONE
// =========================

export function formatPhoneInput(
  value: string
) {
  // =========================
  // REMOVE NON DIGIT
  // =========================

  const clean =
    value.replace(/\D/g, "");

  // =========================
  // SPLIT CHUNKS
  // =========================

  const chunks =
    clean.match(/.{1,4}/g) ||
    [];

  return chunks.join(" ");
}

// =========================
// GET PHONE PROVIDER
// =========================

export function getPhoneProvider(
  phone?: string | null
) {
  if (!phone) {
    return "Unknown";
  }

  const normalized =
    normalizePhone(phone);

  // =========================
  // REMOVE 62
  // =========================

  const local =
    normalized.replace(
      /^62/,
      ""
    );

  // =========================
  // PREFIX CHECK
  // =========================

  const prefix =
    local.slice(0, 3);

  // =========================
  // TELKOMSEL
  // =========================

  if (
    [
      "811",
      "812",
      "813",
      "821",
      "822",
      "823",
      "851",
      "852",
      "853",
    ].includes(prefix)
  ) {
    return "Telkomsel";
  }

  // =========================
  // XL
  // =========================

  if (
    [
      "817",
      "818",
      "819",
      "859",
      "877",
      "878",
    ].includes(prefix)
  ) {
    return "XL";
  }

  // =========================
  // INDOSAT
  // =========================

  if (
    [
      "814",
      "815",
      "816",
      "855",
      "856",
      "857",
      "858",
    ].includes(prefix)
  ) {
    return "Indosat";
  }

  // =========================
  // TRI
  // =========================

  if (
    [
      "895",
      "896",
      "897",
      "898",
      "899",
    ].includes(prefix)
  ) {
    return "Tri";
  }

  // =========================
  // SMARTFREN
  // =========================

  if (
    [
      "881",
      "882",
      "883",
      "884",
      "885",
      "886",
      "887",
      "888",
      "889",
    ].includes(prefix)
  ) {
    return "Smartfren";
  }

  return "Unknown";
}