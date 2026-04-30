using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Import.ConfirmLinkedInImport;

public class ConfirmLinkedInImportCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentWorkspaceService _currentWorkspace;
    private readonly ILeadScoringService _scoringService;

    public ConfirmLinkedInImportCommandHandler(
        IApplicationDbContext context,
        ICurrentWorkspaceService currentWorkspace,
        ILeadScoringService scoringService)
    {
        _context = context;
        _currentWorkspace = currentWorkspace;
        _scoringService = scoringService;
    }

    public async Task<LeadResult> Handle(ConfirmLinkedInImportCommand command, CancellationToken cancellationToken = default)
    {
        var workspaceId = _currentWorkspace.WorkspaceId
            ?? throw new AppException("Workspace context is required.", 401);
        var email = command.Email.Trim().ToLowerInvariant();

        var duplicate = await _context.Leads
            .AnyAsync(l => l.Email == email, cancellationToken);

        if (duplicate)
            throw new AppException("A lead with this email already exists in this workspace.", 409);

        var activeProfile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.IsActive, cancellationToken);

        var lead = new Lead
        {
            Id = Guid.NewGuid(),
            WorkspaceId = workspaceId,
            FirstName = command.FirstName.Trim(),
            LastName = command.LastName.Trim(),
            Email = email,
            JobTitle = command.JobTitle?.Trim(),
            Company = command.Company?.Trim(),
            Industry = command.Industry?.Trim(),
            CompanySize = command.CompanySize?.Trim(),
            Geography = command.Geography?.Trim(),
            RevenueRange = command.RevenueRange?.Trim(),
            LinkedInUrl = command.LinkedInUrl?.Trim(),
            Source = LeadSource.LinkedInUrl,
            Status = LeadStatus.New,
            ImportedAt = DateTime.UtcNow
        };

        if (activeProfile != null && activeProfile.Criteria.Any())
        {
            var (score, breakdown) = _scoringService.CalculateScore(lead, activeProfile);
            lead.IcpScore = score;
            lead.ScoreBreakdown = breakdown;
        }

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
