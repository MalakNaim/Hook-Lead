using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.MarkHandoffSent;

public class MarkHandoffSentCommandHandler
{
    private readonly IApplicationDbContext _context;

    public MarkHandoffSentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeadResult> Handle(
        Guid leadId,
        CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        if (lead.HandoffStatus != HandoffStatus.Ready)
            throw new AppException("Only leads with status Ready can be marked as Sent.", 422);

        lead.HandoffStatus = HandoffStatus.Sent;
        lead.HandoffAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
