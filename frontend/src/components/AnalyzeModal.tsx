import React, { useState } from 'react';
import { CarbonGuardPayload } from '../types';
import { initialDemoPayload } from '../data/demoData';
import {
  DEFAULT_ESG_RECORD,
  executeSuperFlowWebhook,
} from '../services/superflowService';
import {
  SuperFlowSubmissionPayload,
  mapSuperFlowResponseToPayload,
  detectGovernanceFailure,
} from '../services/superflowMapper';
import {
  X,
  Play,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Database,
  AlertCircle,
  Send,
  AlertTriangle,
  RotateCcw,
  Sliders,
} from 'lucide-react';

interface AnalyzeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPayload: CarbonGuardPayload;
  onApplyPayload: (payload: CarbonGuardPayload) => void;
}

export const AnalyzeModal: React.FC<AnalyzeModalProps> = ({
  isOpen,
  onClose,
  currentPayload,
  onApplyPayload,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'json' | 'test_scenarios'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // 11 Required Fields for SuperFlow Payload
  const [formData, setFormData] = useState<SuperFlowSubmissionPayload>({
    ...DEFAULT_ESG_RECORD,
  });

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof SuperFlowSubmissionPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'quantity' || field === 'year' ? Number(value) : value,
    }));
    setSubmissionError(null);
  };

  /**
   * Submit the 11-field activity record to the SuperFlow webhook
   */
  const handleSubmitToSuperFlow = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      const response = await executeSuperFlowWebhook(formData);

      if (!response.success) {
        // If HTTP error or webhook endpoint returned an error
        const errMsg = response.error || 'SuperFlow webhook execution failed';
        setSubmissionError(`SuperFlow Webhook: ${errMsg}`);

        // Check if data itself returned a failure state even in error envelope
        if (response.data) {
          const failure = detectGovernanceFailure(response.data);
          if (failure.isFailure) {
            const mapped = mapSuperFlowResponseToPayload(response.data, formData, currentPayload);
            onApplyPayload(mapped);
          }
        }
        setIsSubmitting(false);
        return;
      }

      // Successful HTTP response from SuperFlow
      const rawData = response.data;
      const failure = detectGovernanceFailure(rawData);

      // Map returned fields into the existing dashboard payload
      const mappedPayload = mapSuperFlowResponseToPayload(rawData, formData, currentPayload);
      onApplyPayload(mappedPayload);

      if (failure.isFailure) {
        setSubmissionSuccess(
          `SuperFlow executed. Governance decision: ${failure.failureType} (${failure.reason}). Dashboard governance area updated accordingly.`
        );
      } else {
        setSubmissionSuccess(
          `SuperFlow executed successfully! Lineage verified and total footprint updated to ${mappedPayload.kpis.totalEmissions} ${mappedPayload.kpis.unit}.`
        );
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Apply a specific simulated SuperFlow governance response for immediate testing
   */
  const handleSimulateScenario = (scenario: 'VERIFIED' | 'REVIEW_REQUIRED' | 'FACTOR_NOT_FOUND' | 'UNSUPPORTED_CLAIM' | 'BLOCKED') => {
    let mockResponse: any;

    switch (scenario) {
      case 'VERIFIED':
        mockResponse = {
          status: 'READY FOR DISCLOSURE',
          record_id: formData.record_id,
          activity: formData.activity,
          scope: formData.scope,
          quantity: formData.quantity,
          unit: formData.unit,
          total_emissions: 6.653875,
          scope_1: 6.653875,
          scope_2: 0,
          scope_3: 0,
          emission_factor: 2.66155,
          factor_unit: 'kg CO₂e/litre',
          factor_source: 'UK Government GHG Conversion Factors 2026',
          deterministic_formula: `${formData.quantity} × 2.66155`,
          governance_decision: 'READY FOR DISCLOSURE',
          ready_for_disclosure: true,
          factor_verified: true,
          evidence_complete: true,
          no_unsupported_claim: true,
        };
        break;

      case 'REVIEW_REQUIRED':
        mockResponse = {
          status: 'REVIEW_REQUIRED',
          failure_reason: 'Unusual volumetric variance detected against historical Q3 diesel consumption. Auditor sign-off required.',
          record_id: formData.record_id,
          activity: formData.activity,
          scope: formData.scope,
          quantity: formData.quantity,
          unit: formData.unit,
          total_emissions: 6.653875,
          governance_decision: 'REVIEW_REQUIRED',
          ready_for_disclosure: false,
          factor_verified: true,
          evidence_complete: false,
          no_unsupported_claim: true,
        };
        break;

      case 'FACTOR_NOT_FOUND':
        mockResponse = {
          status: 'FACTOR_NOT_FOUND',
          failure_reason: 'Specified fuel category or subtype has no official DEFRA/GHG 2026 registered conversion factor.',
          record_id: formData.record_id,
          activity: formData.activity,
          scope: formData.scope,
          quantity: formData.quantity,
          unit: formData.unit,
          total_emissions: 0,
          emission_factor: 0,
          governance_decision: 'FACTOR_NOT_FOUND',
          ready_for_disclosure: false,
          factor_verified: false,
          evidence_complete: true,
          no_unsupported_claim: false,
        };
        break;

      case 'UNSUPPORTED_CLAIM':
        mockResponse = {
          status: 'UNSUPPORTED_CLAIM',
          failure_reason: 'Primary source meter certificate missing or supplier validity lapsed. Unsupported carbon claim suppressed.',
          record_id: formData.record_id,
          activity: formData.activity,
          scope: formData.scope,
          quantity: formData.quantity,
          unit: formData.unit,
          total_emissions: 6.653875,
          governance_decision: 'UNSUPPORTED_CLAIM',
          ready_for_disclosure: false,
          factor_verified: true,
          evidence_complete: false,
          no_unsupported_claim: false,
        };
        break;

      case 'BLOCKED':
        mockResponse = {
          status: 'BLOCKED',
          failure_reason: 'Transaction blocked by agentic governance rules: non-compliant reporting boundary.',
          record_id: formData.record_id,
          activity: formData.activity,
          scope: formData.scope,
          quantity: formData.quantity,
          unit: formData.unit,
          total_emissions: 0,
          governance_decision: 'BLOCKED',
          ready_for_disclosure: false,
          factor_verified: false,
          evidence_complete: false,
          no_unsupported_claim: false,
        };
        break;
    }

    const mapped = mapSuperFlowResponseToPayload(mockResponse, formData, currentPayload);
    onApplyPayload(mapped);
    setSubmissionSuccess(`Simulated SuperFlow response applied: ${scenario}`);
    setSubmissionError(null);
  };

  const handleResetToDemo = () => {
    setFormData({ ...DEFAULT_ESG_RECORD });
    onApplyPayload(initialDemoPayload);
    setSubmissionSuccess('Dashboard restored to default CarbonGuard demo record.');
    setSubmissionError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                CarbonGuard ESG SuperFlow Webhook
              </h3>
              <p className="text-xs text-slate-500">
                Direct integration with SuperFlow execution pipeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit Activity Record</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Payload JSON</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('test_scenarios')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'test_scenarios'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Governance Scenarios</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          
          {/* Status Banners */}
          {submissionError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Execution Notice</strong>
                <span>{submissionError}</span>
                <p className="mt-1 text-[11px] text-rose-700">
                  Fallback demo data is preserved on the dashboard. You can configure WORKFLOW_ID / SUPERFLOW_API_KEY in the environment if required.
                </p>
              </div>
            </div>
          )}

          {submissionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">SuperFlow Synchronized</strong>
                <span>{submissionSuccess}</span>
              </div>
            </div>
          )}

          {/* TAB 1: 11-Field Frontend Form */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Fill in the activity record fields to send to the SuperFlow webhook:
                </p>
                <button
                  type="button"
                  onClick={handleResetToDemo}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset to INV-001 defaults
                </button>
              </div>

              {/* Grid Form for 11 Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Record ID (`record_id`)
                  </label>
                  <input
                    type="text"
                    value={formData.record_id}
                    onChange={(e) => handleFieldChange('record_id', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="INV-001"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Activity (`activity`)
                  </label>
                  <input
                    type="text"
                    value={formData.activity}
                    onChange={(e) => handleFieldChange('activity', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="Diesel (100% mineral diesel)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Quantity (`quantity`)
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleFieldChange('quantity', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Unit (`unit`)
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleFieldChange('unit', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="litres"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Date (`date`)
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Location (`location`)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="United Kingdom"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Supplier (`supplier`)
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => handleFieldChange('supplier', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="ABC Fuels Ltd."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Scope (`scope`)
                  </label>
                  <select
                    value={formData.scope}
                    onChange={(e) => handleFieldChange('scope', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Scope 1">Scope 1</option>
                    <option value="Scope 2">Scope 2</option>
                    <option value="Scope 3">Scope 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Reporting Year (`year`)
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleFieldChange('year', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="2026"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category (`category`)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="Liquid fuels"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Fuel Subtype (`fuel_subtype`)
                  </label>
                  <input
                    type="text"
                    value={formData.fuel_subtype}
                    onChange={(e) => handleFieldChange('fuel_subtype', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="diesel"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-100 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span>Webhook target: <code className="font-mono text-slate-700">/api/superflow/execute</code></span>
                <span className="font-semibold text-emerald-800">Secrets Protected Server-Side</span>
              </div>
            </div>
          )}

          {/* TAB 2: JSON Payload View */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Exact HTTP POST JSON payload dispatched to SuperFlow webhook:
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 3: Governance Scenarios for Testing Failure States */}
          {activeTab === 'test_scenarios' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Test and verify explicit failure state handling on the dashboard (Requirement 7):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSimulateScenario('VERIFIED')}
                  className="p-3 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    READY FOR DISCLOSURE
                  </span>
                  <span className="text-[11px] text-emerald-700 mt-0.5 block">
                    All 4 governance checks pass. 6.653875 tCO₂e verified.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScenario('REVIEW_REQUIRED')}
                  className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    REVIEW_REQUIRED
                  </span>
                  <span className="text-[11px] text-amber-800 mt-0.5 block">
                    Volumetric variance flagged. Disclosure blocked pending review.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScenario('FACTOR_NOT_FOUND')}
                  className="p-3 text-left rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                    FACTOR_NOT_FOUND
                  </span>
                  <span className="text-[11px] text-rose-800 mt-0.5 block">
                    Factor not in 2026 registry. Zero emissions calculated.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScenario('UNSUPPORTED_CLAIM')}
                  className="p-3 text-left rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                    UNSUPPORTED_CLAIM
                  </span>
                  <span className="text-[11px] text-rose-800 mt-0.5 block">
                    Primary evidence missing. Disclosure suppressed.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScenario('BLOCKED')}
                  className="p-3 text-left rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-colors cursor-pointer sm:col-span-2"
                >
                  <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                    BLOCKED
                  </span>
                  <span className="text-[11px] text-rose-800 mt-0.5 block">
                    Transaction blocked by agentic governance ruleset.
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmitToSuperFlow}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs disabled:opacity-60 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Executing SuperFlow Webhook...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit to SuperFlow Webhook</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
