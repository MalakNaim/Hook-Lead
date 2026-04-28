namespace HookLeads.Domain.Entities;

public class Workspace
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<IcpProfile> IcpProfiles { get; set; } = new List<IcpProfile>();
}
