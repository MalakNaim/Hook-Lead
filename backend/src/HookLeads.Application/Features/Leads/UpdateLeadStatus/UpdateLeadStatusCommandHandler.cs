using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.UpdateLeadStatus;

public class UpdateLeadStatusCommandHandler
{
    private readonly IApplicationDbContext _context;

    public UpdateLeadStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeadResult> Handle(UpdateLeadStatusCommand command, Guid leadId, CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        lead.Status = Enum.Parse<LeadStatus>(command.Status, ignoreCase: true);
        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
