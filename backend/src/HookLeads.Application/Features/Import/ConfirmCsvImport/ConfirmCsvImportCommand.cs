namespace HookLeads.Application.Features.Import.ConfirmCsvImport;

public record ConfirmCsvImportRow(
    string FirstName,
    string LastName,
    string Email,
    string? JobTitle,
    string? Company,
    string? Industry,
    string? CompanySize,
    string? Geography,
    string? RevenueRange,
    string? LinkedInUrl);

public record ConfirmCsvImportCommand(List<ConfirmCsvImportRow> Rows);
