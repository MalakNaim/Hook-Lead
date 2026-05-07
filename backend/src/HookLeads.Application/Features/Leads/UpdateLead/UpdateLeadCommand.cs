namespace HookLeads.Application.Features.Leads.UpdateLead;

public record UpdateLeadCommand(
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
    // New contact fields
    string? CompanyWebsite,
    string? Phone,
    string? WhatsApp,
    string? EmailVerificationStatus,
    string? EnrichmentStatus,
    string? QualificationStatus,
    string? QualificationNotes,
    string? HandoffStatus,
    string? HandoffTarget);
