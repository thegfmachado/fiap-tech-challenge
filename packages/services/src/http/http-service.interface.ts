export interface IHTTPService {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, body: unknown): Promise<T>;
  patch<T>(url: string, body: unknown): Promise<T>;
  put<T>(url: string, body: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
  postFormData<T>(url: string, formData: FormData): Promise<T>;
  downloadFile(url: string): Promise<Blob>;
}
