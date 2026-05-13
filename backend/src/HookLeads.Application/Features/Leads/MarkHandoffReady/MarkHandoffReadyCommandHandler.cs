using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.MarkHandoffReady;

public class MarkHandoffReadyCommandHandler
{
    private readonly IApplicationDbContext _context;

    public MarkHandoffReadyCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeadResult> Handle(
        MarkHandoffReadyCommand command,
        Guid leadId,
        CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        if (lead.QualificationStatus != QualificationStatus.QualifiedLead)
            throw new AppException("Only Qualified leads can be marked as Ready for handoff.", 422);

        lead.HandoffStatus = HandoffStatus.Ready;
        lead.HandoffTarget = command.HandoffTarget;
        lead.HandoffNotes = command.HandoffNotes;

        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
