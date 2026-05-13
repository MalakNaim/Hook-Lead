using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.UpdateLeadQualification;

public class UpdateLeadQualificationCommandHandler
{
    private readonly IApplicationDbContext _context;

    public UpdateLeadQualificationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeadResult> Handle(
        UpdateLeadQualificationCommand command,
        Guid leadId,
        CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        if (!Enum.TryParse<QualificationStatus>(command.QualificationStatus, ignoreCase: true, out var status))
            throw new AppException($"Invalid qualification status: '{command.QualificationStatus}'.", 400);

        lead.QualificationStatus = status;
        lead.QualificationNotes = command.QualificationNotes;

        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
