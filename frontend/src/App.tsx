/**
 * CarbonGuard AI — Trusted carbon accounting with agentic governance
 * Frontend Dashboard Implementation
 */

import React, { useState } from 'react';
import { initialDemoPayload } from './data/demoData';
import { CarbonGuardPayload, EmissionRecord } from './types';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { EmissionsChart } from './components/EmissionsChart';
import { GovernanceCard } from './components/GovernanceCard';
import { EmissionRecordTable } from './components/EmissionRecordTable';
import { AuditTrailSection } from './components/AuditTrailSection';
import { AnalyzeModal } from './components/AnalyzeModal';
import { Building2, Calendar, FileBadge, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [payload, setPayload] = useState<CarbonGuardPayload>(initialDemoPayload);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    initialDemoPayload.records[0]?.id || 'INV-001'
  );

  // When a record is clicked in the table, we dynamically update the audit trail view
  const handleSelectRecord = (record: EmissionRecord) => {
    setSelectedRecordId(record.id);
    setPayload((prev) => ({
      ...prev,
      auditTrail: {
        sourceRecord: record.id,
        activity: record.activity,
        scope: record.scope,
        factor: record.factorValue,
        factorUnit: record.factorUnit,
        factorSource: record.factorSource,
        formula: record.formula,
        formulaDetailed: record.formulaDetailed || `${record.quantity} × ${record.factorValue} ÷ 1,000`,
        result: record.emissions,
        resultUnit: record.emissionsUnit,
        governance: record.governanceDecision,
        governanceDetails: prev.auditTrail.governanceDetails,
      },
    }));
  };

  const handleApplyPayload = (newPayload: CarbonGuardPayload) => {
    setPayload(newPayload);
    if (newPayload.records.length > 0) {
      setSelectedRecordId(newPayload.records[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation / Brand Header */}
      <Header onAnalyzeClick={() => setIsAnalyzeModalOpen(true)} />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Enterprise Organization & Scope Sub-Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <Building2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Entity: <strong className="font-semibold text-slate-900">{payload.organization}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Period: <span className="font-semibold text-slate-700">{payload.reportingPeriod}</span></span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <FileBadge className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>GHG Protocol Corporate Accounting Standard</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {payload.isLiveWebhookData ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                SuperFlow Webhook Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                Demo Record (Fallback)
              </span>
            )}

            {payload.governance.readyForDisclosure ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Agentic Verification Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                <span className="h-2 w-2 rounded-full bg-rose-600"></span>
                Governance Review Blocked
              </span>
            )}
          </div>
        </div>

        {/* 4 KPI Cards */}
        <section aria-label="Key Performance Indicators">
          <KpiCards kpis={payload.kpis} />
        </section>

        {/* Scope Chart & Governance Status Cards (Side by Side on desktop) */}
        <section aria-label="Emissions Scope and Governance Status" className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          <div className="lg:col-span-7">
            <EmissionsChart kpis={payload.kpis} />
          </div>
          <div className="lg:col-span-5">
            <GovernanceCard governance={payload.governance} />
          </div>
        </section>

        {/* Emission Record Table */}
        <section aria-label="Emission Record Ledger">
          <EmissionRecordTable
            records={payload.records}
            selectedRecordId={selectedRecordId}
            onSelectRecord={handleSelectRecord}
          />
        </section>

        {/* Audit Trail Section */}
        <section aria-label="Verification and Audit Trail">
          <AuditTrailSection auditTrail={payload.auditTrail} />
        </section>

      </main>

      {/* Enterprise Compliance Footer */}
      <footer className="border-t border-slate-200/90 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-sans">CarbonGuard AI</span>
            <span>—</span>
            <span>Trusted carbon accounting with agentic governance</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>GHG Protocol Corporate Standard</span>
            <span>•</span>
            <span>ISO 14064-3 Aligned</span>
            <span>•</span>
            <span>UK DEFRA 2026 Locked</span>
          </div>
        </div>
      </footer>

      {/* Interactive Analyze ESG Data & SuperFlow Webhook Modal */}
      <AnalyzeModal
        isOpen={isAnalyzeModalOpen}
        onClose={() => setIsAnalyzeModalOpen(false)}
        currentPayload={payload}
        onApplyPayload={handleApplyPayload}
      />
    </div>
  );
}
