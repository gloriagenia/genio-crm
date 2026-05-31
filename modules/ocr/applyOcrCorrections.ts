// modules/ocr/applyOcrCorrections.ts

import {
  OCR_CORRECTIONS,
} from "./ocrDictionary";

function escapeRegex(
  text: string
) {

  return text.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

}

export function applyOcrCorrections(
  text: string
) {

  let result = text;

  Object.entries(
    OCR_CORRECTIONS
  ).forEach(
    ([wrong, correct]) => {

      const escapedWrong =
        escapeRegex(
          wrong
        );

      const regex =
        new RegExp(
          `\\b${escapedWrong}\\b`,
          "gi"
        );

      result =
        result.replace(
          regex,
          correct
        );

    }
  );

  return result;

}