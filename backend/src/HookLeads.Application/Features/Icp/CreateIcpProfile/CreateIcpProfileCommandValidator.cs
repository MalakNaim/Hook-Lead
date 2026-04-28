using FluentValidation;

namespace HookLeads.Application.Features.Icp.CreateIcpProfile;

public class CreateIcpProfileCommandValidator : AbstractValidator<CreateIcpProfileCommand>
{
    public CreateIcpProfileCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("ICP profile name is required.")
            .MaximumLength(200).WithMessage("ICP profile name must not exceed 200 characters.");
    }
}
