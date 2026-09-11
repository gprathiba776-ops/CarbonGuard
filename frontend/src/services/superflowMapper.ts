/**
 * CarbonGuard AI — SuperFlow Webhook Response Mapper
 * Maps live outputs from CarbonGuard ESG SuperFlow into the dashboard data structure.
 * Strictly preserves provenance chain and handles failure states (REVIEW_REQUIRED, FACTOR_NOT_FOUND, UNSUPPORTED_CLAIM, BLOCKED).
 * Never calculates emissions on the frontend.
 */

import { CarbonGuardPayload, EmissionRecord, ScopeType } from '../types';
import { initialDemoPayload } from '../data/demoData';

export type GovernanceFailureType =
  | 'REVIEW_REQUIRED'
  | 'FACTOR_NOT_FOUND'
  | 'UNSUPPORTED_CLAIM'
  | 'BLOCKED';

export interface SuperFlowSubmissionPayload {
  record_id: string;
  activity: string;
  quantity: number;
  unit: string;
  date: string;
  location: string;
  supplier: string;
  scope: string;
  year: number;
  category: string;
  fuel_subtype: string;
}

/**
 * Normalizes and extracts JSON output from SuperFlow response
 */
function extractOutputData(raw: any): any {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return { message: raw };
    }
  }

  // If Lyzr wraps response in output / response / result / data
  if (raw.response && typeof raw.response === 'object') {
    return extractOutputData(raw.response);
  }
  if (raw.result && typeof raw.result === 'object') {
    return extractOutputData(raw.result);
  }
  if (raw.output && typeof raw.output === 'object') {
    return extractOutputData(raw.output);
  }
  if (typeof raw.output === 'string') {
    try {
      return JSON.parse(raw.output);
    } catch {
      return { output: raw.output, ...raw };
    }
  }
  if (raw.data && typeof raw.data === 'object') {
    return extractOutputData(raw.data);
  }
  return raw;
}

/**
 * Checks if the response indicates a failure or review-required state
 */
export function detectGovernanceFailure(data: any): {
  isFailure: boolean;
  failureType?: GovernanceFailureType;
  reason: string;
} {
  const statusCandidates = [
    data.status,
    data.governance_status,
    data.governanceStatus,
    data.governance_decision,
    data.governanceDecision,
    data.decision,
    data.error_code,
    data.errorCode,
    data.result_status,
  ].map((s) => (typeof s === 'string' ? s.toUpperCase().trim() : ''));

  const reason =
    data.reason ||
    data.failure_reason ||
    data.failureReason ||
    data.error ||
    data.message ||
    data.details ||
    '';

  const combined = statusCandidates.join(' ') + ' ' + (typeof reason === 'string' ? reason.toUpperCase() : '');

  if (combined.includes('FACTOR_NOT_FOUND') || combined.includes('FACTOR NOT FOUND')) {
    return {
      isFailure: true,
      failureType: 'FACTOR_NOT_FOUND',
      reason: reason || 'Emission factor not found in the verified 2026 registry for the specified activity.',
    };
  }
  if (combined.includes('UNSUPPORTED_CLAIM') || combined.includes('UNSUPPORTED CLAIM')) {
    return {
      isFailure: true,
      failureType: 'UNSUPPORTED_CLAIM',
      reason: reason || 'Emission claim unsupported by verified supplier evidence or registry documentation.',
    };
  }
  if (combined.includes('REVIEW_REQUIRED') || combined.includes('REVIEW REQUIRED') || combined.includes('NEEDS_REVIEW')) {
    return {
      isFailure: true,
      failureType: 'REVIEW_REQUIRED',
      reason: reason || 'Activity parameters flagged for manual ESG auditor review before disclosure.',
    };
  }
  if (combined.includes('BLOCKED') || data.blocked === true || data.is_blocked === true) {
    return {
      isFailure: true,
      failureType: 'BLOCKED',
      reason: reason || 'Governance gate blocked: required evidence and verification conditions were not satisfied.',
    };
  }

  // Check if ready_for_disclosure is explicitly false
  if (data.ready_for_disclosure === false || data.readyForDisclosure === false) {
    return {
      isFailure: true,
      failureType: 'REVIEW_REQUIRED',
      reason: reason || 'Governance engine determined reporting is not ready for disclosure.',
    };
  }

  return { isFailure: false, reason: '' };
}

/**
 * Maps any raw response from SuperFlow into a validated CarbonGuardPayload
 */
export function mapSuperFlowResponseToPayload(
  rawResponse: any,
  submission: SuperFlowSubmissionPayload,
  fallback: CarbonGuardPayload = initialDemoPayload
): CarbonGuardPayload {
  const data = extractOutputData(rawResponse);
  const detectedFailure = detectGovernanceFailure(data);

  // If already a complete CarbonGuardPayload structure, merge cleanly
  if (data.kpis && data.governance && data.records && data.auditTrail) {
    const isReady = !detectedFailure.isFailure && (data.governance.readyForDisclosure ?? true);
    return {
      ...data,
      webhookSource: 'CarbonGuard ESG SuperFlow Live Webhook',
      governance: {
        ...data.governance,
        readyForDisclosure: isReady,
        status: detectedFailure.isFailure ? detectedFailure.failureType : (data.governance.status || 'READY FOR DISCLOSURE'),
        reason: detectedFailure.isFailure ? detectedFailure.reason : data.governance.reason,
      },
      auditTrail: {
        ...data.auditTrail,
        governance: detectedFailure.isFailure ? `${detectedFailure.failureType} — ${detectedFailure.reason}` : data.auditTrail.governance,
      },
    };
  }

  // Parse Scope
  let scope: ScopeType = 'Scope 1';
  const rawScope = String(data.scope || '').toLowerCase();
  if (rawScope.includes('2')) scope = 'Scope 2';
  else if (rawScope.includes('3')) scope = 'Scope 3';

  // A live response must carry its own numerical evidence. Demo data is only
  // used for the dashboard's initial state and must never fill missing live
  // emissions, factors, formulas, or provenance.
  const rawQuantity = data.quantity ?? data.activity_quantity ?? data.activityQuantity;
  const rawEmissions = data.emissions_tco2e ?? data.emissionsTco2e ?? data.total_emissions ?? data.totalEmissions ?? data.emissions;
  const rawFactor = data.emission_factor ?? data.factor_value ?? data.factorValue ?? data.factor;
  const rawFactorSource = data.factor_source ?? data.factorSource;
  const rawFormula = data.formula ?? data.deterministic_formula ?? data.deterministicFormula;

  const requiredLiveFieldsMissing =
    !data.record_id ||
    !data.activity ||
    !data.scope ||
    rawQuantity === undefined || rawQuantity === null || !Number.isFinite(Number(rawQuantity)) ||
    !data.unit ||
    rawEmissions === undefined || rawEmissions === null || !Number.isFinite(Number(rawEmissions)) ||
    rawFactor === undefined || rawFactor === null || !Number.isFinite(Number(rawFactor)) ||
    !rawFactorSource ||
    !rawFormula;

  const failure = detectedFailure.isFailure
    ? detectedFailure
    : requiredLiveFieldsMissing
      ? {
          isFailure: true,
          failureType: 'REVIEW_REQUIRED' as GovernanceFailureType,
          reason: 'Live SuperFlow result is missing required numerical or provenance fields; disclosure is not approved.'
        }
      : detectedFailure;

  const totalEmissions = failure.isFailure ? 0 : Number(rawEmissions);
  const scope1 = failure.isFailure ? 0 : Number(data.scope_1 ?? data.scope1 ?? (scope === 'Scope 1' ? totalEmissions : 0));
  const scope2 = failure.isFailure ? 0 : Number(data.scope_2 ?? data.scope2 ?? (scope === 'Scope 2' ? totalEmissions : 0));
  const scope3 = failure.isFailure ? 0 : Number(data.scope_3 ?? data.scope3 ?? (scope === 'Scope 3' ? totalEmissions : 0));

  const factorValue = failure.isFailure ? 0 : Number(rawFactor);
  const factorUnit = String(data.factor_unit ?? data.factorUnit ?? '');
  const factorSource = String(rawFactorSource ?? '');
  const formula = String(rawFormula ?? '');
  const formulaDetailed = String(data.formula_detailed ?? data.formulaDetailed ?? '');

  const governanceDecision: string = failure.isFailure
    ? (failure.failureType || 'BLOCKED')
    : String(data.governance_decision ?? data.governanceDecision ?? data.status ?? 'READY FOR DISCLOSURE');

  const record: EmissionRecord = {
    id: String(data.record_id ?? submission.record_id ?? 'INV-001'),
    activity: String(data.activity ?? submission.activity),
    scope,
    quantity: Number(data.quantity ?? data.activity_quantity ?? data.activityQuantity ?? 0),
    unit: String(data.unit ?? submission.unit),
    emissions: totalEmissions,
    emissionsUnit: String(data.unit_emissions ?? data.emissionsUnit ?? 'tCO₂e'),
    status: failure.isFailure ? 'FLAGGED' : 'VERIFIED',
    factorValue,
    factorUnit,
    factorSource,
    formula,
    formulaDetailed,
    evidenceRef: data.evidence_ref ?? data.evidenceRef ?? '',
    governanceDecision,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    facility: String(data.facility ?? `${submission.location} Operations`),
  };

  const governanceStatus = {
    factorVerified: failure.failureType === 'FACTOR_NOT_FOUND' ? false : Boolean(data.factor_verified ?? data.factorVerified ?? !failure.isFailure),
    evidenceComplete: Boolean(data.evidence_complete ?? data.evidenceComplete ?? !failure.isFailure),
    noUnsupportedClaim: failure.failureType === 'UNSUPPORTED_CLAIM' ? false : Boolean(data.no_unsupported_claim ?? data.noUnsupportedClaim ?? !failure.isFailure),
    readyForDisclosure: !failure.isFailure && Boolean(data.ready_for_disclosure ?? data.readyForDisclosure ?? true),
    protocol: String(data.protocol ?? 'CarbonGuard governance gate'),
    assuranceStandard: String(data.assurance_standard ?? data.assuranceStandard ?? 'CarbonGuard evidence and disclosure controls'),
    agentGovernanceId: String(data.agent_governance_id ?? data.agentGovernanceId ?? `SUPERFLOW-GOV-${Date.now().toString().slice(-6)}`),
    lastRunTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    status: governanceDecision,
    reason: failure.isFailure ? failure.reason : undefined,
  };

  return {
    organization: String(data.organization ?? fallback.organization),
    reportingPeriod: String(data.reporting_period ?? data.reportingPeriod ?? fallback.reportingPeriod),
    generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    webhookSource: 'CarbonGuard ESG SuperFlow Live Webhook',
    kpis: {
      totalEmissions,
      scope1,
      scope2,
      scope3,
      unit: 'tCO₂e',
    },
    governance: governanceStatus,
    records: [record],
    auditTrail: {
      sourceRecord: record.id,
      activity: record.activity,
      scope: record.scope,
      factor: record.factorValue,
      factorUnit: record.factorUnit,
      factorSource: record.factorSource,
      formula: record.formula,
      formulaDetailed: record.formulaDetailed || formula,
      result: record.emissions,
      resultUnit: record.emissionsUnit,
      governance: governanceDecision,
      governanceDetails: {
        agentModel: 'CarbonGuard ESG SuperFlow Pipeline',
        rulesetVersion: 'UK Government GHG Conversion Factors 2026 / CarbonGuard governance rules',
        assuranceLevel: failure.isFailure ? `Action Required (${failure.failureType})` : 'Auditor-Ready Tier 1',
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      },
    },
  };
}
