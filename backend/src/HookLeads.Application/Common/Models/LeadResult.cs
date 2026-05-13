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

    // New contact fields
    string? CompanyWebsite,
    string? Phone,
    string? WhatsApp,
    string EmailVerificationStatus,

    // Enrichment
    string EnrichmentStatus,

    // Source / status
    string Source,
    string Status,
    string? Notes,

    // Scoring
    int JobTitleMatchScore,
    int IndustryMatchScore,
    int CompanySizeMatchScore,
    int PainMatchScore,
    int ActivitySignalsScore,
    int? IcpScore,
    string? ScoreBreakdown,

    // Classification + qualification
    string? Classification,
    string QualificationStatus,
    string? QualificationNotes,

    // ICP metadata
    Guid? IcpProfileId,
    string? MatchedCriteria,
    string? MismatchReasons,

    // Handoff
    string HandoffStatus,
    string? HandoffTarget,
    string? HandoffNotes,
    DateTime? HandoffAt,

    DateTime ImportedAt);
