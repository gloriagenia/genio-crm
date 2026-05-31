// modules/ocr/extractPropertyData.ts

export function extractPropertyData(
  text: string
) {

  const upper =
    text.toUpperCase();

  // ======================
  // PROPERTY TYPE
  // ======================

  let propertyType = "";

  if (
    upper.includes("RUMAH")
  ) {
    propertyType =
      "Rumah";
  }

  else if (
    upper.includes("RUKO")
  ) {
    propertyType =
      "Ruko";
  }

  else if (
    upper.includes("TANAH")
  ) {
    propertyType =
      "Tanah";
  }

  else if (
    upper.includes(
      "APARTEMEN"
    )
  ) {
    propertyType =
      "Apartemen";
  }

  // ======================
  // PHONE
  // ======================

  const phoneMatch =
    text.match(
      /(?:\+62|62|08)[0-9\s-]{8,20}/
    );

  let phone = "";

  if (phoneMatch) {

    phone =
      phoneMatch[0]
        .replace(
          /[^0-9]/g,
          ""
        );

    // FIX DOUBLE NUMBER

    if (
      phone.startsWith(
        "6208"
      )
    ) {
      phone =
        "08" +
        phone.slice(4);
    }

    // LIMIT MAX LENGTH

    if (
      phone.length > 13
    ) {
      phone =
        phone.slice(0, 12);
    }

  }

  return {

    property_type:
      propertyType,

    phone,

  };

}