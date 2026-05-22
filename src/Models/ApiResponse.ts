export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  isI18nKey: boolean;
}
