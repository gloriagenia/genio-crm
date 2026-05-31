import { NextRequest, NextResponse } from "next/server";
import { scanSpanduk } from "@/modules/ocr";

const MOCK_MODE = false;

export const runtime = "nodejs";

export async function POST(
  req: NextRequest
) {
  try {
    const formData =
      await req.formData();

    const file =
      formData.get("file") as File;

    // =========================
    // NO FILE
    // =========================
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // MOCK MODE
    // =========================
    if (MOCK_MODE) {
      return NextResponse.json({
        success: true,

        data: {
          owner_name:
            "Bapak Rumah",

          phone:
            "081296033411",

          property_type:
            "Rumah",

          price:
            "1500000000",

          land_size:
            "292",

          building_size:
            "125",

          address:
            "Jl Contoh",

          district:
            "Tebet",

          city:
            "Jakarta Selatan",
        },
      });
    }

    // =========================
    // REAL OCR
    // =========================
    const data =
      await scanSpanduk(file);

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "OCR Failed",
      },
      {
        status: 500,
      }
    );
  }
}