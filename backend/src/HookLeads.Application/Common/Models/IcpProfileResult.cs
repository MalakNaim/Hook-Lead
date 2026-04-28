namespace HookLeads.Application.Common.Models;

public record IcpProfileResult(
    Guid Id,
    string Name,
    bool IsActive,
    DateTime UpdatedAt,
    List<IcpCriterionResult> Criteria
);
