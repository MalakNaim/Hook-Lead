using System.Security.Claims;
using HookLeads.Application.Common.Interfaces;

namespace HookLeads.Api.Services;

public class CurrentWorkspaceService : ICurrentWorkspaceService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentWorkspaceService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? WorkspaceId
    {
        get
        {
            var value = _httpContextAccessor.HttpContext?.User
                .FindFirstValue("workspaceId");
            return Guid.TryParse(value, out var id) ? id : null;
        }
    }
}
