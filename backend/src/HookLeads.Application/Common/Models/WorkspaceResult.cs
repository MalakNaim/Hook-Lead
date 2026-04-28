namespace HookLeads.Application.Common.Models;

public record WorkspaceResult(
    Guid Id,
    string Name,
    DateTime CreatedAt,
    int MemberCount
);
