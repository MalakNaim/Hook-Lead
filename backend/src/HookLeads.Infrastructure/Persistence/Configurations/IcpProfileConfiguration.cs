using System.Text.Json;
using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HookLeads.Infrastructure.Persistence.Configurations;

public class IcpProfileConfiguration : IEntityTypeConfiguration<IcpProfile>
{
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    private static readonly ValueComparer<List<string>> _listComparer = new(
        (a, b) => a != null && b != null && a.SequenceEqual(b),
        c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
        c => c.ToList());

    public void Configure(EntityTypeBuilder<IcpProfile> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.IsActive).IsRequired();
        builder.Property(p => p.UpdatedAt).IsRequired();

        builder.Property(p => p.CompanySizeMin).HasDefaultValue(0);
        builder.Property(p => p.CompanySizeMax).HasDefaultValue(0);
        builder.Property(p => p.BudgetMin).HasDefaultValue(0);
        builder.Property(p => p.BudgetMax).HasDefaultValue(0);
        builder.Property(p => p.DecisionMaker).HasDefaultValue(false);

        JsonList(builder, p => p.Industries);
        JsonList(builder, p => p.JobTitles);
        JsonList(builder, p => p.Locations);
        JsonList(builder, p => p.PainPoints);
        JsonList(builder, p => p.BuyingTriggers);

        builder.HasOne(p => p.Workspace)
            .WithMany(w => w.IcpProfiles)
            .HasForeignKey(p => p.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void JsonList(
        EntityTypeBuilder<IcpProfile> b,
        System.Linq.Expressions.Expression<Func<IcpProfile, List<string>>> prop)
    {
        b.Property(prop)
            .HasConversion(
                v => JsonSerializer.Serialize(v, _json),
                v => JsonSerializer.Deserialize<List<string>>(v, _json) ?? new List<string>())
            .HasColumnType("nvarchar(max)")
            .Metadata.SetValueComparer(_listComparer);
    }
}
