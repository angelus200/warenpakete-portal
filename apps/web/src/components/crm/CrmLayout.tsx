'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import {
  Users,
  ShoppingCart,
  DollarSign,
  Warehouse,
  Share2,
  MessageSquare,
  UserPlus,
  UserCheck,
} from 'lucide-react';

const TABS = [
  {
    key: 'customers',
    label: 'Kunden',
    icon: Users,
    href: '/admin/crm/customers',
  },
  {
    key: 'orders',
    label: 'Bestellungen',
    icon: ShoppingCart,
    href: '/admin/crm/orders',
  },
  {
    key: 'commissions',
    label: 'Kommissionen',
    icon: DollarSign,
    href: '/admin/crm/commissions',
  },
  {
    key: 'storage',
    label: 'Lager & Fulfillment',
    icon: Warehouse,
    href: '/admin/crm/storage',
  },
  {
    key: 'affiliates',
    label: 'Affiliates',
    icon: Share2,
    href: '/admin/crm/affiliates',
  },
  {
    key: 'support',
    label: 'Support',
    icon: MessageSquare,
    href: '/admin/crm/support',
  },
  {
    key: 'leads',
    label: 'Leads',
    icon: UserPlus,
    href: '/admin/crm/leads',
  },
  {
    key: 'consultants',
    label: 'Berater',
    icon: UserCheck,
    href: '/admin/crm/consultants',
  },
];

interface CrmLayoutProps {
  children: ReactNode;
}

export function CrmLayout({ children }: CrmLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b-2 border-[#D4AF37]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 bg-[#D4AF37] flex items-center justify-center font-bold text-[#1a1a1a] text-sm"
                style={{
                  clipPath:
                    'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                }}
              >
                EC
              </div>
              <span className="text-white font-semibold text-sm tracking-wide">
                E-Commerce Service CRM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname.startsWith(tab.href);

              return (
                <button
                  key={tab.key}
                  onClick={() => router.push(tab.href)}
                  className={`px-5 py-3 rounded-t-lg flex items-center gap-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#1a1a1a]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">{children}</div>
    </div>
  );
}
