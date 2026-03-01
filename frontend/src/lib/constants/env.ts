export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
