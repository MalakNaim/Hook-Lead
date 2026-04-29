using FluentValidation;
using HookLeads.Domain.Enums;

namespace HookLeads.Application.Features.Leads.UpdateLeadStatus;

public class UpdateLeadStatusCommandValidator : AbstractValidator<UpdateLeadStatusCommand>
{
    private static readonly string[] ValidStatuses =
        Enum.GetNames<LeadStatus>().Select(n => n.ToLower()).ToArray();

    public UpdateLeadStatusCommandValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => ValidStatuses.Contains(s.ToLower()))
            .WithMessage($"Status must be one of: {string.Join(", ", Enum.GetNames<LeadStatus>())}.");
    }
}
