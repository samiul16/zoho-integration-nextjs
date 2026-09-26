/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { setTokens } from "@/lib/token-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { message: "Authorization code missing" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          redirect_uri: process.env.ZOHO_REDIRECT_URI,
          code,
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    console.log("Client ID:", process.env.ZOHO_CLIENT_ID);
    console.log("Client Secret:", process.env.ZOHO_CLIENT_SECRET);
    console.log("Redirect URI:", process.env.ZOHO_REDIRECT_URI);

    // TODO: Implement secure storage (e.g., Database or Encrypted Cookie)
    // For now, let's log them to verify the flow
    console.log("Tokens received:", { access_token, refresh_token });

    await setTokens(access_token, refresh_token, response.data.expires_in);

    // Construct the absolute URL to your home page
    const homeUrl = new URL("/", req.url);

    // Redirect
    return NextResponse.redirect(homeUrl);
  } catch (error: any) {
    console.error("OAuth Error:", error.response?.data || error.message);
    return NextResponse.json({ message: "OAuth failed" }, { status: 500 });
  }
}
