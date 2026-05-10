using HookLeads.Domain.Entities;

namespace HookLeads.Application.Common.Interfaces;

public interface ILeadScoringService
{
    void ScoreLead(Lead lead, IcpProfile profile);
    Task RescoreWorkspaceLeadsAsync(CancellationToken cancellationToken = default);
}
