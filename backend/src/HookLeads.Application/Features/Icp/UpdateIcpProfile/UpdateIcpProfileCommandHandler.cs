using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HookLeads.Application.Features.Icp.UpdateIcpProfile;

public class UpdateIcpProfileCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateIcpProfileCommandHandler> _logger;

    public UpdateIcpProfileCommandHandler(
        IApplicationDbContext context,
        ILogger<UpdateIcpProfileCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IcpProfileResult> Handle(UpdateIcpProfileCommand command, Guid profileId, CancellationToken cancellationToken = default)
    {
        var profile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

        if (profile == null)
            throw new AppException("ICP profile not found.", 404);

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

        // Rescore job placeholder — full implementation in Milestone 4.
        _logger.LogInformation(
            "ICP profile '{Name}' ({Id}) updated. Rescore job will be implemented in Milestone 4.",
            profile.Name, profile.Id);

        var criteria = profile.Criteria
            .Select(c => new IcpCriterionResult(c.Id, c.CriterionType.ToString(), c.Value, c.Weight))
            .ToList();

        return new IcpProfileResult(profile.Id, profile.Name, profile.IsActive, profile.UpdatedAt, criteria);
    }
}
