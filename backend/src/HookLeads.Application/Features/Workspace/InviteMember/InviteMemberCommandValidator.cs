using FluentValidation;

namespace HookLeads.Application.Features.Workspace.InviteMember;

public class InviteMemberCommandValidator : AbstractValidator<InviteMemberCommand>
{
    public InviteMemberCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(320).WithMessage("Email must not exceed 320 characters.");

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Role is required.")
            .Must(r => r.Equals("Admin", StringComparison.OrdinalIgnoreCase)
                    || r.Equals("Rep", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Role must be Admin or Rep.");
    }
}
