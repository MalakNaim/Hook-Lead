namespace HookLeads.Application.Common.Models;

public record AuthResult(
    string AccessToken,
    string RefreshToken,
    Guid UserId,
    string Email,
    string Role,
    Guid WorkspaceId,
    string WorkspaceName
);
