/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { getValidToken } from "@/lib/zoho-api";

// GET: Retrieve all leads
export async function GET() {
  try {
    const accessToken = await getValidToken();
    const response = await axios.get("https://www.zohoapis.com/crm/v8/Leads", {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      params: { fields: "id,First_Name,Last_Name,Email,Company,Phone" },
    });
    return NextResponse.json({ data: response.data.data });
  } catch (error: any) {
    return handleApiError(error);
  }
}

// POST: Create a new lead
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v8/Leads",
      { data: [body] },
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );

    const record = response.data.data[0];
    if (record.status === "error") throw record.message;

    // Retrieve the inserted record using its ID
    const recordId = record.details.id;
    const details = await axios.get(
      `https://www.zohoapis.com/crm/v8/Leads/${recordId}`,
      {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      }
    );

    return NextResponse.json({ success: true, record: details.data.data[0] });
  } catch (error: any) {
    return handleApiError(error);
  }
}

// Centralized Error Handling
function handleApiError(error: any) {
  const status = error.response?.status || 500;
  const message =
    error.response?.data?.message || error.message || "Unknown Error";
  return NextResponse.json({ message, status }, { status });
}
