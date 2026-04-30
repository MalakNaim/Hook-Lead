using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using RefreshTokenEntity = HookLeads.Domain.Entities.RefreshToken;

namespace HookLeads.Application.Features.Auth.Login;

public class LoginCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResult> Handle(LoginCommand command, CancellationToken cancellationToken = default)
    {
        // IgnoreQueryFilters: no workspace context exists at login time
        var user = await _context.Users
            .IgnoreQueryFilters()
            .Include(u => u.Workspace)
            .FirstOrDefaultAsync(u => u.Email == command.Email.Trim().ToLowerInvariant(), cancellationToken);

        if (user == null || !_passwordHasher.Verify(command.Password, user.PasswordHash))
            throw new AppException("Invalid email or password.", 401);

        if (!user.IsActive)
            throw new AppException("This account has been deactivated. Please contact your workspace admin.", 403);

        var rawRefreshToken = _jwtService.GenerateRefreshToken();

        var refreshToken = new RefreshTokenEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = _jwtService.HashToken(rawRefreshToken),
            ExpiresAt = _jwtService.GetRefreshTokenExpiry(),
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);

        var accessToken = _jwtService.GenerateAccessToken(
            user.Id, user.WorkspaceId, user.Email, user.Role.ToString());

        return new AuthResult(accessToken, rawRefreshToken, user.Id,
            user.Email, user.Role.ToString(), user.WorkspaceId, user.Workspace.Name);
    }
}
