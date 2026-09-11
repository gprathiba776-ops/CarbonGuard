/**
 * CarbonGuard AI — Enterprise ESG Carbon Accounting Type Definitions
 * Compatible with CarbonGuard ESG SuperFlow Webhook JSON output.
 */

export type ScopeType = 'Scope 1' | 'Scope 2' | 'Scope 3';

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'IN_REVIEW';

export interface EmissionRecord {
  id: string;                      // e.g. "INV-001"
  activity: string;                // e.g. "Diesel (100% mineral diesel)"
  scope: ScopeType;                // e.g. "Scope 1"
  quantity: number;                // e.g. 2500
  unit: string;                    // e.g. "litres"
  emissions: number;               // e.g. 6.653875
  emissionsUnit: string;           // e.g. "tCO₂e"
  status: VerificationStatus;      // e.g. "VERIFIED"
  factorValue: number;             // e.g. 2.66155
  factorUnit: string;              // e.g. "kg CO₂e/litre"
  factorSource: string;            // e.g. "UK Government GHG Conversion Factors 2026"
  formula: string;                 // e.g. "2500 × 2.66155"
  formulaDetailed?: string;        // e.g. "(2,500 litres × 2.66155 kg CO₂e/litre) ÷ 1,000 = 6.653875 tCO₂e"
  evidenceRef?: string;            // e.g. "Fuel_Receipt_BP_INV001.pdf"
  governanceDecision: string;      // e.g. "READY FOR DISCLOSURE"
  timestamp?: string;              // e.g. "2026-09-08 11:42:15 UTC"
  facility?: string;               // e.g. "Logistics Depot - Sector 4"
}

export interface AuditTrailStep {
  stepNumber: number;
  label: string;
  value: string;
  subValue?: string;
  badge?: string;
  verified: boolean;
}

export interface AuditTrailData {
  sourceRecord: string;            // "INV-001"
  activity: string;                // "Diesel (100% mineral diesel)"
  scope: ScopeType;                // "Scope 1"
  factor: number;                  // 2.66155
  factorUnit: string;              // "kg CO₂e/litre"
  factorSource: string;            // "UK Government GHG Conversion Factors 2026"
  formula: string;                 // "2500 × 2.66155"
  formulaDetailed: string;         // "(2,500 × 2.66155) ÷ 1,000 = 6.653875 tCO₂e"
  result: number;                  // 6.653875
  resultUnit: string;              // "tCO₂e"
  governance: string;              // "READY FOR DISCLOSURE"
  governanceDetails?: {
    agentModel: string;
    rulesetVersion: string;
    assuranceLevel: string;
    verifiedAt: string;
  };
}

export interface GovernanceStatusData {
  factorVerified: boolean;
  evidenceComplete: boolean;
  noUnsupportedClaim: boolean;
  readyForDisclosure: boolean;
  protocol: string;
  assuranceStandard: string;
  agentGovernanceId: string;
  lastRunTimestamp: string;
  status?: string;
  reason?: string;
}

export interface KpiData {
  totalEmissions: number;
  scope1: number;
  scope2: number;
  scope3: number;
  unit: string;
}

export interface CarbonGuardPayload {
  organization: string;
  reportingPeriod: string;
  generatedAt: string;
  webhookSource: string;
  kpis: KpiData;
  governance: GovernanceStatusData;
  records: EmissionRecord[];
  auditTrail: AuditTrailData;
  isLiveWebhookData?: boolean;
  failureReason?: string;
}
