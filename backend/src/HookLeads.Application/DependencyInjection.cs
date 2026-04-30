using FluentValidation;
using HookLeads.Application.Common.Interfaces;
using HookLeads.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HookLeads.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;

        services.AddValidatorsFromAssembly(assembly);

        services.AddScoped<ILeadScoringService, LeadScoringService>();
        services.AddScoped<IOutreachDraftService, OutreachDraftService>();

        // Register all command and query handlers in this assembly by convention.
        foreach (var handlerType in assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract &&
                        (t.Name.EndsWith("CommandHandler") || t.Name.EndsWith("QueryHandler"))))
        {
            services.AddScoped(handlerType);
        }

        return services;
    }
}
