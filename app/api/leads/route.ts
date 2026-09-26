/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { getValidToken } from "@/lib/zoho-api";

// GET: Retrieve all leads
export async function GET() {
  try {
    const accessToken = await getValidToken();

    const response = await axios.get("https://www.zohoapis.com/crm/v8/Leads", {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      params: {
        fields: "id,First_Name,Last_Name,Email,Company,Phone",
      },
    });

    return NextResponse.json({
      data: response.data.data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST: Create a new lead
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    // Check if lead already exists by email
    const searchResponse = await axios.get(
      "https://www.zohoapis.com/crm/v8/Leads/search",
      {
        params: {
          email: body.Email,
        },
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    const existingLeads = searchResponse.data.data || [];

    if (existingLeads.length > 0) {
      return NextResponse.json(
        {
          success: false,
          code: "DUPLICATE_EMAIL",
          message: "A lead with this email already exists.",
          record: existingLeads[0],
        },
        { status: 409 }
      );
    }

    // Create lead
    const response = await axios.post(
      "https://www.zohoapis.com/crm/v8/Leads",
      {
        data: [body],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    const record = response.data.data[0];
    const recordId = record.details.id;

    // Retrieve the newly created lead
    const details = await axios.get(
      `https://www.zohoapis.com/crm/v8/Leads/${recordId}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      record: details.data.data[0],
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Centralized Error Handling
function handleApiError(error: any) {
  const status = error.response?.status || 500;

  const zohoError = error.response?.data?.data?.[0];

  const code =
    zohoError?.code || error.response?.data?.code || "INTERNAL_SERVER_ERROR";

  const message =
    zohoError?.message ||
    error.response?.data?.message ||
    error.message ||
    "Unknown Error";

  console.error("API Error:", {
    status,
    code,
    message,
  });

  return NextResponse.json(
    {
      success: false,
      code,
      message,
    },
    { status }
  );
}
