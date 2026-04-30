using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HookLeads.Application.Features.Icp.CreateIcpProfile;

public class CreateIcpProfileCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentWorkspaceService _currentWorkspace;
    private readonly ILogger<CreateIcpProfileCommandHandler> _logger;

    public CreateIcpProfileCommandHandler(
        IApplicationDbContext context,
        ICurrentWorkspaceService currentWorkspace,
        ILogger<CreateIcpProfileCommandHandler> logger)
    {
        _context = context;
        _currentWorkspace = currentWorkspace;
        _logger = logger;
    }

    public async Task<IcpProfileResult> Handle(CreateIcpProfileCommand command, CancellationToken cancellationToken = default)
    {
        var workspaceId = _currentWorkspace.WorkspaceId
            ?? throw new AppException("Workspace context is required.", 401);

        if (command.IsActive)
        {
            // Enforce one active ICP per workspace — deactivate any currently active profiles.
            var activeProfiles = await _context.IcpProfiles
                .Where(p => p.IsActive)
                .ToListAsync(cancellationToken);

            foreach (var p in activeProfiles)
                p.IsActive = false;
        }

        var profile = new IcpProfile
        {
            Id = Guid.NewGuid(),
            WorkspaceId = workspaceId,
            Name = command.Name.Trim(),
            IsActive = command.IsActive,
            UpdatedAt = DateTime.UtcNow
        };

        _context.IcpProfiles.Add(profile);
        await _context.SaveChangesAsync(cancellationToken);

        if (command.IsActive)
            _logger.LogInformation(
                "ICP profile '{Name}' ({Id}) activated for workspace {WorkspaceId}.",
                profile.Name, profile.Id, workspaceId);

        return new IcpProfileResult(profile.Id, profile.Name, profile.IsActive, profile.UpdatedAt, new List<IcpCriterionResult>());
    }
}
