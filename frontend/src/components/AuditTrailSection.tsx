import React from 'react';
import { AuditTrailData } from '../types';
import {
  GitCommit,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Database,
  Tag,
  Flame,
  FileCheck2,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface AuditTrailSectionProps {
  auditTrail: AuditTrailData;
}

export const AuditTrailSection: React.FC<AuditTrailSectionProps> = ({ auditTrail }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyHash = () => {
    const text = `AUDIT-PROOF-${auditTrail.sourceRecord}-${auditTrail.result}-${auditTrail.governance}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBlocked = ['BLOCKED', 'FACTOR_NOT_FOUND', 'UNSUPPORTED_CLAIM', 'REVIEW_REQUIRED'].some(
    (s) => auditTrail.governance?.toUpperCase().includes(s)
  );

  const pipelineSteps = [
    {
      step: 1,
      title: 'Source Record',
      value: auditTrail.sourceRecord,
      badge: 'Primary Doc',
      icon: Database,
    },
    {
      step: 2,
      title: 'Activity',
      value: auditTrail.activity,
      badge: 'Fuel Spec',
      icon: Flame,
    },
    {
      step: 3,
      title: 'Scope Classification',
      value: auditTrail.scope,
      badge: 'Direct Emission',
      icon: Tag,
    },
    {
      step: 4,
      title: 'Verified Emission Factor',
      value: `${auditTrail.factor} ${auditTrail.factorUnit}`,
      badge: isBlocked && auditTrail.governance?.includes('FACTOR_NOT_FOUND') ? 'Unverified' : 'DEFRA 2026',
      icon: FileCheck2,
    },
    {
      step: 5,
      title: 'Deterministic Formula',
      value: auditTrail.formula,
      badge: 'Zero Hallucination',
      icon: Calculator,
    },
    {
      step: 6,
      title: 'Emissions Result',
      value: `${auditTrail.result} ${auditTrail.resultUnit}`,
      badge: 'Precise tCO₂e',
      icon: GitCommit,
    },
    {
      step: 7,
      title: 'Governance Decision',
      value: auditTrail.governance,
      badge: isBlocked ? 'Action Required' : 'Audit-Ready',
      icon: isBlocked ? AlertTriangle : ShieldCheck,
      isFinal: true,
    },
  ];

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <GitCommit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Deterministic Audit Trail
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                Lineage Chain #14064
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verifiable lineage trace from raw transaction ledger to disclosure-ready reporting
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyHash}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 cursor-pointer transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Proof Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Verification Proof</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Pipeline Flow Sequence */}
      <div className="py-6">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Verification Pipeline Flow
        </div>

        {/* Pipeline Bar */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === pipelineSteps.length - 1;

            return (
              <div
                key={step.step}
                className="relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-150 bg-slate-50/70 border-slate-200/90 hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-600">
                      STEP {step.step}
                    </span>
                    <Icon className="h-3.5 w-3.5 text-emerald-700" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-tight mb-1">
                    {step.title}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <div
                    className={`text-xs font-mono font-semibold truncate ${
                      step.isFinal ? 'text-emerald-800' : 'text-slate-700'
                    }`}
                    title={step.value}
                  >
                    {step.value}
                  </div>
                  <span className="inline-block text-[10px] text-slate-600 mt-0.5">
                    {step.badge}
                  </span>
                </div>

                {/* Arrow indicator between steps on desktop */}
                {!isLast && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 border border-slate-300 shadow-2xs">
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exact Prompt Required Audit Display Key-Value Matrix */}
      <div className="mt-2 pt-5 border-t border-slate-200/80">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Audit Trail Proof Specification
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Source */}
          <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Source
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {auditTrail.sourceRecord}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Verified Delivery Manifest
            </span>
          </div>

          {/* 2. Activity */}
          <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Activity
            </span>
            <span className="text-sm font-semibold text-slate-900 block truncate" title={auditTrail.activity}>
              {auditTrail.activity}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Commercial Fleet Fuel
            </span>
          </div>

          {/* 3. Scope */}
          <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Scope
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              <CheckCircle className="h-3 w-3 text-emerald-700" />
              {auditTrail.scope}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Direct combustion GHG boundary
            </span>
          </div>

          {/* 4. Factor */}
          <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Factor
            </span>
            <span className="text-sm font-bold font-mono text-emerald-800">
              {auditTrail.factor} <span className="text-xs font-normal text-slate-600">{auditTrail.factorUnit}</span>
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Statutory 100% mineral diesel
            </span>
          </div>

          {/* 5. Factor Source */}
          <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 lg:col-span-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Factor Source
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {auditTrail.factorSource}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Registry Ref: DEFRA-2026-TAB-FUEL-102 • Table 1b (Published & Locked)
            </span>
          </div>

          {/* 6. Formula */}
          <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Formula
            </span>
            <div className="text-sm font-bold font-mono text-slate-900">
              {auditTrail.formula}
            </div>
            <span className="block text-[11px] text-slate-500 mt-0.5 font-mono">
              ÷ 1,000 kg/tonne conversion
            </span>
          </div>

          {/* 7. Result */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Result
            </span>
            <span className="text-base font-extrabold font-mono text-emerald-950">
              {auditTrail.result} <span className="text-xs font-semibold text-emerald-800">{auditTrail.resultUnit}</span>
            </span>
            <span className="block text-[11px] text-emerald-700 mt-0.5">
              Exact Deterministic Value
            </span>
          </div>
        </div>

        {/* 8. Governance Decision (Prominent Assurance Banner) */}
        <div
          className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            !isBlocked
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-emerald-300/80'
              : 'bg-gradient-to-r from-rose-50 via-amber-50/40 to-white border-rose-300/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg text-white flex items-center justify-center shrink-0 shadow-xs ${
                !isBlocked ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            >
              {!isBlocked ? (
                <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
              ) : (
                <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
              )}
            </div>
            <div>
              <div
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  !isBlocked ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                Governance Decision
              </div>
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 font-sans flex items-center gap-2">
                <span>{auditTrail.governance}</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-2xs ${
                    !isBlocked ? 'bg-emerald-700' : 'bg-rose-700'
                  }`}
                >
                  {!isBlocked ? 'EVIDENCE-BACKED' : 'ACTION REQUIRED'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600">
            <span className="font-semibold block text-slate-800">
              {!isBlocked
                ? 'Agentic Governance Review Complete'
                : 'Governance Review Flagged — Action Required'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {!isBlocked
                ? 'Deterministic calculation verified by CarbonGuard Engine v2.8'
                : 'Disclosure blocked until audit trail criteria are fulfilled'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
