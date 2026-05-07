using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;

namespace HookLeads.Application.Features.Leads.CreateLead;

public class CreateLeadCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentWorkspaceService _currentWorkspace;

    public CreateLeadCommandHandler(
        IApplicationDbContext context,
        ICurrentWorkspaceService currentWorkspace)
    {
        _context = context;
        _currentWorkspace = currentWorkspace;
    }

    public async Task<LeadResult> Handle(CreateLeadCommand command, CancellationToken cancellationToken = default)
    {
        var workspaceId = _currentWorkspace.WorkspaceId
            ?? throw new AppException("Workspace context is required.", 401);

        var source = command.Source != null && Enum.TryParse<LeadSource>(command.Source, ignoreCase: true, out var parsedSource)
            ? parsedSource
            : LeadSource.Manual;

        var emailVerification = command.EmailVerificationStatus != null
            && Enum.TryParse<EmailVerificationStatus>(command.EmailVerificationStatus, ignoreCase: true, out var parsedEv)
            ? parsedEv
            : EmailVerificationStatus.Unknown;

        var enrichment = command.EnrichmentStatus != null
            && Enum.TryParse<EnrichmentStatus>(command.EnrichmentStatus, ignoreCase: true, out var parsedEnrichment)
            ? parsedEnrichment
            : EnrichmentStatus.Unknown;

        var lead = new Lead
        {
            Id = Guid.NewGuid(),
            WorkspaceId = workspaceId,
            FirstName = command.FirstName.Trim(),
            LastName = command.LastName.Trim(),
            Email = command.Email.Trim(),
            JobTitle = command.JobTitle?.Trim(),
            Company = command.Company?.Trim(),
            Industry = command.Industry?.Trim(),
            CompanySize = command.CompanySize?.Trim(),
            Geography = command.Geography?.Trim(),
            RevenueRange = command.RevenueRange?.Trim(),
            LinkedInUrl = command.LinkedInUrl?.Trim(),
            Notes = command.Notes?.Trim(),
            CompanyWebsite = command.CompanyWebsite?.Trim(),
            Phone = command.Phone?.Trim(),
            WhatsApp = command.WhatsApp?.Trim(),
            EmailVerificationStatus = emailVerification,
            EnrichmentStatus = enrichment,
            Source = source,
            Status = LeadStatus.New,
            ImportedAt = DateTime.UtcNow,
        };

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
