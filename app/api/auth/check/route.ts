import { getAccessToken } from "@/lib/token-store";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getAccessToken();
  console.log("token in check route", token);
  if (token) return new NextResponse(null, { status: 200 });
  return new NextResponse(null, { status: 401 });
}
