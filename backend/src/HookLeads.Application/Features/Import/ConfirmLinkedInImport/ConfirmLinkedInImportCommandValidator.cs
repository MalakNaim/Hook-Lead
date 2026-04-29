using FluentValidation;

namespace HookLeads.Application.Features.Import.ConfirmLinkedInImport;

public class ConfirmLinkedInImportCommandValidator : AbstractValidator<ConfirmLinkedInImportCommand>
{
    public ConfirmLinkedInImportCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required.").MaximumLength(200);
        RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required.").MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.").EmailAddress().WithMessage("A valid email address is required.").MaximumLength(500);
        RuleFor(x => x.LinkedInUrl).MaximumLength(500).When(x => x.LinkedInUrl != null);
    }
}
