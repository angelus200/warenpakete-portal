'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { usePathname } from 'next/navigation';

export function Header() {
  const { user: clerkUser } = useUser();
  const api = useApi();
  const pathname = usePathname();

  const { data: dbUser } = useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => api.get('/users/me'),
    enabled: api.isSignedIn,
  });

  const isAdmin = dbUser?.role === UserRole.ADMIN;

  const NavLink = ({ href, children, isAdminLink = false }: { href: string; children: React.ReactNode; isAdminLink?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors relative group ${
          isAdminLink
            ? 'text-gold-light hover:text-gold'
            : isActive
            ? 'text-gold'
            : 'text-gray-300 hover:text-gold'
        }`}
      >
        {children}
        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full ${isActive ? 'w-full' : ''}`} />
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-dark/90">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/products">Produkte</NavLink>

            {api.isSignedIn && (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/orders">Bestellungen</NavLink>
                {isAdmin && <NavLink href="/admin" isAdminLink>Admin</NavLink>}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {api.isSignedIn ? (
              <div className="flex items-center space-x-4">
                {dbUser && (
                  <div className="hidden lg:block text-sm text-right">
                    <p className="font-semibold text-gold">
                      {dbUser.firstName || dbUser.email}
                    </p>
                    <p className="text-xs text-gold-dark font-medium">
                      {dbUser.role === UserRole.RESELLER && '⭐ Reseller'}
                      {dbUser.role === UserRole.ADMIN && '👑 Administrator'}
                      {dbUser.role === UserRole.BUYER && '🎯 Kunde'}
                    </p>
                  </div>
                )}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-10 w-10 ring-2 ring-gold/30',
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-gold hover:bg-gold/10"
                  >
                    Anmelden
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-semibold shadow-lg shadow-gold/20"
                  >
                    Registrieren
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {api.isSignedIn && (
          <div className="md:hidden border-t border-gold/20 py-3 flex space-x-4 overflow-x-auto">
            <NavLink href="/products">Produkte</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/orders">Bestellungen</NavLink>
            {isAdmin && <NavLink href="/admin" isAdminLink>Admin</NavLink>}
          </div>
        )}
      </div>
    </header>
  );
}
