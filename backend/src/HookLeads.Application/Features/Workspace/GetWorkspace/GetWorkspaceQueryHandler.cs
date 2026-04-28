using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Workspace.GetWorkspace;

public class GetWorkspaceQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetWorkspaceQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WorkspaceResult> Handle(GetWorkspaceQuery query, CancellationToken cancellationToken = default)
    {
        var workspace = await _context.Workspaces
            .Include(w => w.Users)
            .FirstOrDefaultAsync(w => w.Id == query.WorkspaceId, cancellationToken);

        if (workspace == null)
            throw new AppException("Workspace not found.", 404);

        return new WorkspaceResult(
            workspace.Id,
            workspace.Name,
            workspace.CreatedAt,
            workspace.Users.Count);
    }
}
