using HookLeads.Domain.Enums;

namespace HookLeads.Domain.Entities;

public class Lead
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? JobTitle { get; set; }
    public string? Company { get; set; }
    public string? Industry { get; set; }
    public string? CompanySize { get; set; }
    public string? Geography { get; set; }
    public string? RevenueRange { get; set; }
    public string? LinkedInUrl { get; set; }

    // New contact fields
    public string? CompanyWebsite { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public EmailVerificationStatus EmailVerificationStatus { get; set; } = EmailVerificationStatus.Unknown;

    // Enrichment
    public EnrichmentStatus EnrichmentStatus { get; set; } = EnrichmentStatus.Unknown;

    // Source / status
    public LeadSource Source { get; set; }
    public LeadStatus Status { get; set; }
    public string? Notes { get; set; }

    // Scoring — individual sub-scores
    public int JobTitleMatchScore { get; set; }
    public int IndustryMatchScore { get; set; }
    public int CompanySizeMatchScore { get; set; }
    public int PainMatchScore { get; set; }
    public int ActivitySignalsScore { get; set; }
    public int? IcpScore { get; set; }
    public string? ScoreBreakdown { get; set; }

    // Classification
    public LeadClassification? Classification { get; set; }

    // Qualification
    public QualificationStatus QualificationStatus { get; set; } = QualificationStatus.Unknown;
    public string? QualificationNotes { get; set; }

    // ICP matching metadata
    public Guid? IcpProfileId { get; set; }
    public string? MatchedCriteria { get; set; }
    public string? MismatchReasons { get; set; }

    // Handoff
    public HandoffStatus HandoffStatus { get; set; } = HandoffStatus.NotReady;
    public string? HandoffTarget { get; set; }
    public DateTime? HandoffAt { get; set; }

    public DateTime ImportedAt { get; set; }
    public Workspace Workspace { get; set; } = null!;
}
