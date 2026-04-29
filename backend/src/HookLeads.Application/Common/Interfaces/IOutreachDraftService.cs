using HookLeads.Domain.Entities;

namespace HookLeads.Application.Common.Interfaces;

public interface IOutreachDraftService
{
    (string subject, string body) GenerateDraft(Lead lead);
}
