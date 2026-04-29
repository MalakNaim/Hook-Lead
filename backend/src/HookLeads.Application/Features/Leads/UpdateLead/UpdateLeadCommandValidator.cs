using FluentValidation;

namespace HookLeads.Application.Features.Leads.UpdateLead;

public class UpdateLeadCommandValidator : AbstractValidator<UpdateLeadCommand>
{
    public UpdateLeadCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required.").MaximumLength(200);
        RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required.").MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.").EmailAddress().WithMessage("A valid email address is required.").MaximumLength(500);
        RuleFor(x => x.JobTitle).MaximumLength(200).When(x => x.JobTitle != null);
        RuleFor(x => x.Company).MaximumLength(200).When(x => x.Company != null);
        RuleFor(x => x.Industry).MaximumLength(100).When(x => x.Industry != null);
        RuleFor(x => x.CompanySize).MaximumLength(100).When(x => x.CompanySize != null);
        RuleFor(x => x.Geography).MaximumLength(200).When(x => x.Geography != null);
        RuleFor(x => x.RevenueRange).MaximumLength(100).When(x => x.RevenueRange != null);
        RuleFor(x => x.LinkedInUrl).MaximumLength(500).When(x => x.LinkedInUrl != null);
    }
}
