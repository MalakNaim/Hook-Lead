using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Leads.AddLeadNote;

public class AddLeadNoteCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AddLeadNoteCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<LeadResult> Handle(AddLeadNoteCommand command, Guid leadId, CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        var timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
        var entry = $"[{timestamp} | {_currentUser.Email}] {command.Note.Trim()}";

        lead.Notes = string.IsNullOrWhiteSpace(lead.Notes)
            ? entry
            : $"{lead.Notes}\n{entry}";

        await _context.SaveChangesAsync(cancellationToken);

        return new LeadResult(
            lead.Id, lead.FirstName, lead.LastName, lead.Email,
            lead.JobTitle, lead.Company, lead.Industry,
            lead.CompanySize, lead.Geography, lead.RevenueRange, lead.LinkedInUrl,
            lead.Source.ToString(), lead.Status.ToString(),
            lead.Notes, lead.ImportedAt);
    }
}
