using FluentValidation;
using HookLeads.Application.Features.Auth.ForgotPassword;
using HookLeads.Application.Features.Auth.Login;
using HookLeads.Application.Features.Auth.Logout;
using HookLeads.Application.Features.Auth.RefreshToken;
using HookLeads.Application.Features.Auth.Register;
using HookLeads.Application.Features.Auth.ResetPassword;
using HookLeads.Application.Features.Workspace.GetWorkspace;
using HookLeads.Application.Features.Workspace.GetWorkspaceMembers;
using HookLeads.Application.Features.Workspace.InviteMember;
using HookLeads.Application.Features.Workspace.RemoveMember;
using Microsoft.Extensions.DependencyInjection;

namespace HookLeads.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<RegisterCommandHandler>();
        services.AddScoped<LoginCommandHandler>();
        services.AddScoped<RefreshTokenCommandHandler>();
        services.AddScoped<LogoutCommandHandler>();
        services.AddScoped<ForgotPasswordCommandHandler>();
        services.AddScoped<ResetPasswordCommandHandler>();

        services.AddScoped<GetWorkspaceQueryHandler>();
        services.AddScoped<GetWorkspaceMembersQueryHandler>();
        services.AddScoped<InviteMemberCommandHandler>();
        services.AddScoped<RemoveMemberCommandHandler>();

        return services;
    }
}
