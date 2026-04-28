using HookLeads.Domain.Enums;

namespace HookLeads.Domain.Entities;

public class IcpCriterion
{
    public Guid Id { get; set; }
    public Guid IcpProfileId { get; set; }
    public CriterionType CriterionType { get; set; }
    public string Value { get; set; } = string.Empty;
    public int Weight { get; set; }

    public IcpProfile IcpProfile { get; set; } = null!;
}
