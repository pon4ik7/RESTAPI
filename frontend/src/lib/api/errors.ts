export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  message?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  isEndpointMissing: boolean;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.isEndpointMissing = status === 404;
  }
}

export function toApiError(status: number, body?: ApiErrorBody): ApiError {
  const fallbackMessage = status === 404 ? 'Backend endpoint not implemented yet.' : 'Request failed';
  const message = body?.error?.message || body?.message || fallbackMessage;
  const code = body?.error?.code;
  const details = body?.error?.details;
  return new ApiError(message, status, code, details);
}
