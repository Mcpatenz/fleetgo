import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  return NextResponse.json({
    data: {
      message: "Password reset request received",
    },
  });
}
