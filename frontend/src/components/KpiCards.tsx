import React from 'react';
import { KpiData } from '../types';
import { Flame, Zap, Truck, Globe2 } from 'lucide-react';

interface KpiCardsProps {
  kpis: KpiData;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  const cards = [
    {
      id: 'kpi-total-emissions',
      title: 'Total Emissions',
      scopeTag: 'Consolidated',
      value: kpis.totalEmissions,
      unit: kpis.unit,
      description: 'Gross greenhouse gas footprint',
      icon: Globe2,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-700',
      iconBorder: 'border-emerald-200',
      percentage: '100%',
      verified: true,
    },
    {
      id: 'kpi-scope-1',
      title: 'Scope 1',
      scopeTag: 'Direct',
      value: kpis.scope1,
      unit: kpis.unit,
      description: 'Direct fuel combustion & owned assets',
      icon: Flame,
      accentBg: 'bg-emerald-50/80',
      accentText: 'text-emerald-700',
      iconBorder: 'border-emerald-200',
      percentage: kpis.totalEmissions > 0 
        ? `${((kpis.scope1 / kpis.totalEmissions) * 100).toFixed(1)}%`
        : '0%',
      verified: true,
    },
    {
      id: 'kpi-scope-2',
      title: 'Scope 2',
      scopeTag: 'Market / Loc.',
      value: kpis.scope2,
      unit: kpis.unit,
      description: 'Purchased electricity, steam & heat',
      icon: Zap,
      accentBg: 'bg-slate-50',
      accentText: 'text-slate-600',
      iconBorder: 'border-slate-200',
      percentage: kpis.totalEmissions > 0 
        ? `${((kpis.scope2 / kpis.totalEmissions) * 100).toFixed(1)}%`
        : '0%',
      verified: true,
    },
    {
      id: 'kpi-scope-3',
      title: 'Scope 3',
      scopeTag: 'Value Chain',
      value: kpis.scope3,
      unit: kpis.unit,
      description: kpis.scope3 === 0 ? 'No Scope 3 activity reported' : 'Upstream freight, waste & suppliers',
      icon: Truck,
      accentBg: 'bg-slate-50',
      accentText: 'text-slate-600',
      iconBorder: 'border-slate-200',
      percentage: kpis.totalEmissions > 0 
        ? `${((kpis.scope3 / kpis.totalEmissions) * 100).toFixed(1)}%`
        : '0%',
      verified: true,
    },
  ];

  // Helper to format precision without dropping significant decimals
  const formatEmissionNumber = (num: number): string => {
    if (num === 0) return '0';
    // If it has decimals, display up to 6 decimals cleanly without trailing zeroes if cleaner, or exact
    const str = num.toString();
    return str;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                  {card.scopeTag}
                </span>
              </div>

              {/* Main value display */}
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                  {formatEmissionNumber(card.value)}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-normal">
                  {card.unit}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
                {card.description}
              </p>
            </div>

            {/* Bottom mini-bar & status indicator */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <div className={`p-1 rounded-md ${card.accentBg} ${card.accentText} border ${card.iconBorder}`}>
                  <IconComponent className="h-3.5 w-3.5" />
                </div>
                <span>Share: {card.percentage}</span>
              </div>

              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                <span>Deterministic</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
