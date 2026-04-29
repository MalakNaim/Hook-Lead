namespace HookLeads.Application.Common.Models;

public record LeadScoreResult(
    Guid LeadId,
    int? Score,
    object? Breakdown);
