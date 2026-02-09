'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

export function useApi() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const request = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    // Debug logging

    let token: string | null = null;

    if (isSignedIn) {
      try {
        token = await getToken();
      } catch (error) {
        console.error('🔑 getToken() error:', error);
      }
    } else {
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
    }

    const url = `${API_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', { endpoint, status: response.status, error: errorData });
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }, [getToken, isSignedIn, isLoaded]);

  return {
    get: useCallback(<T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }), [request]),
    post: useCallback(<T>(endpoint: string, data: unknown) => request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }), [request]),
    patch: useCallback(<T>(endpoint: string, data: unknown) => request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }), [request]),
    delete: useCallback(<T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }), [request]),
    isSignedIn: isSignedIn ?? false,
    isLoaded: isLoaded ?? false,
  };
}
