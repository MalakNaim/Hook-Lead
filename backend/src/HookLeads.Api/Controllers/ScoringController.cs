using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Features.Leads.GetLeadScore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Authorize]
public class ScoringController : ControllerBase
{
    [HttpGet("leads/{id:guid}/score")]
    public async Task<IActionResult> GetLeadScore(
        Guid id,
        [FromServices] GetLeadScoreQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetLeadScoreQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("scoring/recalculate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RecalculateScores(
        [FromServices] ILeadScoringService scoringService,
        CancellationToken cancellationToken)
    {
        await scoringService.RescoreWorkspaceLeadsAsync(cancellationToken);
        return Accepted(new { message = "Score recalculation completed for all workspace leads." });
    }
}
