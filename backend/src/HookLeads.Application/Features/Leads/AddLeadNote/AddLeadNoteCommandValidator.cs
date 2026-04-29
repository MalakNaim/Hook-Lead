using FluentValidation;

namespace HookLeads.Application.Features.Leads.AddLeadNote;

public class AddLeadNoteCommandValidator : AbstractValidator<AddLeadNoteCommand>
{
    public AddLeadNoteCommandValidator()
    {
        RuleFor(x => x.Note)
            .NotEmpty().WithMessage("Note content is required.")
            .MaximumLength(2000).WithMessage("Note must not exceed 2000 characters.");
    }
}
