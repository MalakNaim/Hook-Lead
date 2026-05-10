using System.Text.Json;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Domain.Entities;
using HookLeads.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Services;

public class LeadScoringService : ILeadScoringService
{
    private readonly IApplicationDbContext _context;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public LeadScoringService(IApplicationDbContext context)
    {
        _context = context;
    }

    // ── Public API ────────────────────────────────────────────────────────────────

    public void ScoreLead(Lead lead, IcpProfile profile)
    {
        int jobTitleScore    = ScoreJobTitle(lead.JobTitle, profile.JobTitles);
        int industryScore    = ScoreIndustry(lead.Industry, profile.Industries);
        int sizeScore        = ScoreCompanySize(lead.CompanySize, profile.CompanySizeMin, profile.CompanySizeMax);
        int painScore        = ScorePainPoints(lead, profile.PainPoints);
        int activityScore    = ScoreActivitySignals(lead);

        int total = jobTitleScore + industryScore + sizeScore + painScore + activityScore;

        var classification = total switch
        {
            >= 80 => LeadClassification.Hot,
            >= 60 => LeadClassification.Warm,
            >= 40 => LeadClassification.Cold,
            _     => LeadClassification.Reject
        };

        var (matched, mismatched) = BuildCriteriaExplanations(
            lead, profile,
            jobTitleScore, industryScore, sizeScore, painScore, activityScore);

        var breakdown = new
        {
            jobTitleMatch    = jobTitleScore,
            industryMatch    = industryScore,
            companySizeMatch = sizeScore,
            painMatch        = painScore,
            activitySignals  = activityScore,
            total
        };

        lead.JobTitleMatchScore    = jobTitleScore;
        lead.IndustryMatchScore    = industryScore;
        lead.CompanySizeMatchScore = sizeScore;
        lead.PainMatchScore        = painScore;
        lead.ActivitySignalsScore  = activityScore;
        lead.IcpScore              = total;
        lead.Classification        = classification;
        lead.IcpProfileId          = profile.Id;
        lead.MatchedCriteria       = matched.Count > 0 ? string.Join(", ", matched) : null;
        lead.MismatchReasons       = mismatched.Count > 0 ? string.Join(", ", mismatched) : null;
        lead.ScoreBreakdown        = JsonSerializer.Serialize(breakdown, JsonOptions);
    }

    public async Task RescoreWorkspaceLeadsAsync(CancellationToken cancellationToken = default)
    {
        var activeProfile = await _context.IcpProfiles
            .FirstOrDefaultAsync(p => p.IsActive, cancellationToken);

        var leads = await _context.Leads.ToListAsync(cancellationToken);

        if (activeProfile == null)
        {
            foreach (var lead in leads)
                ClearScore(lead);
        }
        else
        {
            foreach (var lead in leads)
                ScoreLead(lead, activeProfile);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    // ── Scoring dimensions ────────────────────────────────────────────────────────

    // Max 30 pts
    private static int ScoreJobTitle(string? leadJobTitle, List<string> icpTitles)
    {
        if (!icpTitles.Any()) return 15;                          // no criteria → neutral
        if (string.IsNullOrWhiteSpace(leadJobTitle)) return 0;

        var leadLower = leadJobTitle.Trim().ToLowerInvariant();

        foreach (var title in icpTitles)
        {
            if (string.IsNullOrWhiteSpace(title)) continue;
            var titleLower = title.Trim().ToLowerInvariant();

            if (leadLower == titleLower)                          return 30; // exact
            if (leadLower.Contains(titleLower)
             || titleLower.Contains(leadLower))                   return 22; // substring

            var keyWords = KeyWords(titleLower);
            if (keyWords.Any(w => leadLower.Contains(w)))        return 12; // keyword overlap
        }

        return 0;
    }

    // Max 25 pts
    private static int ScoreIndustry(string? leadIndustry, List<string> icpIndustries)
    {
        if (!icpIndustries.Any()) return 12;
        if (string.IsNullOrWhiteSpace(leadIndustry)) return 0;

        var leadLower = leadIndustry.Trim().ToLowerInvariant();

        foreach (var industry in icpIndustries)
        {
            if (string.IsNullOrWhiteSpace(industry)) continue;
            var indLower = industry.Trim().ToLowerInvariant();

            if (leadLower == indLower)                            return 25;
            if (leadLower.Contains(indLower)
             || indLower.Contains(leadLower))                     return 18;

            var keyWords = KeyWords(indLower);
            if (keyWords.Any(w => leadLower.Contains(w)))        return 10;
        }

        return 0;
    }

    // Max 15 pts
    private static int ScoreCompanySize(string? leadCompanySize, int icpMin, int icpMax)
    {
        if (icpMin == 0 && icpMax == 0) return 7;               // no constraint → neutral
        if (string.IsNullOrWhiteSpace(leadCompanySize)) return 0;

        var range = ParseCompanySizeRange(leadCompanySize);
        if (range == null) return 0;

        var (leadMin, leadMax) = range.Value;
        var effectiveMax = icpMax == 0 ? int.MaxValue : icpMax;

        if (leadMax >= icpMin && leadMin <= effectiveMax) return 15; // overlap

        // Near-miss: within 25 % of boundary
        var buffer = (int)(0.25 * (effectiveMax == int.MaxValue ? icpMin : Math.Max(1, effectiveMax - icpMin)));
        if (leadMax >= icpMin - buffer && leadMin <= effectiveMax + buffer) return 8;

        return 0;
    }

    // Max 20 pts — heuristic keyword search across available lead text
    private static int ScorePainPoints(Lead lead, List<string> icpPainPoints)
    {
        if (!icpPainPoints.Any()) return 10;

        var leadText = string.Join(" ", new[]
        {
            lead.JobTitle, lead.Industry, lead.Notes, lead.RevenueRange, lead.Company
        }.Where(s => !string.IsNullOrWhiteSpace(s))).ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(leadText)) return 0;

        int matchedCount = icpPainPoints.Count(painPoint =>
        {
            var kw = KeyWords(painPoint.ToLowerInvariant());
            return kw.Any(w => leadText.Contains(w));
        });

        if (matchedCount == 0) return 0;
        return (int)Math.Round((double)matchedCount / icpPainPoints.Count * 20);
    }

    // Max 10 pts — lead data quality signals
    private static int ScoreActivitySignals(Lead lead)
    {
        int score = 0;

        if (!string.IsNullOrWhiteSpace(lead.LinkedInUrl))
            score += 3;

        if (lead.EmailVerificationStatus == EmailVerificationStatus.Verified)
            score += 3;

        score += lead.EnrichmentStatus switch
        {
            EnrichmentStatus.Enriched => 4,
            EnrichmentStatus.Partial  => 2,
            _                         => 0
        };

        return Math.Min(10, score);
    }

    // ── Criteria explanations ─────────────────────────────────────────────────────

    private static (List<string> matched, List<string> mismatched) BuildCriteriaExplanations(
        Lead lead, IcpProfile profile,
        int jobTitleScore, int industryScore, int sizeScore, int painScore, int activityScore)
    {
        var matched   = new List<string>();
        var mismatched = new List<string>();

        // Job Title
        if (profile.JobTitles.Any())
        {
            if (jobTitleScore >= 22)
                matched.Add($"Job Title: {lead.JobTitle}");
            else if (jobTitleScore >= 12)
                matched.Add($"Job Title: Partial match ({lead.JobTitle})");
            else
                mismatched.Add(profile.JobTitles.Count == 1
                    ? $"Job Title: Expected {profile.JobTitles[0]}"
                    : $"Job Title: Expected {string.Join("/", profile.JobTitles.Take(3))}");
        }

        // Industry
        if (profile.Industries.Any())
        {
            if (industryScore >= 18)
                matched.Add($"Industry: {lead.Industry}");
            else if (industryScore >= 10)
                matched.Add($"Industry: Partial match");
            else
                mismatched.Add($"Industry: Expected {string.Join("/", profile.Industries.Take(3))}");
        }

        // Company Size
        if (profile.CompanySizeMin > 0 || profile.CompanySizeMax > 0)
        {
            if (sizeScore == 15)
                matched.Add($"Company Size: {lead.CompanySize}");
            else if (sizeScore == 8)
                matched.Add("Company Size: Near range");
            else
                mismatched.Add($"Company Size: Expected {profile.CompanySizeMin}–{profile.CompanySizeMax}");
        }

        // Pain Points
        if (profile.PainPoints.Any())
        {
            if (painScore >= 15)
                matched.Add("Pain Points: Strong alignment");
            else if (painScore >= 8)
                matched.Add("Pain Points: Partial alignment");
            else
                mismatched.Add("Pain Points: No clear alignment");
        }

        // Activity Signals
        if (activityScore >= 7)
            matched.Add("Activity: Strong signals");
        else if (activityScore >= 4)
            matched.Add("Activity: Some signals");
        else
            mismatched.Add("Activity: Minimal signals");

        return (matched, mismatched);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────────

    private static IEnumerable<string> KeyWords(string text) =>
        text.Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(w => w.Length > 2 && w != "the" && w != "and" && w != "for"
                                     && w != "with" && w != "our" && w != "your");

    private static (int min, int max)? ParseCompanySizeRange(string sizeStr)
    {
        // Keep only digits and hyphens, strip leading/trailing hyphens
        var cleaned = new string(sizeStr.Where(c => char.IsDigit(c) || c == '-').ToArray()).Trim('-');
        if (string.IsNullOrEmpty(cleaned)) return null;

        var parts = cleaned.Split('-');
        if (parts.Length >= 2
            && int.TryParse(parts[0], out var lo)
            && int.TryParse(parts[1], out var hi))
            return (lo, hi);

        if (int.TryParse(parts[0], out var single))
            return (single, single);

        return null;
    }

    private static void ClearScore(Lead lead)
    {
        lead.IcpScore              = null;
        lead.Classification        = null;
        lead.IcpProfileId          = null;
        lead.MatchedCriteria       = null;
        lead.MismatchReasons       = null;
        lead.ScoreBreakdown        = null;
        lead.JobTitleMatchScore    = 0;
        lead.IndustryMatchScore    = 0;
        lead.CompanySizeMatchScore = 0;
        lead.PainMatchScore        = 0;
        lead.ActivitySignalsScore  = 0;
    }
}
