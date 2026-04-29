using HookLeads.Application.Common.Models;

namespace HookLeads.Application.Features.Import.ImportLinkedInLead;

public class ImportLinkedInLeadCommandHandler
{
    public Task<ImportPreviewRow> Handle(ImportLinkedInLeadCommand command, CancellationToken cancellationToken = default)
    {
        var (firstName, lastName) = ParseHandle(command.Url);

        var row = new ImportPreviewRow(
            firstName, lastName,
            Email: null,
            JobTitle: null, Company: null, Industry: null,
            CompanySize: null, Geography: null, RevenueRange: null,
            LinkedInUrl: command.Url.Trim(),
            IsValid: true, ValidationError: null);

        return Task.FromResult(row);
    }

    private static (string firstName, string lastName) ParseHandle(string url)
    {
        try
        {
            var uri = new Uri(url.Trim());
            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            // Expect: /in/<handle> or /<handle>
            var handle = segments.Length >= 2 ? segments[1] : segments[0];
            handle = handle.TrimEnd('/');

            var parts = handle.Split('-');
            var firstName = Capitalize(parts[0]);
            var lastName = parts.Length > 1 ? Capitalize(string.Join(" ", parts[1..])) : string.Empty;
            return (firstName, lastName);
        }
        catch
        {
            return (string.Empty, string.Empty);
        }
    }

    private static string Capitalize(string s) =>
        string.IsNullOrEmpty(s) ? s : char.ToUpperInvariant(s[0]) + s[1..].ToLowerInvariant();
}
