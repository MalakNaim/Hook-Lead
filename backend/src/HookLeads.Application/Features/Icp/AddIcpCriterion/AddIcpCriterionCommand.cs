namespace HookLeads.Application.Features.Icp.AddIcpCriterion;

public record AddIcpCriterionCommand(string CriterionType, string Value, int Weight);
