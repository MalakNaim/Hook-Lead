using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Icp.UpdateIcpCriterion;

public class UpdateIcpCriterionCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ILeadScoringService _scoringService;

    public UpdateIcpCriterionCommandHandler(IApplicationDbContext context, ILeadScoringService scoringService)
    {
        _context = context;
        _scoringService = scoringService;
    }

    public async Task<IcpCriterionResult> Handle(UpdateIcpCriterionCommand command, Guid profileId, Guid criterionId, CancellationToken cancellationToken = default)
    {
        // Global query filter ensures profile belongs to the current workspace.
        var profile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

        if (profile == null)
            throw new AppException("ICP profile not found.", 404);

        var criterion = profile.Criteria.FirstOrDefault(c => c.Id == criterionId);

        if (criterion == null)
            throw new AppException("ICP criterion not found.", 404);

        if (!Enum.TryParse<CriterionType>(command.CriterionType, ignoreCase: true, out var criterionType))
            throw new AppException(
                $"Invalid criterion type '{command.CriterionType}'. Valid values are: {string.Join(", ", Enum.GetNames<CriterionType>())}.",
                400);

        criterion.CriterionType = criterionType;
        criterion.Value = command.Value.Trim();
        criterion.Weight = command.Weight;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        if (profile.IsActive)
            await _scoringService.RescoreWorkspaceLeadsAsync(cancellationToken);

        return new IcpCriterionResult(criterion.Id, criterion.CriterionType.ToString(), criterion.Value, criterion.Weight);
    }
}
