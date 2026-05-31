export function normalizePhone(
  phone: string
) {

  return phone

    .replace(/\D/g, "")

    .replace(/^0/, "62")

    .replace(/^620/, "62");
}