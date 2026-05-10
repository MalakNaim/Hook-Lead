using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.UpdateLead;

public class UpdateLeadCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ILeadScoringService _scoringService;

    public UpdateLeadCommandHandler(
        IApplicationDbContext context,
        ILeadScoringService scoringService)
    {
        _context = context;
        _scoringService = scoringService;
    }

    public async Task<LeadResult> Handle(UpdateLeadCommand command, Guid leadId, CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        var emailChanged = !string.Equals(lead.Email, command.Email.Trim(), StringComparison.OrdinalIgnoreCase);
        if (emailChanged)
        {
            var emailTaken = await _context.Leads
                .AnyAsync(l => l.Id != leadId && l.Email == command.Email.Trim(), cancellationToken);
            if (emailTaken)
                throw new AppException("A lead with this email already exists in this workspace.", 409);
        }

        lead.FirstName = command.FirstName.Trim();
        lead.LastName = command.LastName.Trim();
        lead.Email = command.Email.Trim().ToLowerInvariant();
        lead.JobTitle = command.JobTitle?.Trim();
        lead.Company = command.Company?.Trim();
        lead.Industry = command.Industry?.Trim();
        lead.CompanySize = command.CompanySize?.Trim();
        lead.Geography = command.Geography?.Trim();
        lead.RevenueRange = command.RevenueRange?.Trim();
        lead.LinkedInUrl = command.LinkedInUrl?.Trim();
        lead.CompanyWebsite = command.CompanyWebsite?.Trim();
        lead.Phone = command.Phone?.Trim();
        lead.WhatsApp = command.WhatsApp?.Trim();

        if (command.EmailVerificationStatus != null
            && Enum.TryParse<EmailVerificationStatus>(command.EmailVerificationStatus, ignoreCase: true, out var ev))
            lead.EmailVerificationStatus = ev;

        if (command.EnrichmentStatus != null
            && Enum.TryParse<EnrichmentStatus>(command.EnrichmentStatus, ignoreCase: true, out var enrichment))
            lead.EnrichmentStatus = enrichment;

        if (command.QualificationStatus != null
            && Enum.TryParse<QualificationStatus>(command.QualificationStatus, ignoreCase: true, out var qual))
            lead.QualificationStatus = qual;

        if (command.QualificationNotes != null)
            lead.QualificationNotes = command.QualificationNotes.Trim();

        if (command.HandoffStatus != null
            && Enum.TryParse<HandoffStatus>(command.HandoffStatus, ignoreCase: true, out var handoff))
            lead.HandoffStatus = handoff;

        if (command.HandoffTarget != null)
            lead.HandoffTarget = command.HandoffTarget.Trim();

        await _context.SaveChangesAsync(cancellationToken);

        var activeProfile = await _context.IcpProfiles
            .FirstOrDefaultAsync(p => p.IsActive, cancellationToken);

        if (activeProfile != null)
        {
            _scoringService.ScoreLead(lead, activeProfile);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return lead.ToLeadResult();
    }
}
