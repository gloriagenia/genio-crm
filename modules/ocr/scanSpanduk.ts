import { GoogleGenAI } from "@google/genai";

import type { ScanSpandukResult } from "./types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function scanSpanduk(
  file: File
): Promise<ScanSpandukResult> {
  const bytes = await file.arrayBuffer();

  const base64 = Buffer.from(bytes).toString("base64");

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",

    contents: [
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },

      {
        text: `
You are an OCR extraction engine.

Extract property banner information.

Return VALID JSON only.

{
  "owner_name": "",
  "phone": "",
  "property_type": "",
  "price": "",
  "land_size": "",
  "building_size": "",
  "address": "",
  "city": "",
  "district": ""
}
`,
      },
    ],
  });

  const rawText = result.text || "";

  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      owner_name: null,
      phone: null,
      property_type: null,
      price: null,
      land_size: null,
      building_size: null,
      address: null,
      city: null,
      district: null,
    };
  }
}