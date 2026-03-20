const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function buildUrl(path) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
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
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, 'Request failed.'));
  }

  return payload;
}

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
