import { apiFetch } from '@/lib/api';
import type {
  OutreachMessage,
  OutreachEmailDraftResult,
  OutreachStatus,
} from '@/types';

export async function getOutreachMessages(
  leadId: string,
): Promise<OutreachMessage[]> {
  return apiFetch<OutreachMessage[]>(`/leads/${leadId}/outreach/messages`);
}

export async function generateOutreachMessage(
  leadId: string,
): Promise<OutreachMessage> {
  return apiFetch<OutreachMessage>(`/leads/${leadId}/outreach/generate`, {
    method: 'POST',
  });
}

export async function getOutreachEmailDraft(
  messageId: string,
): Promise<OutreachEmailDraftResult> {
  return apiFetch<OutreachEmailDraftResult>(
    `/outreach/messages/${messageId}/email-draft`,
  );
}

export async function updateOutreachMessageStatus(
  messageId: string,
  status: OutreachStatus,
): Promise<OutreachMessage> {
  return apiFetch<OutreachMessage>(
    `/outreach/messages/${messageId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
  );
}
