const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
  tags?: string | string[];
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, body, tags, ...init } = options;

  let url = `${BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const fetchInit: RequestInit = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  };

  if (body) {
    fetchInit.body = JSON.stringify(body);
  }

  if (tags) {
    fetchInit.next = { tags: Array.isArray(tags) ? tags : [tags] };
  }

  const res = await fetch(url, fetchInit);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: { code: 'UNKNOWN', message: res.statusText } }));
    throw new ApiError(
      res.status,
      errorBody.error?.code ?? 'UNKNOWN',
      errorBody.error?.message ?? res.statusText,
    );
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
