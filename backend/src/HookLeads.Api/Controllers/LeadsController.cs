using FluentValidation;
using HookLeads.Application.Features.Leads.AddLeadNote;
using HookLeads.Application.Features.Leads.DeleteLead;
using HookLeads.Application.Features.Leads.GetLeadById;
using HookLeads.Application.Features.Leads.GetLeads;
using HookLeads.Application.Features.Leads.UpdateLead;
using HookLeads.Application.Features.Leads.UpdateLeadStatus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HookLeads.Api.Controllers;

[ApiController]
[Route("api/leads")]
[Authorize]
public class LeadsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetLeads(
        [FromServices] GetLeadsQueryHandler handler,
        CancellationToken cancellationToken,
        [FromQuery] string? status,
        [FromQuery] string? industry,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] int? minScore,
        [FromQuery] int? maxScore,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = new GetLeadsQuery(status, industry, dateFrom, dateTo, minScore, maxScore, pageNumber, pageSize);
        var result = await handler.Handle(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetLeadById(
        Guid id,
        [FromServices] GetLeadByIdQueryHandler handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetLeadByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateLead(
        Guid id,
        [FromBody] UpdateLeadCommand command,
        [FromServices] UpdateLeadCommandHandler handler,
        [FromServices] IValidator<UpdateLeadCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, id, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteLead(
        Guid id,
        [FromServices] DeleteLeadCommandHandler handler,
        CancellationToken cancellationToken)
    {
        await handler.Handle(id, cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateLeadStatus(
        Guid id,
        [FromBody] UpdateLeadStatusCommand command,
        [FromServices] UpdateLeadStatusCommandHandler handler,
        [FromServices] IValidator<UpdateLeadStatusCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, id, cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id:guid}/notes")]
    public async Task<IActionResult> AddNote(
        Guid id,
        [FromBody] AddLeadNoteCommand command,
        [FromServices] AddLeadNoteCommandHandler handler,
        [FromServices] IValidator<AddLeadNoteCommand> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(command, cancellationToken);
        var result = await handler.Handle(command, id, cancellationToken);
        return Ok(result);
    }
}
