using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HookLeads.Application.Features.Workspace.InviteMember;

public class InviteMemberCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<InviteMemberCommandHandler> _logger;

    public InviteMemberCommandHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        ILogger<InviteMemberCommandHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task Handle(InviteMemberCommand command, Guid workspaceId, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = command.Email.ToLower().Trim();

        var emailExists = await _context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (emailExists)
            throw new AppException("A user with this email already exists.", 409);

        if (!Enum.TryParse<UserRole>(command.Role, ignoreCase: true, out var role))
            throw new AppException($"Invalid role '{command.Role}'. Valid values are Admin and Rep.", 400);

        // Create an inactive user — activation happens when the invited user sets their password.
        // Invite email delivery is implemented in Milestone 7.
        var user = new User
        {
            Id = Guid.NewGuid(),
            WorkspaceId = workspaceId,
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.Hash(Guid.NewGuid().ToString()),
            Role = role,
            IsActive = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Invited user {Email} to workspace {WorkspaceId}. Invite email delivery not yet implemented.",
            normalizedEmail, workspaceId);
    }
}
