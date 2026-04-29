namespace HookLeads.Application.Common.Models;

public record ImportPreviewRow(
    string? FirstName,
    string? LastName,
    string? Email,
    string? JobTitle,
    string? Company,
    string? Industry,
    string? CompanySize,
    string? Geography,
    string? RevenueRange,
    string? LinkedInUrl,
    bool IsValid,
    string? ValidationError);

public record ImportPreviewResult(
    List<ImportPreviewRow> Rows,
    int ValidCount,
    int InvalidCount);
