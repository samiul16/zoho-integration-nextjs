import axios from "axios";
import { getTokens, setTokens } from "./token-store";

export async function getValidToken() {
  const { accessToken, refreshToken, expiresAt } = getTokens();

  if (Date.now() < expiresAt) return accessToken;

  // Token expired, refresh it
  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    null,
    {
      params: {
        grant_type: "refresh_token",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: refreshToken,
      },
    }
  );

  const { access_token, expires_in } = response.data;
  setTokens(access_token, refreshToken!, expires_in); // Keep same refresh token
  return access_token;
}
