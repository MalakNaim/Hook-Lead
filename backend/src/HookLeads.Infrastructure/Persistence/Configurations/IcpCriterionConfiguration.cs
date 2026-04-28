using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HookLeads.Infrastructure.Persistence.Configurations;

public class IcpCriterionConfiguration : IEntityTypeConfiguration<IcpCriterion>
{
    public void Configure(EntityTypeBuilder<IcpCriterion> builder)
    {
        builder.ToTable("IcpCriteria");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.CriterionType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(c => c.Value)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(c => c.Weight)
            .IsRequired();

        builder.HasOne(c => c.IcpProfile)
            .WithMany(p => p.Criteria)
            .HasForeignKey(c => c.IcpProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
