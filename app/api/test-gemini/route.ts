import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET() {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello",
    });

    return NextResponse.json({
      success: true,
      text: result.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error,
    });
  }
}