using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.IcpProfiles.GetCurrentIcpProfile;

public record GetCurrentIcpProfileQuery;

public class GetCurrentIcpProfileQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetCurrentIcpProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IcpProfileResult?> Handle(GetCurrentIcpProfileQuery query, CancellationToken ct = default)
    {
        var profile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.IsActive, ct);

        return profile?.ToIcpProfileResult();
    }
}
