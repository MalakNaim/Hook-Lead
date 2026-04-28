namespace HookLeads.Application.Common.Models;

public record WorkspaceMemberResult(
    Guid Id,
    string Email,
    string Role,
    bool IsActive,
    DateTime CreatedAt
);
