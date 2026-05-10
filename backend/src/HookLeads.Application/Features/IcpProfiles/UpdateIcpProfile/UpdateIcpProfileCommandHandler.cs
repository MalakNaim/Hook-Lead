using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.IcpProfiles.UpdateIcpProfile;

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
            await _scoringService.RescoreWorkspaceLeadsAsync(ct);

        return profile.ToIcpProfileResult();
    }
}
