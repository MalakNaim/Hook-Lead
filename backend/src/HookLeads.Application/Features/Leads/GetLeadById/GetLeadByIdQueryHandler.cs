using HookLeads.Application.Common.Exceptions;
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
        // Global query filter scopes to current workspace automatically.
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == query.LeadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        return new LeadResult(
            lead.Id, lead.FirstName, lead.LastName, lead.Email,
            lead.JobTitle, lead.Company, lead.Industry,
            lead.CompanySize, lead.Geography, lead.RevenueRange, lead.LinkedInUrl,
            lead.Source.ToString(), lead.Status.ToString(),
            lead.Notes, lead.ImportedAt);
    }
}
