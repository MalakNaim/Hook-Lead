namespace HookLeads.Application.Common.Models;

public record UserProfileResult(
    Guid Id,
    string Email,
    string Role,
    bool IsActive,
    DateTime CreatedAt,
    Guid WorkspaceId,
    string WorkspaceName
);
