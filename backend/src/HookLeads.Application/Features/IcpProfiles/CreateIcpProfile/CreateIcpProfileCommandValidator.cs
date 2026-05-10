using FluentValidation;

namespace HookLeads.Application.Features.IcpProfiles.CreateIcpProfile;

public class CreateIcpProfileCommandValidator : AbstractValidator<CreateIcpProfileCommand>
{
    public CreateIcpProfileCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Profile name is required.")
            .MaximumLength(200);

        RuleFor(x => x.Industries)
            .NotNull().WithMessage("Industries list is required.");

        RuleFor(x => x.JobTitles)
            .NotNull().WithMessage("Job titles list is required.");

        RuleFor(x => x.CompanySizeMin)
            .GreaterThanOrEqualTo(0).WithMessage("Company size minimum must be 0 or greater.");

        RuleFor(x => x.CompanySizeMax)
            .GreaterThanOrEqualTo(0).WithMessage("Company size maximum must be 0 or greater.");

        RuleFor(x => x.BudgetMin)
            .GreaterThanOrEqualTo(0).WithMessage("Budget minimum must be 0 or greater.");

        RuleFor(x => x.BudgetMax)
            .GreaterThanOrEqualTo(0).WithMessage("Budget maximum must be 0 or greater.");
    }
}
