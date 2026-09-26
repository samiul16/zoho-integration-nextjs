import { cookies } from "next/headers";

export async function setTokens(at: string, rt: string, expires_in: number) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + expires_in * 1000);

  // Set the cookies
  cookieStore.set("zoho_access_token", at, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "lax", // Required for OAuth redirects
    path: "/",
    expires,
  });

  cookieStore.set("zoho_refresh_token", rt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("zoho_access_token")?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("zoho_refresh_token")?.value;
}
