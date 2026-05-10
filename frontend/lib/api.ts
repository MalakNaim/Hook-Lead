import { getAccessToken } from '@/lib/auth';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5057';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const method = options.method ?? 'GET';
  const url = `${BASE_URL}${path}`;

  console.log(`[apiFetch] ${method} ${url} | BASE_URL=${BASE_URL} | auth=${token ? 'yes' : 'none'}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    const msg = networkErr instanceof Error ? networkErr.message : String(networkErr);
    console.error(`[apiFetch] Network error on ${method} ${url}:`, msg);
    // "Load failed" in Safari = connection refused or CORS preflight blocked.
    // Check: is the backend running at ${BASE_URL}? Are CORS headers set for this origin?
    throw new ApiError(
      0,
      `Cannot reach server (${msg}). Is the backend running at ${BASE_URL}?`,
    );
  }

  console.log(`[apiFetch] ${res.status} ${res.statusText} — ${method} ${url}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error(`[apiFetch] Error body:`, body);
    throw new ApiError(res.status, body.error ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}
