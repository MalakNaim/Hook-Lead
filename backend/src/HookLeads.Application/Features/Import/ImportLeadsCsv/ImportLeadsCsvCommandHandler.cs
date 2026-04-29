using System.Text;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Import.ImportLeadsCsv;

public class ImportLeadsCsvCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentWorkspaceService _currentWorkspace;

    public ImportLeadsCsvCommandHandler(IApplicationDbContext context, ICurrentWorkspaceService currentWorkspace)
    {
        _context = context;
        _currentWorkspace = currentWorkspace;
    }

    public async Task<ImportPreviewResult> Handle(ImportLeadsCsvCommand command, CancellationToken cancellationToken = default)
    {
        var lines = command.CsvContent
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(l => l.TrimEnd('\r'))
            .ToList();

        if (lines.Count < 2)
            return new ImportPreviewResult(new List<ImportPreviewRow>(), 0, 0);

        var headers = ParseCsvLine(lines[0])
            .Select(h => h.ToLowerInvariant().Replace(" ", ""))
            .ToArray();

        var workspaceId = _currentWorkspace.WorkspaceId!.Value;
        var existingEmails = (await _context.Leads
            .Select(l => l.Email.ToLower())
            .ToListAsync(cancellationToken))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var rows = new List<ImportPreviewRow>();

        foreach (var line in lines.Skip(1))
        {
            if (string.IsNullOrWhiteSpace(line)) continue;

            var fields = ParseCsvLine(line);
            var row = MapRow(headers, fields);

            if (string.IsNullOrWhiteSpace(row.FirstName))
            {
                rows.Add(row with { IsValid = false, ValidationError = "First name is required." });
                continue;
            }

            if (string.IsNullOrWhiteSpace(row.LastName))
            {
                rows.Add(row with { IsValid = false, ValidationError = "Last name is required." });
                continue;
            }

            if (string.IsNullOrWhiteSpace(row.Email))
            {
                rows.Add(row with { IsValid = false, ValidationError = "Email is required." });
                continue;
            }

            if (!IsValidEmail(row.Email))
            {
                rows.Add(row with { IsValid = false, ValidationError = "Invalid email address." });
                continue;
            }

            if (existingEmails.Contains(row.Email!.ToLower()))
            {
                rows.Add(row with { IsValid = false, ValidationError = "Email already exists in this workspace." });
                continue;
            }

            rows.Add(row with { IsValid = true, ValidationError = null });
        }

        return new ImportPreviewResult(rows, rows.Count(r => r.IsValid), rows.Count(r => !r.IsValid));
    }

    private static ImportPreviewRow MapRow(string[] headers, string[] fields)
    {
        string? Get(string key)
        {
            var idx = Array.IndexOf(headers, key);
            return idx >= 0 && idx < fields.Length ? NullIfEmpty(fields[idx]) : null;
        }

        return new ImportPreviewRow(
            Get("firstname") ?? Get("first_name") ?? Get("first"),
            Get("lastname") ?? Get("last_name") ?? Get("last"),
            Get("email"),
            Get("jobtitle") ?? Get("job_title") ?? Get("title"),
            Get("company"),
            Get("industry"),
            Get("companysize") ?? Get("company_size"),
            Get("geography") ?? Get("location"),
            Get("revenuerange") ?? Get("revenue_range") ?? Get("revenue"),
            Get("linkedinurl") ?? Get("linkedin_url") ?? Get("linkedin"),
            false, null);
    }

    private static string[] ParseCsvLine(string line)
    {
        var result = new List<string>();
        var current = new StringBuilder();
        bool inQuotes = false;

        foreach (char c in line)
        {
            if (c == '"') { inQuotes = !inQuotes; }
            else if (c == ',' && !inQuotes) { result.Add(current.ToString().Trim()); current.Clear(); }
            else { current.Append(c); }
        }
        result.Add(current.ToString().Trim());
        return result.ToArray();
    }

    private static string? NullIfEmpty(string s) =>
        string.IsNullOrWhiteSpace(s) ? null : s.Trim();

    private static bool IsValidEmail(string email)
    {
        try { _ = new System.Net.Mail.MailAddress(email); return true; }
        catch { return false; }
    }
}
