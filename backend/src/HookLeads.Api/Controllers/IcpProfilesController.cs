using FluentValidation;
using HookLeads.Application.Features.IcpProfiles.CreateIcpProfile;
using HookLeads.Application.Features.IcpProfiles.GetCurrentIcpProfile;
using HookLeads.Application.Features.IcpProfiles.UpdateIcpProfile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Route("api/icp-profiles")]
[Authorize]
public class IcpProfilesController : ControllerBase
{
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentIcpProfile(
        [FromServices] GetCurrentIcpProfileQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetCurrentIcpProfileQuery(), cancellationToken);
        if (result is null)
            return NotFound(new { error = "No ICP profile found for this workspace." });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateIcpProfile(
        [FromBody] CreateIcpProfileCommand command,
        [FromServices] CreateIcpProfileCommandHandler handler,
        [FromServices] IValidator<CreateIcpProfileCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, cancellationToken);
        return CreatedAtAction(nameof(GetCurrentIcpProfile), result);
    }

    [HttpPut("{id:guid}")]
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
}
