using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Workspace.GetWorkspaceMembers;

public class GetWorkspaceMembersQueryHandler
{
    private readonly IApplicationDbContext _context;

    public GetWorkspaceMembersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<WorkspaceMemberResult>> Handle(GetWorkspaceMembersQuery query, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Where(u => u.WorkspaceId == query.WorkspaceId)
            .OrderBy(u => u.CreatedAt)
            .Select(u => new WorkspaceMemberResult(
                u.Id,
                u.Email,
                u.Role.ToString(),
                u.IsActive,
                u.CreatedAt))
            .ToListAsync(cancellationToken);
    }
}
