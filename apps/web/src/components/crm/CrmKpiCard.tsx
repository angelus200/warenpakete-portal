interface CrmKpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
}

export function CrmKpiCard({ label, value, sub, icon }: CrmKpiCardProps) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-[#D4AF37]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">
            {label}
          </div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {sub && <div className="text-sm text-gray-500 mt-1">{sub}</div>}
        </div>
        {icon && <div className="text-[#D4AF37]">{icon}</div>}
      </div>
    </div>
  );
}
