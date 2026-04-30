using HookLeads.Application.Features.Outreach.GenerateOutreachMessage;
using HookLeads.Application.Features.Outreach.GetOutreachEmailDraft;
using HookLeads.Application.Features.Outreach.GetOutreachMessages;
using HookLeads.Application.Features.Outreach.UpdateOutreachMessageStatus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Route("api/outreach")]
[Authorize]
public class OutreachController : ControllerBase
{
    [HttpPost("leads/{leadId:guid}/generate")]
    public async Task<IActionResult> Generate(
        Guid leadId,
        [FromServices] GenerateOutreachMessageCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GenerateOutreachMessageCommand(), leadId, cancellationToken);
        return CreatedAtAction(nameof(Generate), new { leadId }, result);
    }

    [HttpGet("leads/{leadId:guid}/messages")]
    public async Task<IActionResult> GetMessages(
        Guid leadId,
        [FromServices] GetOutreachMessagesQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var results = await handler.Handle(new GetOutreachMessagesQuery(leadId), cancellationToken);
        return Ok(results);
    }

    [HttpGet("messages/{messageId:guid}/email-draft")]
    public async Task<IActionResult> GetEmailDraft(
        Guid messageId,
        [FromServices] GetOutreachEmailDraftQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetOutreachEmailDraftQuery(messageId), cancellationToken);
        return Ok(result);
    }

    [HttpPatch("messages/{messageId:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid messageId,
        [FromBody] UpdateOutreachMessageStatusCommand command,
        [FromServices] UpdateOutreachMessageStatusCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command, messageId, cancellationToken);
        return Ok(result);
    }
}
