namespace HookLeads.Application.Common.Models;

public record LeadResult(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? JobTitle,
    string? Company,
    string? Industry,
    string? CompanySize,
    string? Geography,
    string? RevenueRange,
    string? LinkedInUrl,
    string Source,
    string Status,
    string? Notes,
    DateTime ImportedAt);
