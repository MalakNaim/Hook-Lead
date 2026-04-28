using FluentValidation;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Features.Workspace.GetWorkspace;
using HookLeads.Application.Features.Workspace.GetWorkspaceMembers;
using HookLeads.Application.Features.Workspace.InviteMember;
using HookLeads.Application.Features.Workspace.RemoveMember;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Route("workspace")]
[Authorize]
public class WorkspaceController : ControllerBase
{
    private readonly ICurrentUserService _currentUser;
    private readonly ICurrentWorkspaceService _currentWorkspace;

    public WorkspaceController(
        ICurrentUserService currentUser,
        ICurrentWorkspaceService currentWorkspace)
    {
        _currentUser = currentUser;
        _currentWorkspace = currentWorkspace;
    }

    [HttpGet]
    public async Task<IActionResult> GetWorkspace(
        [FromServices] GetWorkspaceQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(
            new GetWorkspaceQuery(_currentWorkspace.WorkspaceId!.Value),
            cancellationToken);
        return Ok(result);
    }

    [HttpGet("members")]
    public async Task<IActionResult> GetMembers(
        [FromServices] GetWorkspaceMembersQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(
            new GetWorkspaceMembersQuery(_currentWorkspace.WorkspaceId!.Value),
            cancellationToken);
        return Ok(result);
    }

    [HttpPost("invite")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Invite(
        [FromBody] InviteMemberCommand command,
        [FromServices] InviteMemberCommandHandler handler,
        [FromServices] IValidator<InviteMemberCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        await handler.Handle(command, _currentWorkspace.WorkspaceId!.Value, cancellationToken);
        return Ok();
    }

    [HttpDelete("members/{userId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RemoveMember(
        Guid userId,
        [FromServices] RemoveMemberCommandHandler handler,
        [FromServices] IValidator<RemoveMemberCommand> validator,
        CancellationToken cancellationToken)
    {
        var command = new RemoveMemberCommand(userId);
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        await handler.Handle(command, cancellationToken);
        return NoContent();
    }
}
