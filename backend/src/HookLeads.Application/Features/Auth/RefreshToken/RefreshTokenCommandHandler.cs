using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using RefreshTokenEntity = HookLeads.Domain.Entities.RefreshToken;

namespace HookLeads.Application.Features.Auth.RefreshToken;

public class RefreshTokenCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResult> Handle(RefreshTokenCommand command, CancellationToken cancellationToken = default)
    {
        var hashedToken = _jwtService.HashToken(command.Token);

        // IgnoreQueryFilters: no workspace context at token refresh time
        var existing = await _context.RefreshTokens
            .IgnoreQueryFilters()
            .Include(rt => rt.User)
                .ThenInclude(u => u.Workspace)
            .FirstOrDefaultAsync(rt => rt.Token == hashedToken, cancellationToken);

        if (existing == null || !existing.IsActive)
            throw new AppException("Invalid or expired refresh token.", 401);

        // Rotate: revoke old, issue new
        existing.RevokedAt = DateTime.UtcNow;

        var rawRefreshToken = _jwtService.GenerateRefreshToken();

        var newToken = new RefreshTokenEntity
        {
            Id = Guid.NewGuid(),
            UserId = existing.UserId,
            Token = _jwtService.HashToken(rawRefreshToken),
            ExpiresAt = _jwtService.GetRefreshTokenExpiry(),
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(newToken);
        await _context.SaveChangesAsync(cancellationToken);

        var user = existing.User;
        var accessToken = _jwtService.GenerateAccessToken(
            user.Id, user.WorkspaceId, user.Email, user.Role.ToString());

        return new AuthResult(accessToken, rawRefreshToken, user.Id,
            user.Email, user.Role.ToString(), user.WorkspaceId, user.Workspace.Name);
    }
}
