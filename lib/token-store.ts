let accessToken: string | null = null;
let refreshToken: string | null = null;
let expiresAt: number = 0; // Timestamp in milliseconds

export const setTokens = (at: string, rt: string, expiresIn: number) => {
  accessToken = at;
  refreshToken = rt;
  expiresAt = Date.now() + expiresIn * 1000 - 60000; // Buffer 1 min
};

export const getTokens = () => ({ accessToken, refreshToken, expiresAt });
