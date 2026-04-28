using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HookLeads.Infrastructure.Persistence.Configurations;

public class IcpProfileConfiguration : IEntityTypeConfiguration<IcpProfile>
{
    public void Configure(EntityTypeBuilder<IcpProfile> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.IsActive)
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .IsRequired();

        builder.HasOne(p => p.Workspace)
            .WithMany(w => w.IcpProfiles)
            .HasForeignKey(p => p.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
