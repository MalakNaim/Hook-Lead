namespace HookLeads.Domain.Entities;

public class IcpProfile
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Structured ICP fields
    public List<string> Industries { get; set; } = new();
    public List<string> JobTitles { get; set; } = new();
    public int CompanySizeMin { get; set; }
    public int CompanySizeMax { get; set; }
    public List<string> Locations { get; set; } = new();
    public bool DecisionMaker { get; set; }
    public List<string> PainPoints { get; set; } = new();
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public List<string> BuyingTriggers { get; set; } = new();

    public Workspace Workspace { get; set; } = null!;
    public ICollection<IcpCriterion> Criteria { get; set; } = new List<IcpCriterion>();
}
