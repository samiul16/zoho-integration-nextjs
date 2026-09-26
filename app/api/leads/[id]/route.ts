import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/token-store";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const token = await getAccessToken();

  try {
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/Leads/${id}`,
      {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      }
    );

    console.log("response from id details", response.data);
    return NextResponse.json({ data: response.data.data[0] });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching lead" },
      { status: 500 }
    );
  }
}
