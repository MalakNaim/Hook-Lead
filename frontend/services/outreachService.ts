import { apiFetch } from '@/lib/api';
import type {
  OutreachMessage,
  OutreachEmailDraftResult,
  OutreachStatus,
} from '@/types';

export async function getOutreachMessages(
  leadId: string,
): Promise<OutreachMessage[]> {
  return apiFetch<OutreachMessage[]>(`/api/outreach/leads/${leadId}/messages`);
}

export async function generateOutreachMessage(
  leadId: string,
): Promise<OutreachMessage> {
  return apiFetch<OutreachMessage>(`/api/outreach/leads/${leadId}/generate`, {
    method: 'POST',
  });
}

export async function getOutreachEmailDraft(
  messageId: string,
): Promise<OutreachEmailDraftResult> {
  return apiFetch<OutreachEmailDraftResult>(
    `/api/outreach/messages/${messageId}/email-draft`,
  );
}

export async function updateOutreachMessageStatus(
  messageId: string,
  status: OutreachStatus,
): Promise<OutreachMessage> {
  return apiFetch<OutreachMessage>(
    `/api/outreach/messages/${messageId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
  );
}
