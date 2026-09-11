/**
 * CarbonGuard AI — SuperFlow Webhook Client Service
 * Sends ESG activity records to the SuperFlow proxy endpoint.
 * Keeps all webhook secrets on the server-side.
 */

import { SuperFlowSubmissionPayload } from './superflowMapper';

export interface SuperFlowExecutionResponse {
  success: boolean;
  status: number;
  data?: any;
  error?: string;
  isFailureState?: boolean;
}

export const DEFAULT_ESG_RECORD: SuperFlowSubmissionPayload = {
  record_id: 'INV-001',
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

/**
 * Executes the SuperFlow webhook via the secure backend proxy
 */
export async function executeSuperFlowWebhook(
  payload: SuperFlowSubmissionPayload
): Promise<SuperFlowExecutionResponse> {
  try {
    const response = await fetch('/api/superflow/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.error ||
        data?.message ||
        `SuperFlow webhook responded with HTTP ${response.status}: ${response.statusText}`;
      return {
        success: false,
        status: response.status,
        data,
        error: errorMessage,
      };
    }

    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      status: 0,
      error: err.message || 'Network error connecting to SuperFlow webhook proxy',
    };
  }
}
