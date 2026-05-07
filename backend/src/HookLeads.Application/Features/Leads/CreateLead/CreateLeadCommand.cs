namespace HookLeads.Application.Features.Leads.CreateLead;

public record CreateLeadCommand(
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
    string? Notes);
