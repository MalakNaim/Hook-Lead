using FluentValidation;
using HookLeads.Domain.Enums;

namespace HookLeads.Application.Features.Leads.CreateLead;

public class CreateLeadCommandValidator : AbstractValidator<CreateLeadCommand>
{
    public CreateLeadCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required.").MaximumLength(200);
        RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required.").MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.").MaximumLength(500);
        RuleFor(x => x.JobTitle).MaximumLength(200).When(x => x.JobTitle != null);
        RuleFor(x => x.Company).MaximumLength(200).When(x => x.Company != null);
        RuleFor(x => x.Industry).MaximumLength(100).When(x => x.Industry != null);
        RuleFor(x => x.CompanySize).MaximumLength(100).When(x => x.CompanySize != null);
        RuleFor(x => x.Geography).MaximumLength(200).When(x => x.Geography != null);
        RuleFor(x => x.RevenueRange).MaximumLength(100).When(x => x.RevenueRange != null);
        RuleFor(x => x.LinkedInUrl).MaximumLength(500).When(x => x.LinkedInUrl != null);
        RuleFor(x => x.Notes).MaximumLength(5000).When(x => x.Notes != null);
        RuleFor(x => x.CompanyWebsite).MaximumLength(500).When(x => x.CompanyWebsite != null);
        RuleFor(x => x.Phone).MaximumLength(50).When(x => x.Phone != null);
        RuleFor(x => x.WhatsApp).MaximumLength(50).When(x => x.WhatsApp != null);
        RuleFor(x => x.EmailVerificationStatus)
            .Must(v => v == null || Enum.TryParse<EmailVerificationStatus>(v, ignoreCase: true, out _))
            .WithMessage("Invalid email verification status.");
        RuleFor(x => x.EnrichmentStatus)
            .Must(v => v == null || Enum.TryParse<EnrichmentStatus>(v, ignoreCase: true, out _))
            .WithMessage("Invalid enrichment status.");
        RuleFor(x => x.Source)
            .Must(v => v == null || Enum.TryParse<LeadSource>(v, ignoreCase: true, out _))
            .WithMessage("Invalid lead source.");
    }
}
