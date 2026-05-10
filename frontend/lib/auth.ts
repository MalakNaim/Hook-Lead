const TOKEN_KEY = 'hl_access_token';
const REFRESH_KEY = 'hl_refresh_token';

export function saveTokens(accessToken: string, refreshToken?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[auth] accessToken exists:', accessToken ? 'YES' : 'NO');
  }

  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[auth] localStorage written: YES');
  }

  document.cookie = `hl_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

  if (process.env.NODE_ENV === 'development') {
    console.log('[auth] cookie written: YES');
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  document.cookie = 'hl_token=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
