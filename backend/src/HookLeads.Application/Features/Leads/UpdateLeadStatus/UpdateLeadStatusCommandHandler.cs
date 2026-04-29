using HookLeads.Application.Common.Exceptions;
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

        if (!Enum.TryParse<LeadStatus>(command.Status, ignoreCase: true, out var status))
            throw new AppException(
                $"Invalid status '{command.Status}'. Valid values are: {string.Join(", ", Enum.GetNames<LeadStatus>())}.",
                400);

        lead.Status = status;
        await _context.SaveChangesAsync(cancellationToken);

        return new LeadResult(
            lead.Id, lead.FirstName, lead.LastName, lead.Email,
            lead.JobTitle, lead.Company, lead.Industry,
            lead.CompanySize, lead.Geography, lead.RevenueRange, lead.LinkedInUrl,
            lead.Source.ToString(), lead.Status.ToString(),
            lead.Notes, lead.ImportedAt,
            lead.IcpScore, lead.ScoreBreakdown);
    }
}
