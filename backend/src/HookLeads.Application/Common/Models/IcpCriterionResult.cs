namespace HookLeads.Application.Common.Models;

public record IcpCriterionResult(
    Guid Id,
    string CriterionType,
    string Value,
    int Weight
);
