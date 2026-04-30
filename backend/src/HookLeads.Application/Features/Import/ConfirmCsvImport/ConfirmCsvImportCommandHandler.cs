using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Import.ConfirmCsvImport;

public class ConfirmCsvImportCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentWorkspaceService _currentWorkspace;
    private readonly ILeadScoringService _scoringService;

    public ConfirmCsvImportCommandHandler(
        IApplicationDbContext context,
        ICurrentWorkspaceService currentWorkspace,
        ILeadScoringService scoringService)
    {
        _context = context;
        _currentWorkspace = currentWorkspace;
        _scoringService = scoringService;
    }

    public async Task<ImportSummaryResult> Handle(ConfirmCsvImportCommand command, CancellationToken cancellationToken = default)
    {
        if (command.Rows == null || command.Rows.Count == 0)
            throw new AppException("No rows provided for import.", 400);

        var workspaceId = _currentWorkspace.WorkspaceId
            ?? throw new AppException("Workspace context is required.", 401);

        var activeProfile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.IsActive, cancellationToken);

        var existingEmails = (await _context.Leads
            .Select(l => l.Email.ToLower())
            .ToListAsync(cancellationToken))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var imported = 0;
        var skipped = 0;
        var now = DateTime.UtcNow;

        foreach (var row in command.Rows)
        {
            var email = row.Email.Trim().ToLowerInvariant();

            if (existingEmails.Contains(email))
            {
                skipped++;
                continue;
            }

            var lead = new Lead
            {
                Id = Guid.NewGuid(),
                WorkspaceId = workspaceId,
                FirstName = row.FirstName.Trim(),
                LastName = row.LastName.Trim(),
                Email = email,
                JobTitle = row.JobTitle?.Trim(),
                Company = row.Company?.Trim(),
                Industry = row.Industry?.Trim(),
                CompanySize = row.CompanySize?.Trim(),
                Geography = row.Geography?.Trim(),
                RevenueRange = row.RevenueRange?.Trim(),
                LinkedInUrl = row.LinkedInUrl?.Trim(),
                Source = LeadSource.CSV,
                Status = LeadStatus.New,
                ImportedAt = now
            };

            if (activeProfile != null && activeProfile.Criteria.Any())
            {
                var (score, breakdown) = _scoringService.CalculateScore(lead, activeProfile);
                lead.IcpScore = score;
                lead.ScoreBreakdown = breakdown;
            }

            _context.Leads.Add(lead);
            existingEmails.Add(email);
            imported++;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new ImportSummaryResult(imported, skipped, command.Rows.Count);
    }
}
