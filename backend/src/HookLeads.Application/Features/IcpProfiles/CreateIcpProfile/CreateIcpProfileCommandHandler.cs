using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.IcpProfiles.CreateIcpProfile;

public class CreateIcpProfileCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentWorkspaceService _currentWorkspace;
    private readonly ILeadScoringService _scoringService;

    public CreateIcpProfileCommandHandler(
        IApplicationDbContext context,
        ICurrentWorkspaceService currentWorkspace,
        ILeadScoringService scoringService)
    {
        _context = context;
        _currentWorkspace = currentWorkspace;
        _scoringService = scoringService;
    }

    public async Task<IcpProfileResult> Handle(CreateIcpProfileCommand command, CancellationToken ct = default)
    {
        var workspaceId = _currentWorkspace.WorkspaceId
            ?? throw new AppException("Workspace context is required.", 401);

        // Deactivate any existing active profiles — one active ICP per workspace.
        var activeProfiles = await _context.IcpProfiles
            .Where(p => p.IsActive)
            .ToListAsync(ct);

        foreach (var p in activeProfiles)
            p.IsActive = false;

        var profile = new IcpProfile
        {
            Id = Guid.NewGuid(),
            WorkspaceId = workspaceId,
            Name = command.Name.Trim(),
            IsActive = true,
            UpdatedAt = DateTime.UtcNow,
            Industries = command.Industries,
            JobTitles = command.JobTitles,
            CompanySizeMin = command.CompanySizeMin,
            CompanySizeMax = command.CompanySizeMax,
            Locations = command.Locations,
            DecisionMaker = command.DecisionMaker,
            PainPoints = command.PainPoints,
            BudgetMin = command.BudgetMin,
            BudgetMax = command.BudgetMax,
            BuyingTriggers = command.BuyingTriggers
        };

        _context.IcpProfiles.Add(profile);
        await _context.SaveChangesAsync(ct);

        await _scoringService.RescoreWorkspaceLeadsAsync(ct);

        return profile.ToIcpProfileResult();
    }
}
