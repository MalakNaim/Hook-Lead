using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Icp.DeleteIcpCriterion;

public class DeleteIcpCriterionCommandHandler
{
    private readonly IApplicationDbContext _context;

    public DeleteIcpCriterionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(Guid profileId, Guid criterionId, CancellationToken cancellationToken = default)
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

        _context.IcpCriteria.Remove(criterion);
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
