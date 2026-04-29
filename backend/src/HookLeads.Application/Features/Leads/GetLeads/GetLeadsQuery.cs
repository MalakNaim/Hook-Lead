namespace HookLeads.Application.Features.Leads.GetLeads;

public record GetLeadsQuery(
    string? Status,
    string? Industry,
    DateTime? DateFrom,
    DateTime? DateTo,
    int? MinScore,
    int? MaxScore,
    int PageNumber = 1,
    int PageSize = 20);
