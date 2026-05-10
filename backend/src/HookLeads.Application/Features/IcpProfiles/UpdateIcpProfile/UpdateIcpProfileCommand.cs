namespace HookLeads.Application.Features.IcpProfiles.UpdateIcpProfile;

public record UpdateIcpProfileCommand(
    string Name,
    List<string> Industries,
    List<string> JobTitles,
    int CompanySizeMin,
    int CompanySizeMax,
    List<string> Locations,
    bool DecisionMaker,
    List<string> PainPoints,
    int BudgetMin,
    int BudgetMax,
    List<string> BuyingTriggers
);
