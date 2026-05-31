export function extractPhone(
  text: string
) {

  // ====================
  // ONLY NUMBER + SPACE
  // ====================

  const cleaned =
    text.replace(
      /[^0-9]/g,
      " "
    );

  // ====================
  // FIND ALL POSSIBLE PHONE
  // ====================

  const matches =
    cleaned.match(
      /(08\d{8,12}|628\d{8,12})/g
    );

  if (!matches)
    return "";

  // ====================
  // SORT BY LENGTH
  // ====================

  const sorted =
    matches.sort(
      (a, b) =>
        a.length -
        b.length
    );

  // ====================
  // TAKE MOST REALISTIC
  // ====================

  let phone =
    sorted[0];

  // ====================
  // FIX EXTRA DIGIT
  // ====================

  if (
    phone.startsWith("08") &&
    phone.length > 12
  ) {

    phone =
      phone.slice(
        0,
        12
      );

  }

  if (
    phone.startsWith("628") &&
    phone.length > 13
  ) {

    phone =
      phone.slice(
        0,
        13
      );

  }

  return phone;

}