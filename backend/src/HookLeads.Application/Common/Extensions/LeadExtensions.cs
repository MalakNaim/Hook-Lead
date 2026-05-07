using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;

namespace HookLeads.Application.Common.Extensions;

public static class LeadExtensions
{
    public static LeadResult ToLeadResult(this Lead lead) =>
        new(
            lead.Id, lead.FirstName, lead.LastName, lead.Email,
            lead.JobTitle, lead.Company, lead.Industry,
            lead.CompanySize, lead.Geography, lead.RevenueRange, lead.LinkedInUrl,
            lead.CompanyWebsite, lead.Phone, lead.WhatsApp,
            lead.EmailVerificationStatus.ToString(),
            lead.EnrichmentStatus.ToString(),
            lead.Source.ToString(), lead.Status.ToString(),
            lead.Notes,
            lead.JobTitleMatchScore, lead.IndustryMatchScore,
            lead.CompanySizeMatchScore, lead.PainMatchScore, lead.ActivitySignalsScore,
            lead.IcpScore, lead.ScoreBreakdown,
            lead.Classification?.ToString(),
            lead.QualificationStatus.ToString(), lead.QualificationNotes,
            lead.IcpProfileId, lead.MatchedCriteria, lead.MismatchReasons,
            lead.HandoffStatus.ToString(), lead.HandoffTarget, lead.HandoffAt,
            lead.ImportedAt);

    public static LeadSummaryResult ToLeadSummaryResult(this Lead lead) =>
        new(
            lead.Id, lead.FirstName, lead.LastName, lead.Email,
            lead.Company, lead.JobTitle,
            lead.Status.ToString(), lead.Source.ToString(),
            lead.ImportedAt, lead.IcpScore,
            lead.Classification?.ToString(),
            lead.EnrichmentStatus.ToString(),
            lead.EmailVerificationStatus.ToString());
}
