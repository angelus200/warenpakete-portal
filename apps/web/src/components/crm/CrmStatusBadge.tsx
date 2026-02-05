const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  active: { bg: '#d4edda', text: '#155724', label: 'Aktiv' },
  pending: { bg: '#fff3cd', text: '#856404', label: 'Ausstehend' },
  inactive: { bg: '#f8d7da', text: '#721c24', label: 'Inaktiv' },
  vip: { bg: '#e7d4ff', text: '#5a1a8c', label: 'VIP' },
  PAID: { bg: '#d4edda', text: '#155724', label: 'Bezahlt' },
  PENDING: { bg: '#fff3cd', text: '#856404', label: 'Ausstehend' },
  PROCESSING: { bg: '#cce5ff', text: '#004085', label: 'In Bearbeitung' },
  SHIPPED: { bg: '#e2d5f1', text: '#4a235a', label: 'Versendet' },
  DELIVERED: { bg: '#d1ecf1', text: '#0c5460', label: 'Zugestellt' },
  CANCELLED: { bg: '#f8d7da', text: '#721c24', label: 'Storniert' },
  listed: { bg: '#cce5ff', text: '#004085', label: 'Im Verkauf' },
  sold: { bg: '#d4edda', text: '#155724', label: 'Verkauft' },
  free_period: { bg: '#d4edda', text: '#155724', label: 'Kostenlos' },
  billing: { bg: '#f8d7da', text: '#721c24', label: 'Kostenpflichtig' },
};

interface CrmStatusBadgeProps {
  status: string;
}

export function CrmStatusBadge({ status }: CrmStatusBadgeProps) {
  const config =
    STATUS_CONFIG[status] || {
      bg: '#e2e2e2',
      text: '#333',
      label: status,
    };

  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
      className="inline-block px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wide"
    >
      {config.label}
    </span>
  );
}
