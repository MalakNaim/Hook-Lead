namespace HookLeads.Domain.Entities;

public class IcpProfile
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Workspace Workspace { get; set; } = null!;
    public ICollection<IcpCriterion> Criteria { get; set; } = new List<IcpCriterion>();
}
