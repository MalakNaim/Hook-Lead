using FluentValidation;
using HookLeads.Application.Features.Import.ConfirmCsvImport;
using HookLeads.Application.Features.Import.ConfirmLinkedInImport;
using HookLeads.Application.Features.Import.ImportLeadsCsv;
using HookLeads.Application.Features.Import.ImportLinkedInLead;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Route("import")]
[Authorize(Roles = "Admin")]
public class ImportController : ControllerBase
{
    [HttpPost("csv/preview")]
    public async Task<IActionResult> CsvPreview(
        IFormFile file,
        [FromServices] ImportLeadsCsvCommandHandler handler,
        [FromServices] IValidator<ImportLeadsCsvCommand> validator,
        CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "A CSV file is required." });

        using var reader = new StreamReader(file.OpenReadStream());
        var content = await reader.ReadToEndAsync(cancellationToken);

        var command = new ImportLeadsCsvCommand(content);
        await validator.ValidateAndThrowAsync(command, cancellationToken);

        var result = await handler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("csv/confirm")]
    public async Task<IActionResult> CsvConfirm(
        [FromBody] ConfirmCsvImportCommand command,
        [FromServices] ConfirmCsvImportCommandHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("linkedin/preview")]
    public async Task<IActionResult> LinkedInPreview(
        [FromBody] ImportLinkedInLeadCommand command,
        [FromServices] ImportLinkedInLeadCommandHandler handler,
        [FromServices] IValidator<ImportLinkedInLeadCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("linkedin/confirm")]
    public async Task<IActionResult> LinkedInConfirm(
        [FromBody] ConfirmLinkedInImportCommand command,
        [FromServices] ConfirmLinkedInImportCommandHandler handler,
        [FromServices] IValidator<ConfirmLinkedInImportCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, cancellationToken);
        return Ok(result);
    }
}
