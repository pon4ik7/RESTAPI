import { API_BASE_URL, USE_MOCKS } from '@/lib/constants/env';
import { handleMockRequest } from '@/lib/mocks/mock-api';
import { authTokensSchema } from '@/types/models';

import { ApiError, toApiError, type ApiErrorBody } from './errors';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './token-storage';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions<TBody> = {
  method?: HttpMethod;
  body?: TBody;
  query?: Record<string, string | number | undefined | null>;
  auth?: boolean;
  _retry?: boolean;
};

function pathWithQuery(path: string, query?: RequestOptions<unknown>['query']): string {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  }
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const data = await request<{ accessToken: string; refreshToken: string }, { refreshToken: string }>(
      '/api/auth/refresh',
      {
        method: 'POST',
        body: { refreshToken },
        auth: false,
        _retry: true
      }
    );

    const parsed = authTokensSchema.safeParse(data);
    if (!parsed.success) return false;
    setTokens(parsed.data);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, query, auth = false, _retry = false } = options;
  const fullPath = pathWithQuery(path, query);

  if (USE_MOCKS) {
    try {
      return await handleMockRequest<TResponse>({
        method,
        path,
        query: query as Record<string, string | number | undefined>,
        body
      });
    } catch (error) {
      const err = error as { status?: number; body?: ApiErrorBody };
      throw toApiError(err.status || 500, err.body);
    }
  }

  const headers = new Headers({
    'Content-Type': 'application/json'
  });

  if (auth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${fullPath}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    if (response.status === 401 && auth && !_retry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return request<TResponse, TBody>(path, { ...options, _retry: true });
      }
    }

    throw toApiError(response.status, data as ApiErrorBody);
  }

  return data as TResponse;
}

export function isEndpointMissing(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
