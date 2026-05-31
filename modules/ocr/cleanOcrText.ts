// modules/ocr/cleanOcrText.ts

export function cleanOcrText(
  text: string
) {

  const lines =
    text
      .split("\n")
      .map((line) =>
        line.trim()
      )
      .filter(Boolean);

  const cleaned =
    lines.filter((line) => {

      const normalized =
        line.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );

      // ======================
      // PHONE PRIORITY
      // ======================

      const hasPhone =
        /(08|62)\d{8,}/.test(
          normalized
        );

      if (hasPhone) {
        return true;
      }

      // ======================
      // TOO SHORT
      // ======================

      if (
        normalized.length < 5
      ) {
        return false;
      }

      // ======================
      // TOO MANY SYMBOLS
      // ======================

      const weirdChars =
        (
          line.match(
            /[^a-zA-Z0-9\s]/g
          ) || []
        ).length;

      if (
        weirdChars >
        line.length * 0.2
      ) {
        return false;
      }

      // ======================
      // MUST CONTAIN VOWEL
      // ======================

      const vowelCount =
        (
          line.match(
            /[aiueo]/gi
          ) || []
        ).length;

      if (
        vowelCount <= 1
      ) {
        return false;
      }

      // ======================
      // IMPORTANT KEYWORDS
      // ======================

      const lower =
        line.toLowerCase();

      const keywords = [

        "jual",
        "dijual",

        "sewa",
        "disewa",

        "rumah",
        "ruko",
        "tanah",
        "apartemen",

        "hubungi",

        "luas",
        "lt",
        "lb",

        "shm",
        "hgb",

        "tanpa perantara",

      ];

      const hasKeyword =
        keywords.some(
          (keyword) =>
            lower.includes(
              keyword
            )
        );

      return hasKeyword;

    });

  return cleaned
    .map((line) =>
      line
        .replace(
          /^[^a-zA-Z0-9+]+/,
          ""
        )
        .replace(
          /\s{2,}/g,
          " "
        )
        .trim()
    )

    // REMOVE DUPLICATE

    .filter(
      (
        line,
        index,
        self
      ) =>
        self.indexOf(
          line
        ) === index
    )

    .join("\n");

}