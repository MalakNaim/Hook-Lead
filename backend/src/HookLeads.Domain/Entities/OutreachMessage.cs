using HookLeads.Domain.Enums;

namespace HookLeads.Domain.Entities;

public class OutreachMessage
{
    public Guid Id { get; set; }
    public Guid LeadId { get; set; }
    public Guid WorkspaceId { get; set; }
    public Guid GeneratedBy { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public OutreachStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? SentAt { get; set; }

    public Lead Lead { get; set; } = null!;
    public Workspace Workspace { get; set; } = null!;
    public User GeneratedByUser { get; set; } = null!;
}
