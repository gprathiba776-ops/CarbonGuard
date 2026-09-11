import React from 'react';
import { GovernanceStatusData } from '../types';
import {
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Scale,
  Award,
  AlertTriangle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface GovernanceCardProps {
  governance: GovernanceStatusData;
}

export const GovernanceCard: React.FC<GovernanceCardProps> = ({ governance }) => {
  const isBlocked =
    !governance.readyForDisclosure ||
    Boolean(governance.status && ['BLOCKED', 'FACTOR_NOT_FOUND', 'UNSUPPORTED_CLAIM', 'REVIEW_REQUIRED'].some(s => governance.status?.includes(s)));

  const failureType = governance.status || (isBlocked ? 'REVIEW_REQUIRED' : 'READY FOR DISCLOSURE');

  const checklist = [
    {
      id: 'check-factor-verified',
      label: 'Factor Verified',
      status: governance.factorVerified,
      description: governance.factorVerified
        ? 'Emission factor matched with DEFRA/GHG 2026 registry'
        : 'Factor could not be verified in official conversion tables',
      icon: FileCheck,
      failLabel: 'NOT FOUND',
    },
    {
      id: 'check-evidence-complete',
      label: 'Evidence Complete',
      status: governance.evidenceComplete,
      description: governance.evidenceComplete
        ? 'Primary source receipt & volumetric metering attached'
        : 'Primary evidence or receipt missing from transaction package',
      icon: CheckCircle2,
      failLabel: 'INCOMPLETE',
    },
    {
      id: 'check-no-unsupported-claim',
      label: 'No Unsupported Claim',
      status: governance.noUnsupportedClaim,
      description: governance.noUnsupportedClaim
        ? 'Zero ungrounded assertions or unvetted proxy factors'
        : 'Unsupported carbon assertion detected without registry backing',
      icon: Scale,
      failLabel: 'UNSUPPORTED',
    },
    {
      id: 'check-ready-disclosure',
      label: 'Ready for Disclosure',
      status: governance.readyForDisclosure,
      description: governance.readyForDisclosure
        ? 'Audit-ready for third-party review and ESG disclosure'
        : 'Disclosure suppressed until governance requirements are met',
      icon: Award,
      failLabel: 'BLOCKED',
    },
  ];

  const verifiedCount = checklist.filter((i) => i.status).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                !isBlocked
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border-rose-200/60'
              }`}
            >
              {!isBlocked ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Governance Status
            </h2>
          </div>

          {!isBlocked ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300/80 tracking-wide uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Ready for Disclosure
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300/80 tracking-wide uppercase">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span>
              {failureType.includes('FACTOR_NOT_FOUND')
                ? 'Factor Not Found'
                : failureType.includes('UNSUPPORTED_CLAIM')
                ? 'Unsupported Claim'
                : failureType.includes('REVIEW_REQUIRED')
                ? 'Review Required'
                : 'Disclosure Blocked'}
            </span>
          )}
        </div>

        {/* Reason Alert Banner if blocked or review required */}
        {isBlocked && governance.reason && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-rose-950">
                Governance Gate Action: {failureType}
              </span>
              <span>{governance.reason}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          {!isBlocked
            ? `Agentic governance reviewed ${verifiedCount} of 4 verification criteria against GHG Protocol Corporate Standard.`
            : `Agentic governance review flagged issues: ${verifiedCount} of 4 criteria met. Disclosure blocked per protocol.`}
        </p>

        {/* 4 Required Verification Items */}
        <div className="space-y-2.5">
          {checklist.map((item) => {
            return (
              <div
                key={item.id}
                id={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  item.status
                    ? 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                    : 'bg-rose-50/40 border-rose-200 hover:bg-rose-50/60'
                }`}
              >
                <div
                  className={`p-1 rounded-lg shrink-0 mt-0.5 ${
                    item.status
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.status ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {item.label}
                    </span>
                    {item.status ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/80">
                        {item.failLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Governance Engine Specs */}
      <div className="mt-5 pt-3.5 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
          <div>
            <span className="block text-slate-400 font-medium">Standard</span>
            <span className="font-semibold text-slate-700 truncate block">
              {governance.protocol}
            </span>
          </div>
          <div>
            <span className="block text-slate-400 font-medium">Assurance Level</span>
            <span
              className={`font-semibold truncate block ${
                !isBlocked ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {!isBlocked ? 'Auditor-Ready Tier 1' : 'Gate Blocked — Action Required'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
