using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HookLeads.Infrastructure.Persistence.Configurations;

public class LeadConfiguration : IEntityTypeConfiguration<Lead>
{
    public void Configure(EntityTypeBuilder<Lead> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.FirstName).IsRequired().HasMaxLength(200);
        builder.Property(l => l.LastName).IsRequired().HasMaxLength(200);
        builder.Property(l => l.Email).IsRequired().HasMaxLength(500);
        builder.Property(l => l.JobTitle).HasMaxLength(200);
        builder.Property(l => l.Company).HasMaxLength(200);
        builder.Property(l => l.Industry).HasMaxLength(100);
        builder.Property(l => l.CompanySize).HasMaxLength(100);
        builder.Property(l => l.Geography).HasMaxLength(200);
        builder.Property(l => l.RevenueRange).HasMaxLength(100);
        builder.Property(l => l.LinkedInUrl).HasMaxLength(500);
        builder.Property(l => l.Notes).HasMaxLength(5000);
        builder.Property(l => l.ScoreBreakdown).HasColumnType("nvarchar(max)");

        // New contact fields
        builder.Property(l => l.CompanyWebsite).HasMaxLength(500);
        builder.Property(l => l.Phone).HasMaxLength(50);
        builder.Property(l => l.WhatsApp).HasMaxLength(50);

        builder.Property(l => l.EmailVerificationStatus)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(l => l.EnrichmentStatus)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(l => l.Source)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(l => l.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        // Individual sub-scores — default 0
        builder.Property(l => l.JobTitleMatchScore).HasDefaultValue(0);
        builder.Property(l => l.IndustryMatchScore).HasDefaultValue(0);
        builder.Property(l => l.CompanySizeMatchScore).HasDefaultValue(0);
        builder.Property(l => l.PainMatchScore).HasDefaultValue(0);
        builder.Property(l => l.ActivitySignalsScore).HasDefaultValue(0);

        builder.Property(l => l.Classification)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(l => l.QualificationStatus)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(l => l.QualificationNotes).HasMaxLength(5000);

        builder.Property(l => l.MatchedCriteria).HasColumnType("nvarchar(max)");
        builder.Property(l => l.MismatchReasons).HasColumnType("nvarchar(max)");

        builder.Property(l => l.HandoffStatus)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(l => l.HandoffTarget).HasMaxLength(200);
        builder.Property(l => l.HandoffNotes).HasMaxLength(5000);

        builder.HasIndex(l => new { l.WorkspaceId, l.Email }).IsUnique();

        builder.HasOne(l => l.Workspace)
            .WithMany()
            .HasForeignKey(l => l.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
