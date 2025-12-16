import type { IHTTPService } from "./http-service.interface.js";

export class HTTPService implements IHTTPService {
  private async request<T>(url: string, method: string, body?: unknown): Promise<T> {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`HTTP error ${res.status}: ${error}`);
    }

    const isJson = res.headers.get("content-type")?.includes("application/json");

    if (isJson) {
      return res.json();
    }

    return undefined as T;
  }

  get<T>(url: string): Promise<T> {
    return this.request<T>(url, "GET");
  }

  post<T>(url: string, body?: unknown): Promise<T> {
    return this.request<T>(url, "POST", body);
  }

  patch<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, "PATCH", body);
  }

  put<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, "PUT", body);
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>(url, "DELETE");
  }
}
