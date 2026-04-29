using FluentValidation;

namespace HookLeads.Application.Features.Import.ImportLeadsCsv;

public class ImportLeadsCsvCommandValidator : AbstractValidator<ImportLeadsCsvCommand>
{
    public ImportLeadsCsvCommandValidator()
    {
        RuleFor(x => x.CsvContent)
            .NotEmpty().WithMessage("CSV content is required.");
    }
}
