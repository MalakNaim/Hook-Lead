using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using RefreshTokenEntity = HookLeads.Domain.Entities.RefreshToken;
using WorkspaceEntity = HookLeads.Domain.Entities.Workspace;

namespace HookLeads.Application.Features.Auth.Register;

public class RegisterCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public RegisterCommandHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResult> Handle(RegisterCommand command, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = command.Email.ToLower().Trim();

        // IgnoreQueryFilters: registration has no workspace context yet — check email globally
        var emailExists = await _context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (emailExists)
            throw new AppException("An account with this email already exists.", 409);

        var workspace = new WorkspaceEntity
        {
            Id = Guid.NewGuid(),
            Name = command.WorkspaceName.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            WorkspaceId = workspace.Id,
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.Hash(command.Password),
            Role = UserRole.Admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var rawRefreshToken = _jwtService.GenerateRefreshToken();

        var refreshToken = new RefreshTokenEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = _jwtService.HashToken(rawRefreshToken),
            ExpiresAt = _jwtService.GetRefreshTokenExpiry(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Workspaces.Add(workspace);
        _context.Users.Add(user);
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);

        var accessToken = _jwtService.GenerateAccessToken(
            user.Id, workspace.Id, user.Email, user.Role.ToString());

        return new AuthResult(accessToken, rawRefreshToken, user.Id,
            user.Email, user.Role.ToString(), workspace.Id, workspace.Name);
    }
}
