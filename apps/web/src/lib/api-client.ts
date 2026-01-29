import { useAuth } from '@clerk/nextjs';

export class ApiClient {
  private baseUrl: string;
  private getToken: () => Promise<string | null>;

  constructor(baseUrl: string, getToken: () => Promise<string | null>) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      console.log('=== API REQUEST START ===');
      console.log('Endpoint:', endpoint);
      console.log('Calling getToken()...');

      const token = await this.getToken();

      console.log('Token vorhanden:', !!token);
      if (token) {
        console.log('Token Anfang:', token.substring(0, 50) + '...');
        console.log('Token Länge:', token.length);
      } else {
        console.log('⚠️ KEIN TOKEN ERHALTEN!');
      }

      const url = `${this.baseUrl}${endpoint}`;
      console.log('URL:', url);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Authorization Header gesetzt');
      } else {
        console.log('❌ Kein Authorization Header (kein Token)');
      }

      if (options?.headers) {
        Object.assign(headers, options.headers);
      }

      console.log('Sending request...');
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      console.log('Response Status:', response.status);
      console.log('=== API REQUEST END ===');

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        console.error('❌ API Error:', {
          endpoint,
          status: response.status,
          error,
        });
        throw new Error(error.message || `HTTP error ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ API Request failed:', { endpoint, error });
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export function useApiClient() {
  const { getToken } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return new ApiClient(apiUrl, getToken);
}
