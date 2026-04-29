using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Icp.UpdateIcpProfile;

public class UpdateIcpProfileCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ILeadScoringService _scoringService;

    public UpdateIcpProfileCommandHandler(
        IApplicationDbContext context,
        ILeadScoringService scoringService)
    {
        _context = context;
        _scoringService = scoringService;
    }

    public async Task<IcpProfileResult> Handle(UpdateIcpProfileCommand command, Guid profileId, CancellationToken cancellationToken = default)
    {
        var profile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

        if (profile == null)
            throw new AppException("ICP profile not found.", 404);

        var wasActive = profile.IsActive;

        if (command.IsActive && !profile.IsActive)
        {
            // Deactivate any other active profiles in this workspace (global filter scopes to workspace).
            var otherActive = await _context.IcpProfiles
                .Where(p => p.IsActive && p.Id != profileId)
                .ToListAsync(cancellationToken);

            foreach (var p in otherActive)
                p.IsActive = false;
        }

        profile.Name = command.Name.Trim();
        profile.IsActive = command.IsActive;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        if (wasActive != profile.IsActive)
            await _scoringService.RescoreWorkspaceLeadsAsync(cancellationToken);

        var criteria = profile.Criteria
            .Select(c => new IcpCriterionResult(c.Id, c.CriterionType.ToString(), c.Value, c.Weight))
            .ToList();

        return new IcpProfileResult(profile.Id, profile.Name, profile.IsActive, profile.UpdatedAt, criteria);
    }
}
