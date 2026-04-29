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

    public (int score, string breakdown) CalculateScore(Lead lead, IcpProfile profile)
    {
        var items = new List<ScoreBreakdownItem>();
        int totalWeight = 0;
        int matchedWeight = 0;

        foreach (var criterion in profile.Criteria)
        {
            var leadValue = GetLeadFieldValue(lead, criterion.CriterionType);
            var targetValue = criterion.Value.Trim();
            var matched = leadValue != null &&
                          string.Equals(leadValue.Trim(), targetValue, StringComparison.OrdinalIgnoreCase);

            totalWeight += criterion.Weight;
            if (matched) matchedWeight += criterion.Weight;

            items.Add(new ScoreBreakdownItem(
                criterion.CriterionType.ToString(),
                targetValue,
                leadValue,
                criterion.Weight,
                matched));
        }

        var score = totalWeight == 0 ? 0 : (int)Math.Round((double)matchedWeight / totalWeight * 100);
        var breakdown = JsonSerializer.Serialize(items, JsonOptions);
        return (score, breakdown);
    }

    public async Task RescoreWorkspaceLeadsAsync(CancellationToken cancellationToken = default)
    {
        var activeProfile = await _context.IcpProfiles
            .Include(p => p.Criteria)
            .FirstOrDefaultAsync(p => p.IsActive, cancellationToken);

        var leads = await _context.Leads.ToListAsync(cancellationToken);

        if (activeProfile == null || !activeProfile.Criteria.Any())
        {
            foreach (var lead in leads)
            {
                lead.IcpScore = null;
                lead.ScoreBreakdown = null;
            }
        }
        else
        {
            foreach (var lead in leads)
            {
                var (score, breakdown) = CalculateScore(lead, activeProfile);
                lead.IcpScore = score;
                lead.ScoreBreakdown = breakdown;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    private static string? GetLeadFieldValue(Lead lead, CriterionType criterionType) =>
        criterionType switch
        {
            CriterionType.Industry => lead.Industry,
            CriterionType.CompanySize => lead.CompanySize,
            CriterionType.JobTitle => lead.JobTitle,
            CriterionType.Geography => lead.Geography,
            CriterionType.RevenueRange => lead.RevenueRange,
            _ => null
        };

    private record ScoreBreakdownItem(
        string CriterionType,
        string TargetValue,
        string? LeadValue,
        int Weight,
        bool Matched);
}
