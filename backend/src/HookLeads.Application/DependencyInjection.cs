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
using HookLeads.Application.Features.Icp.CreateIcpProfile;
using HookLeads.Application.Features.Icp.UpdateIcpProfile;
using HookLeads.Application.Features.Icp.GetActiveIcpProfile;
using HookLeads.Application.Features.Icp.AddIcpCriterion;
using HookLeads.Application.Features.Icp.UpdateIcpCriterion;
using HookLeads.Application.Features.Icp.DeleteIcpCriterion;
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

        services.AddScoped<CreateIcpProfileCommandHandler>();
        services.AddScoped<UpdateIcpProfileCommandHandler>();
        services.AddScoped<GetActiveIcpProfileQueryHandler>();
        services.AddScoped<AddIcpCriterionCommandHandler>();
        services.AddScoped<UpdateIcpCriterionCommandHandler>();
        services.AddScoped<DeleteIcpCriterionCommandHandler>();

        return services;
    }
}
