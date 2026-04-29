using FluentValidation;

namespace HookLeads.Application.Features.Import.ImportLinkedInLead;

public class ImportLinkedInLeadCommandValidator : AbstractValidator<ImportLinkedInLeadCommand>
{
    public ImportLinkedInLeadCommandValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("LinkedIn URL is required.")
            .MaximumLength(500)
            .Must(BeALinkedInUrl).WithMessage("URL must be a valid LinkedIn profile URL (e.g. https://linkedin.com/in/handle).");
    }

    private static bool BeALinkedInUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)) return false;
        return uri.Host.Contains("linkedin.com", StringComparison.OrdinalIgnoreCase) &&
               uri.AbsolutePath.Contains("/in/", StringComparison.OrdinalIgnoreCase);
    }
}
