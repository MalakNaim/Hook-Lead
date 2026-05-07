using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.GetLeads;

public class GetLeadsQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetLeadsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<LeadSummaryResult>> Handle(GetLeadsQuery query, CancellationToken cancellationToken = default)
    {
        var q = _context.Leads.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Status) &&
            Enum.TryParse<LeadStatus>(query.Status, ignoreCase: true, out var status))
        {
            q = q.Where(l => l.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(query.Industry))
            q = q.Where(l => l.Industry != null && l.Industry.Contains(query.Industry));

        if (query.DateFrom.HasValue)
            q = q.Where(l => l.ImportedAt >= query.DateFrom.Value);

        if (query.DateTo.HasValue)
            q = q.Where(l => l.ImportedAt <= query.DateTo.Value);

        if (query.MinScore.HasValue)
            q = q.Where(l => l.IcpScore >= query.MinScore.Value);

        if (query.MaxScore.HasValue)
            q = q.Where(l => l.IcpScore <= query.MaxScore.Value);

        var totalCount = await q.CountAsync(cancellationToken);

        var leads = await q
            .OrderByDescending(l => l.ImportedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        var items = leads.Select(l => l.ToLeadSummaryResult()).ToList();

        return new PagedResult<LeadSummaryResult>(items, totalCount, query.PageNumber, query.PageSize);
    }
}
