namespace HookLeads.Application.Features.Icp.UpdateIcpCriterion;

public record UpdateIcpCriterionCommand(string CriterionType, string Value, int Weight);
