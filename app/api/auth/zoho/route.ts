import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.ZOHO_CLIENT_ID!,
    redirect_uri: process.env.ZOHO_REDIRECT_URI!,
    scope:
      "ZohoCRM.modules.leads.READ,ZohoCRM.modules.leads.CREATE,ZohoCRM.settings.READ," +
      "ZohoCRM.modules.accounts.READ,ZohoCRM.modules.accounts.CREATE," +
      "ZohoCRM.modules.contacts.READ,ZohoCRM.modules.contacts.CREATE",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`
  );
}
