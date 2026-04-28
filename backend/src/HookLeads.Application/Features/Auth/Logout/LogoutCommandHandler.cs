using HookLeads.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Auth.Logout;

public class LogoutCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public LogoutCommandHandler(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task Handle(LogoutCommand command, CancellationToken cancellationToken = default)
    {
        var hashedToken = _jwtService.HashToken(command.RefreshToken);

        var token = await _context.RefreshTokens
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(rt => rt.Token == hashedToken, cancellationToken);

        if (token != null && token.RevokedAt == null)
        {
            token.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
