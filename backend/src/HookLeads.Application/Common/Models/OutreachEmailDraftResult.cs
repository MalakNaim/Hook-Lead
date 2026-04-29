namespace HookLeads.Application.Common.Models;

public record OutreachEmailDraftResult(
    string To,
    string Subject,
    string Body,
    string MailtoUrl);
