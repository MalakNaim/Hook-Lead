const TOKEN_KEY = 'hl_access_token';
const REFRESH_KEY = 'hl_refresh_token';

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  // Mirror in a cookie so middleware can read it for server-side redirects.
  document.cookie = `hl_token=1; path=/; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  document.cookie = 'hl_token=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
