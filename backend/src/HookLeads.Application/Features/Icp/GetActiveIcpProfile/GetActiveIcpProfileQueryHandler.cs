using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Icp.GetActiveIcpProfile;

public class GetActiveIcpProfileQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetActiveIcpProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IcpProfileResult?> Handle(GetActiveIcpProfileQuery query, CancellationToken cancellationToken = default)
    {
        // Global query filter scopes this to the current workspace automatically.
        var profile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.IsActive, cancellationToken);

        if (profile == null)
            return null;

        var criteria = profile.Criteria
            .OrderBy(c => c.CriterionType.ToString())
            .Select(c => new IcpCriterionResult(c.Id, c.CriterionType.ToString(), c.Value, c.Weight))
            .ToList();

        return new IcpProfileResult(profile.Id, profile.Name, profile.IsActive, profile.UpdatedAt, criteria);
    }
}
