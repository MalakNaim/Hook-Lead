using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Outreach.UpdateOutreachMessageStatus;

public class UpdateOutreachMessageStatusCommandHandler
{
    private readonly IApplicationDbContext _context;

    public UpdateOutreachMessageStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OutreachMessageResult> Handle(
        UpdateOutreachMessageStatusCommand command,
        Guid messageId,
        CancellationToken cancellationToken = default)
    {
        var message = await _context.OutreachMessages
            .FirstOrDefaultAsync(m => m.Id == messageId, cancellationToken);

        if (message == null)
            throw new AppException("Outreach message not found.", 404);

        var newStatus = Enum.Parse<OutreachStatus>(command.Status, ignoreCase: true);

        message.Status = newStatus;

        if (newStatus == OutreachStatus.Sent && message.SentAt == null)
            message.SentAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new OutreachMessageResult(
            message.Id,
            message.LeadId,
            message.Subject,
            message.Body,
            message.Status.ToString(),
            message.CreatedAt,
            message.SentAt);
    }
}
