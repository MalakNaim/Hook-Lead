using FluentValidation;
using HookLeads.Application.Common.Interfaces;
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
using HookLeads.Application.Features.Leads.GetLeads;
using HookLeads.Application.Features.Leads.GetLeadById;
using HookLeads.Application.Features.Leads.GetLeadScore;
using HookLeads.Application.Features.Leads.UpdateLead;
using HookLeads.Application.Features.Leads.DeleteLead;
using HookLeads.Application.Features.Leads.UpdateLeadStatus;
using HookLeads.Application.Features.Leads.AddLeadNote;
using HookLeads.Application.Features.Import.ImportLeadsCsv;
using HookLeads.Application.Features.Import.ConfirmCsvImport;
using HookLeads.Application.Features.Import.ImportLinkedInLead;
using HookLeads.Application.Features.Import.ConfirmLinkedInImport;
using HookLeads.Application.Features.Outreach.GenerateOutreachMessage;
using HookLeads.Application.Features.Outreach.GetOutreachEmailDraft;
using HookLeads.Application.Features.Outreach.GetOutreachMessages;
using HookLeads.Application.Features.Outreach.UpdateOutreachMessageStatus;
using HookLeads.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HookLeads.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<ILeadScoringService, LeadScoringService>();
        services.AddScoped<IOutreachDraftService, OutreachDraftService>();

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

        services.AddScoped<GetLeadsQueryHandler>();
        services.AddScoped<GetLeadByIdQueryHandler>();
        services.AddScoped<GetLeadScoreQueryHandler>();
        services.AddScoped<UpdateLeadCommandHandler>();
        services.AddScoped<DeleteLeadCommandHandler>();
        services.AddScoped<UpdateLeadStatusCommandHandler>();
        services.AddScoped<AddLeadNoteCommandHandler>();

        services.AddScoped<ImportLeadsCsvCommandHandler>();
        services.AddScoped<ConfirmCsvImportCommandHandler>();
        services.AddScoped<ImportLinkedInLeadCommandHandler>();
        services.AddScoped<ConfirmLinkedInImportCommandHandler>();

        services.AddScoped<GenerateOutreachMessageCommandHandler>();
        services.AddScoped<GetOutreachEmailDraftQueryHandler>();
        services.AddScoped<GetOutreachMessagesQueryHandler>();
        services.AddScoped<UpdateOutreachMessageStatusCommandHandler>();

        return services;
    }
}
