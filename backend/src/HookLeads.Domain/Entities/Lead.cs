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
    public LeadSource Source { get; set; }
    public LeadStatus Status { get; set; }
    public string? Notes { get; set; }
    public int? IcpScore { get; set; }
    public string? ScoreBreakdown { get; set; }
    public DateTime ImportedAt { get; set; }
    public Workspace Workspace { get; set; } = null!;
}
