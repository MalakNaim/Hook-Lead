using FluentValidation;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Features.Icp.AddIcpCriterion;
using HookLeads.Application.Features.Icp.CreateIcpProfile;
using HookLeads.Application.Features.Icp.DeleteIcpCriterion;
using HookLeads.Application.Features.Icp.GetActiveIcpProfile;
using HookLeads.Application.Features.Icp.UpdateIcpCriterion;
using HookLeads.Application.Features.Icp.UpdateIcpProfile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Route("icp")]
[Authorize]
public class IcpController : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateIcpProfile(
        [FromBody] CreateIcpProfileCommand command,
        [FromServices] CreateIcpProfileCommandHandler handler,
        [FromServices] IValidator<CreateIcpProfileCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, cancellationToken);
        return CreatedAtAction(nameof(GetActiveIcpProfile), result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateIcpProfile(
        Guid id,
        [FromBody] UpdateIcpProfileCommand command,
        [FromServices] UpdateIcpProfileCommandHandler handler,
        [FromServices] IValidator<UpdateIcpProfileCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, id, cancellationToken);
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveIcpProfile(
        [FromServices] GetActiveIcpProfileQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetActiveIcpProfileQuery(), cancellationToken);
        if (result == null)
            return NotFound(new { message = "No active ICP profile found." });
        return Ok(result);
    }

    [HttpPost("{id:guid}/criteria")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddIcpCriterion(
        Guid id,
        [FromBody] AddIcpCriterionCommand command,
        [FromServices] AddIcpCriterionCommandHandler handler,
        [FromServices] IValidator<AddIcpCriterionCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, id, cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id:guid}/criteria/{criterionId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateIcpCriterion(
        Guid id,
        Guid criterionId,
        [FromBody] UpdateIcpCriterionCommand command,
        [FromServices] UpdateIcpCriterionCommandHandler handler,
        [FromServices] IValidator<UpdateIcpCriterionCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, id, criterionId, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}/criteria/{criterionId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteIcpCriterion(
        Guid id,
        Guid criterionId,
        [FromServices] DeleteIcpCriterionCommandHandler handler,
        CancellationToken cancellationToken)
    {
        await handler.Handle(id, criterionId, cancellationToken);
        return NoContent();
    }
}
