using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Icp.AddIcpCriterion;

public class AddIcpCriterionCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ILeadScoringService _scoringService;

    public AddIcpCriterionCommandHandler(IApplicationDbContext context, ILeadScoringService scoringService)
    {
        _context = context;
        _scoringService = scoringService;
    }

    public async Task<IcpCriterionResult> Handle(AddIcpCriterionCommand command, Guid profileId, CancellationToken cancellationToken = default)
    {
        // Global query filter ensures the profile belongs to the current workspace.
        var profile = await _context.IcpProfiles
            .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

        if (profile == null)
            throw new AppException("ICP profile not found.", 404);

        var criterion = new IcpCriterion
        {
            Id = Guid.NewGuid(),
            IcpProfileId = profileId,
            CriterionType = Enum.Parse<CriterionType>(command.CriterionType, ignoreCase: true),
            Value = command.Value.Trim(),
            Weight = command.Weight
        };

        profile.UpdatedAt = DateTime.UtcNow;

        _context.IcpCriteria.Add(criterion);
        await _context.SaveChangesAsync(cancellationToken);

        if (profile.IsActive)
            await _scoringService.RescoreWorkspaceLeadsAsync(cancellationToken);

        return new IcpCriterionResult(criterion.Id, criterion.CriterionType.ToString(), criterion.Value, criterion.Weight);
    }
}
