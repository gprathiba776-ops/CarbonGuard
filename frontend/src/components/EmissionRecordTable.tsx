import React from 'react';
import { EmissionRecord } from '../types';
import { Table, CheckCircle2, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

interface EmissionRecordTableProps {
  records: EmissionRecord[];
  selectedRecordId?: string;
  onSelectRecord?: (record: EmissionRecord) => void;
}

export const EmissionRecordTable: React.FC<EmissionRecordTableProps> = ({
  records,
  selectedRecordId,
  onSelectRecord,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:px-6 sm:py-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Emission Records
            </h2>
            <p className="text-xs text-slate-500">
              Primary transaction ledger verified against statutory conversion registers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            {records.length} Record{records.length === 1 ? '' : 's'} Ledgered
          </span>
        </div>
      </div>

      {/* Table Container with responsive scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="emission-records-table">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 sm:px-6">Record ID</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Activity</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Scope</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Quantity</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Emissions</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
            {records.map((rec) => {
              const isSelected = selectedRecordId === rec.id;
              return (
                <tr
                  key={rec.id}
                  id={`record-row-${rec.id}`}
                  onClick={() => onSelectRecord && onSelectRecord(rec)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/40 hover:bg-emerald-50/60'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Record ID */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {rec.id}
                      </span>
                    </div>
                  </td>

                  {/* Activity */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-semibold text-slate-900">
                      {rec.activity}
                    </div>
                    {rec.facility && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {rec.facility}
                      </div>
                    )}
                  </td>

                  {/* Scope */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {rec.scope}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right font-mono text-slate-900 font-semibold">
                    {rec.quantity.toLocaleString()} <span className="text-slate-500 font-normal">{rec.unit}</span>
                  </td>

                  {/* Emissions */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right font-mono font-bold text-emerald-950 text-sm">
                    {rec.emissions} <span className="text-xs font-normal text-slate-500">{rec.emissionsUnit}</span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 stroke-[2.5]" />
                      {rec.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3.5 sm:px-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Every ledgered record is cryptographically bound to its verified factor source</span>
        </div>
        <div className="text-slate-400">
          Source Document: Fuel Delivery Receipt INV-001 (UK Fleet Ops)
        </div>
      </div>
    </div>
  );
};
