using HookLeads.Application.Features.Outreach.GenerateOutreachMessage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Authorize]
public class OutreachController : ControllerBase
{
    [HttpPost("leads/{leadId:guid}/outreach/generate")]
    public async Task<IActionResult> Generate(
        Guid leadId,
        [FromServices] GenerateOutreachMessageCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GenerateOutreachMessageCommand(), leadId, cancellationToken);
        return CreatedAtAction(nameof(Generate), new { leadId }, result);
    }
}
