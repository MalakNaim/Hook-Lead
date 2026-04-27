using HookLeads.Application.Common.Interfaces;
using HookLeads.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Infrastructure.Persistence;

public class AppDbContext : DbContext
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global tenant isolation filters. WorkspaceId is null during migrations and background jobs;
        // the filter is skipped in those cases. RefreshToken gets a matching filter to satisfy
        // EF Core's requirement that both ends of a required relationship share the same filter logic.
        modelBuilder.Entity<User>().HasQueryFilter(u =>
            _workspaceService.WorkspaceId == null || u.WorkspaceId == _workspaceService.WorkspaceId.Value);

        modelBuilder.Entity<RefreshToken>().HasQueryFilter(rt =>
            _workspaceService.WorkspaceId == null || rt.User.WorkspaceId == _workspaceService.WorkspaceId.Value);
    }
}
