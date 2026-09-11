import React, { useState } from 'react';
import { KpiData } from '../types';
import { BarChart3, Info, Flame, Zap, Truck } from 'lucide-react';

interface EmissionsChartProps {
  kpis: KpiData;
}

export const EmissionsChart: React.FC<EmissionsChartProps> = ({ kpis }) => {
  const [activeScope, setActiveScope] = useState<string | null>(null);

  const total = kpis.totalEmissions || 0.000001; // prevent div by zero
  const s1Pct = ((kpis.scope1 / total) * 100);
  const s2Pct = ((kpis.scope2 / total) * 100);
  const s3Pct = ((kpis.scope3 / total) * 100);

  const scopeItems = [
    {
      id: 'Scope 1',
      name: 'Scope 1 (Direct)',
      value: kpis.scope1,
      percentage: s1Pct,
      color: 'bg-emerald-600',
      barColor: '#059669',
      borderColor: 'border-emerald-700',
      lightBg: 'bg-emerald-50 text-emerald-800',
      icon: Flame,
      summary: 'Fleet diesel combustion, stationary combustion, process emissions',
    },
    {
      id: 'Scope 2',
      name: 'Scope 2 (Indirect)',
      value: kpis.scope2,
      percentage: s2Pct,
      color: 'bg-teal-500',
      barColor: '#14b8a6',
      borderColor: 'border-teal-600',
      lightBg: 'bg-teal-50 text-teal-800',
      icon: Zap,
      summary: 'Purchased electricity and thermal energy',
    },
    {
      id: 'Scope 3',
      name: 'Scope 3 (Value Chain)',
      value: kpis.scope3,
      percentage: s3Pct,
      color: 'bg-slate-400',
      barColor: '#94a3b8',
      borderColor: 'border-slate-500',
      lightBg: 'bg-slate-100 text-slate-700',
      icon: Truck,
      summary: kpis.scope3 === 0 ? 'No Scope 3 activity reported' : 'Upstream supply chain & downstream logistics',
    },
  ];

  // Max value calculation for bar height scaling (minimum scale ceiling of 8 if total is around 6.65)
  const maxValue = Math.max(kpis.scope1, kpis.scope2, kpis.scope3, 1);
  const chartCeiling = Math.ceil(maxValue * 1.2 * 100) / 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Title & Metadata */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Emissions by Scope
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            Unit: {kpis.unit}
          </span>
        </div>

        {/* Proportional Segment Bar (Total Share) */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
            <span>Portfolio Breakdown (GHG Protocol)</span>
            <span className="font-mono text-slate-900 font-semibold">{kpis.totalEmissions} {kpis.unit}</span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden flex p-0.5 gap-0.5 border border-slate-200/70">
            {scopeItems.map((s) => {
              const widthVal = Math.max(s.percentage, s.value > 0 ? 3 : 0);
              return (
                <div
                  key={`bar-${s.id}`}
                  style={{ width: `${s.value > 0 ? widthVal : 0}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${s.color}`}
                  title={`${s.name}: ${s.value} ${kpis.unit} (${s.percentage.toFixed(1)}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* 3 Scope Bars Comparison Chart */}
        <div className="space-y-4">
          {scopeItems.map((scope) => {
            const Icon = scope.icon;
            const barWidthPercent = maxValue > 0 ? Math.min(100, (scope.value / maxValue) * 100) : 0;
            const isHighlighted = activeScope === scope.id;

            return (
              <div
                key={scope.id}
                onMouseEnter={() => setActiveScope(scope.id)}
                onMouseLeave={() => setActiveScope(null)}
                className={`p-3 rounded-xl border transition-all duration-150 cursor-default ${
                  isHighlighted
                    ? 'bg-slate-50/90 border-slate-300 shadow-xs'
                    : 'bg-slate-50/40 border-slate-200/80 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${scope.lightBg}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {scope.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-slate-900">
                      {scope.value}
                    </span>
                    <span className="text-xs text-slate-500 font-medium ml-1">
                      {kpis.unit}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 ml-2 font-mono">
                      ({scope.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${scope.color}`}
                    style={{
                      width: `${scope.value > 0 ? Math.max(barWidthPercent, 2) : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <span className="truncate max-w-[280px] sm:max-w-xs">{scope.summary}</span>
                  <span className="shrink-0 font-medium text-slate-600">
                    {scope.value > 0 ? 'Active Records' : (scope.id === 'Scope 3' ? 'No Scope 3 activity reported' : 'No Activity Reported')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer note */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Calculated via official 2026 conversion tables</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
          Scale: 0 — {chartCeiling} {kpis.unit}
        </span>
      </div>
    </div>
  );
};
