/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { getValidToken } from "@/lib/zoho-api";

export async function GET() {
  try {
    const accessToken = await getValidToken();
    const response = await axios.get(
      "https://www.zohoapis.com/crm/v8/Accounts",
      {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        params: { fields: "id,Account_Name" },
      }
    );
    return NextResponse.json({ data: response.data.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
