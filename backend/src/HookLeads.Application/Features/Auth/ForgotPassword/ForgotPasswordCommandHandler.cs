using HookLeads.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HookLeads.Application.Features.Auth.ForgotPassword;

public class ForgotPasswordCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<ForgotPasswordCommandHandler> _logger;

    public ForgotPasswordCommandHandler(
        IApplicationDbContext context,
        ILogger<ForgotPasswordCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(ForgotPasswordCommand command, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToLower().Trim(), cancellationToken);

        // Always return without revealing whether the email exists (prevents enumeration).
        // Reset token storage and email delivery are implemented in Milestone 7.
        if (user != null)
            _logger.LogInformation(
                "Password reset requested for {Email}. Email delivery not yet implemented.", user.Email);
    }
}
