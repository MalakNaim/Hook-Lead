using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Outreach.GetOutreachEmailDraft;

public class GetOutreachEmailDraftQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetOutreachEmailDraftQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OutreachEmailDraftResult> Handle(
        GetOutreachEmailDraftQuery query,
        CancellationToken cancellationToken = default)
    {
        var message = await _context.OutreachMessages
            .Include(m => m.Lead)
            .FirstOrDefaultAsync(m => m.Id == query.MessageId, cancellationToken);

        if (message == null)
            throw new AppException("Outreach message not found.", 404);

        if (message.Status == OutreachStatus.Cancelled)
            throw new AppException("Cannot generate email draft for a cancelled message.", 400);

        var email = message.Lead.Email;

        if (string.IsNullOrWhiteSpace(email))
            throw new AppException("Lead does not have an email address.", 400);

        var subject = string.IsNullOrWhiteSpace(message.Subject)
            ? (string.IsNullOrWhiteSpace(message.Lead.Company)
                ? $"Quick question, {message.Lead.FirstName}"
                : $"Quick question for {message.Lead.Company}")
            : message.Subject;

        var body = message.Body;

        // Email address goes unencoded in the mailto scheme; only query params are percent-encoded.
        var mailtoUrl = $"mailto:{email}" +
                        $"?subject={Uri.EscapeDataString(subject)}" +
                        $"&body={Uri.EscapeDataString(body)}";

        return new OutreachEmailDraftResult(email, subject, body, mailtoUrl);
    }
}
