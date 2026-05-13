using FluentValidation;
using HookLeads.Domain.Enums;

namespace HookLeads.Application.Features.Leads.UpdateLeadQualification;

public class UpdateLeadQualificationCommandValidator : AbstractValidator<UpdateLeadQualificationCommand>
{
    private static readonly string[] ValidStatuses = Enum.GetNames<QualificationStatus>();

    public UpdateLeadQualificationCommandValidator()
    {
        RuleFor(x => x.QualificationStatus)
            .NotEmpty()
            .Must(s => ValidStatuses.Contains(s, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"qualificationStatus must be one of: {string.Join(", ", ValidStatuses)}");

        RuleFor(x => x.QualificationNotes)
            .MaximumLength(5000)
            .When(x => x.QualificationNotes != null);
    }
}
