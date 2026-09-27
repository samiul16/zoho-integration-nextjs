/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { getValidToken } from "@/lib/zoho-api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const perPage = "20"; // Zoho limit is usually 200

  try {
    const accessToken = await getValidToken();
    const response = await axios.get(
      "https://www.zohoapis.com/crm/v8/Contacts",
      {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        params: {
          fields: "id,First_Name,Last_Name,Email,Phone,Account_Name",
          page: page,
          per_page: perPage,
        },
      }
    );
    return NextResponse.json({
      data: response.data.data,
      info: response.data.info, // Zoho returns pagination info here
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    // Check duplicate
    const searchResponse = await axios.get(
      "https://www.zohoapis.com/crm/v8/Contacts/search",
      {
        params: { email: body.Email },
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      }
    );

    if ((searchResponse.data.data || []).length > 0) {
      return NextResponse.json(
        { success: false, code: "DUPLICATE_EMAIL" },
        { status: 409 }
      );
    }

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v8/Contacts",
      { data: [body] },
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );

    return NextResponse.json({
      success: true,
      record: response.data.data[0].details,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

function handleApiError(error: any) {
  const status = error.response?.status || 500;
  return NextResponse.json(
    { success: false, message: error.message },
    { status }
  );
}
