using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Outreach.GetOutreachMessages;

public class GetOutreachMessagesQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetOutreachMessagesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<OutreachMessageResult>> Handle(
        GetOutreachMessagesQuery query,
        CancellationToken cancellationToken = default)
    {
        var leadExists = await _context.Leads
            .AnyAsync(l => l.Id == query.LeadId, cancellationToken);

        if (!leadExists)
            throw new AppException("Lead not found.", 404);

        return await _context.OutreachMessages
            .Where(m => m.LeadId == query.LeadId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new OutreachMessageResult(
                m.Id,
                m.LeadId,
                m.Subject,
                m.Body,
                m.Status.ToString(),
                m.CreatedAt,
                m.SentAt))
            .ToListAsync(cancellationToken);
    }
}
