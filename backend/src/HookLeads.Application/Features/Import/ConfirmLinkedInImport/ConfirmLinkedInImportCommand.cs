namespace HookLeads.Application.Features.Import.ConfirmLinkedInImport;

public record ConfirmLinkedInImportCommand(
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
