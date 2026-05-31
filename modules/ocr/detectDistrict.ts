export function detectDistrict(
  text: string
) {

  const lower =
    text.toLowerCase();

  if (
    lower.includes(
      "tebet"
    )
  ) {
    return "Tebet";
  }

  if (
    lower.includes(
      "kemang"
    )
  ) {
    return "Kemang";
  }

  if (
    lower.includes(
      "tambun"
    )
  ) {
    return "Tambun";
  }

  if (
    lower.includes(
      "cilandak"
    )
  ) {
    return "Cilandak";
  }

  if (
    lower.includes(
      "pejaten"
    )
  ) {
    return "Pejaten";
  }

  return "";

}