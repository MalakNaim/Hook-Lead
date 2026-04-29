using HookLeads.Domain.Entities;

namespace HookLeads.Application.Common.Interfaces;

public interface ILeadScoringService
{
    (int score, string breakdown) CalculateScore(Lead lead, IcpProfile profile);
    Task RescoreWorkspaceLeadsAsync(CancellationToken cancellationToken = default);
}
