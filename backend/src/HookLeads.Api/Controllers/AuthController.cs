using FluentValidation;
using HookLeads.Application.Features.Auth.ForgotPassword;
using HookLeads.Application.Features.Auth.Login;
using HookLeads.Application.Features.Auth.Logout;
using HookLeads.Application.Features.Auth.RefreshToken;
using HookLeads.Application.Features.Auth.Register;
using HookLeads.Application.Features.Auth.ResetPassword;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterCommand command,
        [FromServices] RegisterCommandHandler handler,
        [FromServices] IValidator<RegisterCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginCommand command,
        [FromServices] LoginCommandHandler handler,
        [FromServices] IValidator<LoginCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        [FromBody] RefreshTokenCommand command,
        [FromServices] RefreshTokenCommandHandler handler,
        [FromServices] IValidator<RefreshTokenCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] LogoutCommand command,
        [FromServices] LogoutCommandHandler handler,
        [FromServices] IValidator<LogoutCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        await handler.Handle(command, cancellationToken);
        return Ok();
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordCommand command,
        [FromServices] ForgotPasswordCommandHandler handler,
        [FromServices] IValidator<ForgotPasswordCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        await handler.Handle(command, cancellationToken);
        return Ok();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordCommand command,
        [FromServices] ResetPasswordCommandHandler handler,
        [FromServices] IValidator<ResetPasswordCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        await handler.Handle(command, cancellationToken);
        return Ok();
    }
}
