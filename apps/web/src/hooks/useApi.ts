'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

export function useApi() {
  const { getToken, isSignedIn } = useAuth();

  const request = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    console.log('🔵 API Request:', { endpoint, method: options.method || 'GET' });

    const token = await getToken();

    console.log('🔑 Token Status:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.warn('⚠️ No token available - request will be unauthorized');
    }

    const url = `${API_URL}${endpoint}`;
    console.log('📡 Fetching:', url);

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log('📥 Response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ API Error:', {
        endpoint,
        status: response.status,
        error,
      });
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Success:', { endpoint, dataKeys: Object.keys(data) });
    return data;
  }, [getToken]);

  return {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, data: unknown) => request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    patch: <T>(endpoint: string, data: unknown) => request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
    isSignedIn,
  };
}
