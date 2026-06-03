import { API_BASE_URL, API_PREFIX } from './config';
import { getItem, setItem, deleteItem } from './storage';

const TOKEN_KEY = 'voluntariapp_token';

let cachedToken: string | null | undefined = undefined;

export async function getToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken;
  const v = await getItem(TOKEN_KEY);
  cachedToken = v;
  return v;
}

export async function setToken(token: string): Promise<void> {
  cachedToken = token;
  await setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  cachedToken = null;
  await deleteItem(TOKEN_KEY);
}

export interface ApiError extends Error {
  status: number;
  payload?: any;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Skip Authorization header even if a token is stored. */
  noAuth?: boolean;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;
}

export async function request<T = any>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { body, query, noAuth, headers, ...rest } = opts;

  const url = buildUrl(`${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`, query);

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (!noAuth) {
    const token = await getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const err = new Error(
      (payload && typeof payload === 'object' && payload.error) ||
        `Request failed with status ${res.status}`,
    ) as ApiError;
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload as T;
}

export const api = {
  get: <T = any>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T = any>(path: string, body?: any, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T = any>(path: string, body?: any, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  delete: <T = any>(path: string, body?: any, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: 'DELETE', body }),
};

export { API_BASE_URL };
