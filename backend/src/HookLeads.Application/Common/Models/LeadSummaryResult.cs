namespace HookLeads.Application.Common.Models;

public record LeadSummaryResult(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Company,
    string? JobTitle,
    string Status,
    string Source,
    DateTime ImportedAt);
