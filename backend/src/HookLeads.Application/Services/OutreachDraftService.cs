using HookLeads.Application.Common.Interfaces;
using HookLeads.Domain.Entities;

namespace HookLeads.Application.Services;

public class OutreachDraftService : IOutreachDraftService
{
    public (string subject, string body) GenerateDraft(Lead lead)
    {
        var firstName = lead.FirstName;
        var company = string.IsNullOrWhiteSpace(lead.Company) ? "your organisation" : lead.Company;
        var jobTitle = string.IsNullOrWhiteSpace(lead.JobTitle) ? "your role" : lead.JobTitle;
        var industry = string.IsNullOrWhiteSpace(lead.Industry) ? "your industry" : lead.Industry;

        var subject = $"{firstName}, quick note about {company}";

        var scoreNote = lead.IcpScore.HasValue
            ? $"Your profile scores {lead.IcpScore} against our ideal customer criteria, which tells us there could be a strong fit."
            : "Based on what I know about your space, I think there could be a strong fit.";

        var body = $"""
            Hi {firstName},

            I came across {company} and wanted to reach out directly.

            As someone in a {jobTitle} role within the {industry} space, I think you'll appreciate what we've built.

            {scoreNote}

            I'd love to set up a quick 20-minute call to explore whether there's a match. Would you be open to connecting this week?

            Best regards,
            [Your Name]
            """;

        return (subject, body);
    }
}
