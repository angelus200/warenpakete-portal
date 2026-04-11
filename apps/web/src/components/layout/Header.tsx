'use client';

import { useState } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: dbUser } = useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => api.get('/users/me'),
    enabled: api.isSignedIn,
  });

  const isAdmin = dbUser?.role === UserRole.ADMIN;
  const closeMobile = () => setMobileOpen(false);

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
            : 'text-gray-700 hover:text-gold'
        }`}
      >
        {children}
        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full ${isActive ? 'w-full' : ''}`} />
      </Link>
    );
  };

  const MobileNavLink = ({ href, children, isAdminLink = false }: { href: string; children: React.ReactNode; isAdminLink?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={closeMobile}
        className={`flex items-center py-3 px-4 text-base font-medium rounded-lg transition-colors min-h-[44px] ${
          isAdminLink
            ? 'text-gold-light hover:bg-gold/10'
            : isActive
            ? 'text-gold bg-gold/10'
            : 'text-gray-800 hover:text-gold hover:bg-gold/5'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <NavLink href="/markenware">Produkte anbieten</NavLink>
              <NavLink href="/verkaufskommission">Auf Kommission</NavLink>
              <NavLink href={api.isSignedIn ? '/partner' : '/sign-up?redirect_url=/partner'}>Partner werden</NavLink>
              <NavLink href="/knowledge">Knowledge Shop</NavLink>

              {api.isSignedIn && (
                <>
                  <NavLink href="/products">Produkte</NavLink>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                  <NavLink href="/orders">Bestellungen</NavLink>
                  <NavLink href="/contracts">Verträge</NavLink>
                  <NavLink href="/affiliate">Affiliate</NavLink>
                  <NavLink href="/support">Support</NavLink>
                  {isAdmin && <NavLink href="/admin" isAdminLink>Admin</NavLink>}
                </>
              )}
            </nav>

            {/* Right: User Actions + Hamburger */}
            <div className="flex items-center space-x-3">
              {api.isSignedIn ? (
                <div className="flex items-center space-x-3">
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
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gold hover:bg-gold/10">
                      Anmelden
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm" className="bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-darker hover:via-gold-dark hover:to-gold text-dark font-semibold shadow-lg shadow-gold/20">
                      Registrieren
                    </Button>
                  </Link>
                </div>
              )}

              {/* Hamburger Button — Mobile only */}
              <button
                className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Menü öffnen"
              >
                <span className="block w-5 h-0.5 bg-gray-700 mb-1.5" />
                <span className="block w-5 h-0.5 bg-gray-700 mb-1.5" />
                <span className="block w-5 h-0.5 bg-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobile}
          />

          {/* Slide-in Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Logo />
              <button
                onClick={closeMobile}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                aria-label="Menü schließen"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Plattform</p>
              <MobileNavLink href="/markenware">Produkte anbieten</MobileNavLink>
              <MobileNavLink href="/verkaufskommission">Auf Kommission</MobileNavLink>
              <MobileNavLink href={api.isSignedIn ? '/partner' : '/sign-up?redirect_url=/partner'}>Partner werden</MobileNavLink>
              <MobileNavLink href="/knowledge">Knowledge Shop</MobileNavLink>
              <MobileNavLink href="/faq">FAQ</MobileNavLink>
              <MobileNavLink href="/erstgespraech">Erstgespräch</MobileNavLink>

              {api.isSignedIn && (
                <>
                  <div className="border-t border-gray-100 my-3" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Mein Bereich</p>
                  <MobileNavLink href="/products">Produkte</MobileNavLink>
                  <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
                  <MobileNavLink href="/orders">Bestellungen</MobileNavLink>
                  <MobileNavLink href="/contracts">Verträge</MobileNavLink>
                  <MobileNavLink href="/affiliate">Affiliate</MobileNavLink>
                  <MobileNavLink href="/support">Support</MobileNavLink>
                  {isAdmin && <MobileNavLink href="/admin" isAdminLink>Admin</MobileNavLink>}
                </>
              )}
            </nav>

            {/* Auth Buttons (nur für nicht eingeloggte) */}
            {!api.isSignedIn && (
              <div className="px-5 py-5 border-t border-gray-100 space-y-3">
                <Link href="/sign-in" onClick={closeMobile} className="block">
                  <Button variant="outline" className="w-full border-2 border-gray-200 text-gray-700 hover:text-gold hover:border-gold/40 font-semibold h-12">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={closeMobile} className="block">
                  <Button className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-bold h-12 shadow-lg shadow-gold/20">
                    Registrieren
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
