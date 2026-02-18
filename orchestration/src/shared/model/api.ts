export type ListQuery = {
  [key: string]: string | number | undefined;
  status?: string;
  limit?: number;
  offset?: number;
};

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
