export function detectPropertyType(
  text: string
) {

  const lower =
    text.toLowerCase();

  if (
    lower.includes("ruko")
  ) {
    return "Ruko";
  }

  if (
    lower.includes("rumah")
  ) {
    return "Rumah";
  }

  if (
    lower.includes("tanah")
  ) {
    return "Tanah";
  }

  if (
    lower.includes(
      "apartemen"
    )
  ) {
    return "Apartemen";
  }

  return "";

}