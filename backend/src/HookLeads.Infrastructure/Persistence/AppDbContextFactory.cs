using HookLeads.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace HookLeads.Infrastructure.Persistence;

// Used by dotnet-ef CLI at design time (migrations). Not used at runtime.
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=localhost,1433;Database=HookLeads;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True");

        return new AppDbContext(optionsBuilder.Options, new NullWorkspaceService());
    }

    private sealed class NullWorkspaceService : ICurrentWorkspaceService
    {
        public Guid? WorkspaceId => null;
    }
}
