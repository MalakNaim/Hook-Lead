using FluentValidation;
using HookLeads.Domain.Enums;

namespace HookLeads.Application.Features.Icp.AddIcpCriterion;

public class AddIcpCriterionCommandValidator : AbstractValidator<AddIcpCriterionCommand>
{
    private static readonly string[] ValidTypes =
        Enum.GetNames<CriterionType>().Select(n => n.ToLower()).ToArray();

    public AddIcpCriterionCommandValidator()
    {
        RuleFor(x => x.CriterionType)
            .NotEmpty().WithMessage("Criterion type is required.")
            .Must(t => ValidTypes.Contains(t.ToLower()))
            .WithMessage($"Criterion type must be one of: {string.Join(", ", Enum.GetNames<CriterionType>())}.");

        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Criterion value is required.")
            .MaximumLength(500).WithMessage("Criterion value must not exceed 500 characters.");

        RuleFor(x => x.Weight)
            .InclusiveBetween(1, 10).WithMessage("Weight must be between 1 and 10.");
    }
}
