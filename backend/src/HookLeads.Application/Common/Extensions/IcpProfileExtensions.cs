using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;

namespace HookLeads.Application.Common.Extensions;

public static class IcpProfileExtensions
{
    public static IcpProfileResult ToIcpProfileResult(this IcpProfile profile)
    {
        var criteria = profile.Criteria
            .Select(c => new IcpCriterionResult(c.Id, c.CriterionType.ToString(), c.Value, c.Weight))
            .ToList();

        return new IcpProfileResult(
            profile.Id,
            profile.Name,
            profile.IsActive,
            profile.UpdatedAt,
            criteria,
            profile.Industries,
            profile.JobTitles,
            profile.CompanySizeMin,
            profile.CompanySizeMax,
            profile.Locations,
            profile.DecisionMaker,
            profile.PainPoints,
            profile.BudgetMin,
            profile.BudgetMax,
            profile.BuyingTriggers
        );
    }
}
