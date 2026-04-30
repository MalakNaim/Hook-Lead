using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.GetLeadById;

public class GetLeadByIdQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetLeadByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeadResult> Handle(GetLeadByIdQuery query, CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == query.LeadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        return lead.ToLeadResult();
    }
}
