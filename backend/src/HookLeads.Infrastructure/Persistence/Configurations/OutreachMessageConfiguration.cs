using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HookLeads.Infrastructure.Persistence.Configurations;

public class OutreachMessageConfiguration : IEntityTypeConfiguration<OutreachMessage>
{
    public void Configure(EntityTypeBuilder<OutreachMessage> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Subject).IsRequired().HasMaxLength(500);
        builder.Property(m => m.Body).IsRequired().HasColumnType("nvarchar(max)");

        builder.Property(m => m.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasOne(m => m.Lead)
            .WithMany()
            .HasForeignKey(m => m.LeadId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.Workspace)
            .WithMany()
            .HasForeignKey(m => m.WorkspaceId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(m => m.GeneratedByUser)
            .WithMany()
            .HasForeignKey(m => m.GeneratedBy)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
