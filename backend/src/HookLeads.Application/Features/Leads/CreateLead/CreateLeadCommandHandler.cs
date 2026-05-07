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
            Source = LeadSource.Manual,
            Status = LeadStatus.New,
            ImportedAt = DateTime.UtcNow,
        };

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
