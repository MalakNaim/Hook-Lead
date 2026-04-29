using System.Text.Json;
using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.GetLeadScore;

public class GetLeadScoreQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetLeadScoreQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeadScoreResult> Handle(GetLeadScoreQuery query, CancellationToken cancellationToken = default)
    {
        // Global query filter enforces workspace isolation — returns null for leads outside the workspace.
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == query.LeadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        object? breakdown = null;
        if (lead.ScoreBreakdown != null)
            breakdown = JsonSerializer.Deserialize<JsonElement>(lead.ScoreBreakdown);

        return new LeadScoreResult(lead.Id, lead.IcpScore, breakdown);
    }
}
