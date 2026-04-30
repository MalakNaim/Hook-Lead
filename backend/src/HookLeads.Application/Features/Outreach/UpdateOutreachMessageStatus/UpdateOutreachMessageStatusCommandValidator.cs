using FluentValidation;
using HookLeads.Domain.Enums;

namespace HookLeads.Application.Features.Outreach.UpdateOutreachMessageStatus;

public class UpdateOutreachMessageStatusCommandValidator : AbstractValidator<UpdateOutreachMessageStatusCommand>
{
    private static readonly string[] ValidStatuses =
        Enum.GetNames<OutreachStatus>().Select(n => n.ToLower()).ToArray();

    public UpdateOutreachMessageStatusCommandValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => ValidStatuses.Contains(s.ToLower()))
            .WithMessage($"Status must be one of: {string.Join(", ", Enum.GetNames<OutreachStatus>())}.");
    }
}
