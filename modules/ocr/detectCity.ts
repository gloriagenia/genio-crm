export function detectCity(
  text: string
) {

  const lower =
    text.toLowerCase();

  if (
    lower.includes(
      "jakarta"
    )
  ) {
    return "Jakarta";
  }

  if (
    lower.includes(
      "bekasi"
    )
  ) {
    return "Bekasi";
  }

  if (
    lower.includes(
      "bogor"
    )
  ) {
    return "Bogor";
  }

  if (
    lower.includes(
      "depok"
    )
  ) {
    return "Depok";
  }

  return "";

}