import { describe, expect, it } from 'vitest';
import {
  detectGovernanceFailure,
  mapSuperFlowResponseToPayload,
  type SuperFlowSubmissionPayload,
} from '../superflowMapper';

const submission: SuperFlowSubmissionPayload = {
  record_id: 'TEST-001',
  activity: 'Diesel (100% mineral diesel)',
  quantity: 2500,
  unit: 'litres',
  date: '2026-09-01',
  location: 'United Kingdom',
  supplier: 'ABC Fuels Ltd.',
  scope: 'Scope 1',
  year: 2026,
  category: 'Liquid fuels',
  fuel_subtype: 'diesel',
};

describe('SuperFlow governance mapping', () => {
  it('detects blocked and failure states without ambiguity', () => {
    expect(detectGovernanceFailure({ status: 'REVIEW_REQUIRED' }).failureType).toBe('REVIEW_REQUIRED');
    expect(detectGovernanceFailure({ status: 'FACTOR_NOT_FOUND' }).failureType).toBe('FACTOR_NOT_FOUND');
    expect(detectGovernanceFailure({ status: 'UNSUPPORTED_CLAIM' }).failureType).toBe('UNSUPPORTED_CLAIM');
    expect(detectGovernanceFailure({ status: 'BLOCKED' }).failureType).toBe('BLOCKED');
  });

  it('never substitutes demo emissions when a live response is incomplete', () => {
    const result = mapSuperFlowResponseToPayload({ record_id: 'TEST-001', status: 'READY_FOR_DISCLOSURE' }, submission);
    expect(result.governance.readyForDisclosure).toBe(false);
    expect(result.governance.status).toBe('REVIEW_REQUIRED');
    expect(result.records[0].status).toBe('FLAGGED');
    expect(result.records[0].emissions).toBe(0);
    expect(result.records[0].factorValue).toBe(0);
    expect(result.records[0].factorSource).toBe('');
  });

  it('maps a verified live result without recalculating it', () => {
    const result = mapSuperFlowResponseToPayload({
      record_id: 'TEST-001',
      activity: submission.activity,
      quantity: 2500,
      unit: 'litres',
      scope: 'Scope 1',
      emissions_tco2e: 6.653875,
      emission_factor: 2.66155,
      factor_unit: 'kg CO2e per litres',
      factor_source: 'UK Government GHG Conversion Factors 2026 — revised July 2026 flat file',
      formula: '2500 × 2.66155',
      governance_status: 'READY_FOR_DISCLOSURE',
    }, submission);

    expect(result.governance.readyForDisclosure).toBe(true);
    expect(result.records[0].emissions).toBe(6.653875);
    expect(result.records[0].factorValue).toBe(2.66155);
    expect(result.records[0].formula).toBe('2500 × 2.66155');
  });
});
