namespace HookLeads.Application.Features.Leads.MarkHandoffReady;

public record MarkHandoffReadyCommand(string? HandoffTarget, string? HandoffNotes);
