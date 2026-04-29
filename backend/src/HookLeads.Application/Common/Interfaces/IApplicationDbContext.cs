using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Workspace> Workspaces { get; }
    DbSet<User> Users { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<IcpProfile> IcpProfiles { get; }
    DbSet<IcpCriterion> IcpCriteria { get; }
    DbSet<Lead> Leads { get; }
    DbSet<OutreachMessage> OutreachMessages { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
