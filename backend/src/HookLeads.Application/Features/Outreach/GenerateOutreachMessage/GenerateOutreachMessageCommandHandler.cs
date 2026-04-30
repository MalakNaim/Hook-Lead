using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Extensions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Outreach.GenerateOutreachMessage;

public class GenerateOutreachMessageCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly IOutreachDraftService _draftService;
    private readonly ICurrentUserService _currentUser;
    private readonly ICurrentWorkspaceService _currentWorkspace;

    public GenerateOutreachMessageCommandHandler(
        IApplicationDbContext context,
        IOutreachDraftService draftService,
        ICurrentUserService currentUser,
        ICurrentWorkspaceService currentWorkspace)
    {
        _context = context;
        _draftService = draftService;
        _currentUser = currentUser;
        _currentWorkspace = currentWorkspace;
    }

    public async Task<OutreachMessageResult> Handle(
        GenerateOutreachMessageCommand command,
        Guid leadId,
        CancellationToken cancellationToken = default)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);

        if (lead == null)
            throw new AppException("Lead not found.", 404);

        if (lead.Status == LeadStatus.Disqualified)
            throw new AppException("Cannot generate outreach for a disqualified lead.", 400);

        if (lead.Status == LeadStatus.Unsubscribed)
            throw new AppException("Cannot generate outreach for an unsubscribed lead.", 400);

        var workspaceId = _currentWorkspace.WorkspaceId
            ?? throw new AppException("Workspace context is required.", 401);
        var userId = _currentUser.UserId
            ?? throw new AppException("User context is required.", 401);

        var (subject, body) = _draftService.GenerateDraft(lead);

        var message = new OutreachMessage
        {
            Id = Guid.NewGuid(),
            LeadId = lead.Id,
            WorkspaceId = workspaceId,
            GeneratedBy = userId,
            Subject = subject,
            Body = body,
            Status = OutreachStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };

        _context.OutreachMessages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        return message.ToOutreachMessageResult();
    }
}
