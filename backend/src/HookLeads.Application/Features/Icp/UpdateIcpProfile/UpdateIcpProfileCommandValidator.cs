using FluentValidation;

namespace HookLeads.Application.Features.Icp.UpdateIcpProfile;

public class UpdateIcpProfileCommandValidator : AbstractValidator<UpdateIcpProfileCommand>
{
    public UpdateIcpProfileCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("ICP profile name is required.")
            .MaximumLength(200).WithMessage("ICP profile name must not exceed 200 characters.");
    }
}
