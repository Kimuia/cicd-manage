export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVER_ERROR';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; data: null; error: ErrorCode; message?: string; fieldErrors?: Record<string, string[]> };
