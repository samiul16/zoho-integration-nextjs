/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { getValidToken } from "@/lib/zoho-api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  try {
    const accessToken = await getValidToken();
    const response = await axios.get(
      "https://www.zohoapis.com/crm/v8/Accounts",
      {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        params: {
          fields: "id,Account_Name,Phone,Website,Email",
          page,
          per_page: 20,
        },
      }
    );
    return NextResponse.json({
      data: response.data.data,
      info: response.data.info,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v8/Accounts",
      { data: [body] },
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );

    return NextResponse.json({
      success: true,
      record: response.data.data[0].details,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
