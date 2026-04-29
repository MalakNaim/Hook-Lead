using HookLeads.Application.Common.Interfaces;
using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Infrastructure.Persistence;

public class AppDbContext : DbContext, IApplicationDbContext
{
    private readonly ICurrentWorkspaceService _workspaceService;

    public AppDbContext(DbContextOptions<AppDbContext> options, ICurrentWorkspaceService workspaceService)
        : base(options)
    {
        _workspaceService = workspaceService;
    }

    public DbSet<Workspace> Workspaces => Set<Workspace>();
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<IcpProfile> IcpProfiles => Set<IcpProfile>();
    public DbSet<IcpCriterion> IcpCriteria => Set<IcpCriterion>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<OutreachMessage> OutreachMessages => Set<OutreachMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global tenant isolation filters. WorkspaceId is null during migrations and background jobs;
        // the filter is skipped in those cases. Related entities filter through their parent's WorkspaceId.
        modelBuilder.Entity<User>().HasQueryFilter(u =>
            _workspaceService.WorkspaceId == null || u.WorkspaceId == _workspaceService.WorkspaceId.Value);

        modelBuilder.Entity<RefreshToken>().HasQueryFilter(rt =>
            _workspaceService.WorkspaceId == null || rt.User.WorkspaceId == _workspaceService.WorkspaceId.Value);

        modelBuilder.Entity<IcpProfile>().HasQueryFilter(p =>
            _workspaceService.WorkspaceId == null || p.WorkspaceId == _workspaceService.WorkspaceId.Value);

        modelBuilder.Entity<IcpCriterion>().HasQueryFilter(c =>
            _workspaceService.WorkspaceId == null || c.IcpProfile.WorkspaceId == _workspaceService.WorkspaceId.Value);

        modelBuilder.Entity<Lead>().HasQueryFilter(l =>
            _workspaceService.WorkspaceId == null || l.WorkspaceId == _workspaceService.WorkspaceId.Value);

        modelBuilder.Entity<OutreachMessage>().HasQueryFilter(m =>
            _workspaceService.WorkspaceId == null || m.WorkspaceId == _workspaceService.WorkspaceId.Value);
    }
}
