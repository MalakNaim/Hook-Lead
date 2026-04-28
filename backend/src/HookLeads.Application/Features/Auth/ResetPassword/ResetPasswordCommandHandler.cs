using HookLeads.Application.Common.Exceptions;
using Microsoft.Extensions.Logging;

namespace HookLeads.Application.Features.Auth.ResetPassword;

public class ResetPasswordCommandHandler
{
    private readonly ILogger<ResetPasswordCommandHandler> _logger;

    public ResetPasswordCommandHandler(ILogger<ResetPasswordCommandHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(ResetPasswordCommand command, CancellationToken cancellationToken = default)
    {
        // Full implementation (token storage + email) is in Milestone 7.
        _logger.LogWarning("Password reset attempted but is not yet implemented.");
        throw new AppException("Password reset is not yet available. Please contact support.", 501);
    }
}
