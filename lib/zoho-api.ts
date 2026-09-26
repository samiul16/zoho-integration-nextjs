import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens } from "./token-store";

export async function getValidToken() {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken) return accessToken;

  console.log("Token expired, refreshing...");

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
  console.log("New access token:", access_token);
  setTokens(access_token, refreshToken!, expires_in); // Keep same refresh token
  return access_token;
}
