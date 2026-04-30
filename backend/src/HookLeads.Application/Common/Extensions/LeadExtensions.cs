using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;

namespace HookLeads.Application.Common.Extensions;

public static class LeadExtensions
{
    public static LeadResult ToLeadResult(this Lead lead) =>
        new(lead.Id, lead.FirstName, lead.LastName, lead.Email,
            lead.JobTitle, lead.Company, lead.Industry,
            lead.CompanySize, lead.Geography, lead.RevenueRange, lead.LinkedInUrl,
            lead.Source.ToString(), lead.Status.ToString(),
            lead.Notes, lead.ImportedAt,
            lead.IcpScore, lead.ScoreBreakdown);
}
