using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HookLeads.Application.Features.IcpProfiles.UpdateIcpProfile;

public class UpdateIcpProfileCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ILeadScoringService _scoringService;
    private readonly ILogger<UpdateIcpProfileCommandHandler> _logger;

    public UpdateIcpProfileCommandHandler(
        IApplicationDbContext context,
        ILeadScoringService scoringService,
        ILogger<UpdateIcpProfileCommandHandler> logger)
    {
        _context = context;
        _scoringService = scoringService;
        _logger = logger;
    }

    public async Task<IcpProfileResult> Handle(UpdateIcpProfileCommand command, Guid profileId, CancellationToken ct = default)
    {
        var profile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.Id == profileId, ct)
            ?? throw new AppException("ICP profile not found.", 404);

        profile.Name = command.Name.Trim();
        profile.Industries = command.Industries;
        profile.JobTitles = command.JobTitles;
        profile.CompanySizeMin = command.CompanySizeMin;
        profile.CompanySizeMax = command.CompanySizeMax;
        profile.Locations = command.Locations;
        profile.DecisionMaker = command.DecisionMaker;
        profile.PainPoints = command.PainPoints;
        profile.BudgetMin = command.BudgetMin;
        profile.BudgetMax = command.BudgetMax;
        profile.BuyingTriggers = command.BuyingTriggers;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        if (profile.IsActive)
        {
            try
            {
                await _scoringService.RescoreWorkspaceLeadsAsync(ct);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                // Rescoring is best-effort; do not block the update response if it fails.
                _logger.LogWarning(ex,
                    "Lead rescoring failed after ICP update for profile {ProfileId}. Update was saved successfully.",
                    profileId);
            }
        }

        return profile.ToIcpProfileResult();
    }
}
