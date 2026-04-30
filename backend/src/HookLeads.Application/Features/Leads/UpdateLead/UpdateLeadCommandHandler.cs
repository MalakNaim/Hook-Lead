using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.UpdateLead;

public class UpdateLeadCommandHandler
{
    private readonly IApplicationDbContext _context;

    public UpdateLeadCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeadResult> Handle(UpdateLeadCommand command, Guid leadId, CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        var emailChanged = !string.Equals(lead.Email, command.Email.Trim(), StringComparison.OrdinalIgnoreCase);
        if (emailChanged)
        {
            var emailTaken = await _context.Leads
                .AnyAsync(l => l.Id != leadId && l.Email == command.Email.Trim(), cancellationToken);
            if (emailTaken)
                throw new AppException("A lead with this email already exists in this workspace.", 409);
        }

        lead.FirstName = command.FirstName.Trim();
        lead.LastName = command.LastName.Trim();
        lead.Email = command.Email.Trim().ToLowerInvariant();
        lead.JobTitle = command.JobTitle?.Trim();
        lead.Company = command.Company?.Trim();
        lead.Industry = command.Industry?.Trim();
        lead.CompanySize = command.CompanySize?.Trim();
        lead.Geography = command.Geography?.Trim();
        lead.RevenueRange = command.RevenueRange?.Trim();
        lead.LinkedInUrl = command.LinkedInUrl?.Trim();

        await _context.SaveChangesAsync(cancellationToken);

        return lead.ToLeadResult();
    }
}
