'use client';

import Link from 'next/link';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api-client';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const apiClient = useApiClient();

  const { data: dbUser } = useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => apiClient.get('/users/me'),
    enabled: isSignedIn,
  });

  const isAdmin = dbUser?.role === UserRole.ADMIN;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-xl font-bold text-white">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Warenpakete Portal
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Produkte
            </Link>

            {isSignedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Bestellungen
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                {dbUser && (
                  <div className="hidden lg:block text-sm text-right">
                    <p className="font-medium text-gray-900">
                      {dbUser.firstName || dbUser.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dbUser.role === UserRole.RESELLER && 'Reseller'}
                      {dbUser.role === UserRole.ADMIN && 'Administrator'}
                      {dbUser.role === UserRole.BUYER && 'Kunde'}
                    </p>
                  </div>
                )}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-9 w-9',
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Registrieren</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isSignedIn && (
          <div className="md:hidden border-t py-3 flex space-x-4 overflow-x-auto">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap"
            >
              Produkte
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/orders"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap"
            >
              Bestellungen
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-red-600 hover:text-red-700 whitespace-nowrap"
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
