using HookLeads.Application.Common.Exceptions;
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

    public ConfirmLinkedInImportCommandHandler(IApplicationDbContext context, ICurrentWorkspaceService currentWorkspace)
    {
        _context = context;
        _currentWorkspace = currentWorkspace;
    }

    public async Task<LeadResult> Handle(ConfirmLinkedInImportCommand command, CancellationToken cancellationToken = default)
    {
        var workspaceId = _currentWorkspace.WorkspaceId!.Value;
        var email = command.Email.Trim().ToLowerInvariant();

        var duplicate = await _context.Leads
            .AnyAsync(l => l.Email == email, cancellationToken);

        if (duplicate)
            throw new AppException("A lead with this email already exists in this workspace.", 409);

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

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync(cancellationToken);

        return new LeadResult(
            lead.Id, lead.FirstName, lead.LastName, lead.Email,
            lead.JobTitle, lead.Company, lead.Industry,
            lead.CompanySize, lead.Geography, lead.RevenueRange, lead.LinkedInUrl,
            lead.Source.ToString(), lead.Status.ToString(),
            lead.Notes, lead.ImportedAt);
    }
}
