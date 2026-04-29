using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.DeleteLead;

public class DeleteLeadCommandHandler
{
    private readonly IApplicationDbContext _context;

    public DeleteLeadCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(Guid leadId, CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
