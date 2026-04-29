namespace HookLeads.Application.Common.Models;

public record OutreachMessageResult(
    Guid Id,
    Guid LeadId,
    string Subject,
    string Body,
    string Status,
    DateTime CreatedAt,
    DateTime? SentAt);
