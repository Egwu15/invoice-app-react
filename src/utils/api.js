const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
export const API_UNAUTHORIZED_EVENT = 'invoiceflow:unauthorized';

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path, params) {
  const url = new URL(
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    window.location.origin
  );

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  return `${url.pathname}${url.search}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function toErrorMessage(payload, fallbackMessage) {
  if (!payload) return fallbackMessage;
  if (typeof payload === 'string') return payload || fallbackMessage;
  if (typeof payload.title === 'string') return payload.title;
  if (typeof payload.message === 'string') return payload.message;

  if (payload.errors && typeof payload.errors === 'object') {
    const firstError = Object.values(payload.errors).find((value) => Array.isArray(value) && value[0]);
    if (firstError) return firstError[0];
  }

  return fallbackMessage;
}

export async function apiRequest(path, options = {}) {
  const { params, headers, body, ...restOptions } = options;
  const requestHeaders = {
    ...headers,
  };

  if (body && !(body instanceof FormData) && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(buildUrl(path, params), {
    ...restOptions,
    headers: requestHeaders,
    body,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message = toErrorMessage(payload, 'Request failed.');

    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent(API_UNAUTHORIZED_EVENT));
    }

    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
