using HookLeads.Application.Common.Exceptions;
using HookLeads.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HookLeads.Application.Features.Workspace.RemoveMember;

public class RemoveMemberCommandHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public RemoveMemberCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(RemoveMemberCommand command, CancellationToken cancellationToken = default)
    {
        if (_currentUser.UserId == command.UserId)
            throw new AppException("You cannot remove yourself from the workspace.", 400);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == command.UserId, cancellationToken);

        if (user == null)
            throw new AppException("Member not found.", 404);

        user.IsActive = false;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
