using HookLeads.Application.Common.Models;
using HookLeads.Domain.Entities;

namespace HookLeads.Application.Common.Extensions;

public static class OutreachMessageExtensions
{
    public static OutreachMessageResult ToOutreachMessageResult(this OutreachMessage message) =>
        new(message.Id, message.LeadId, message.Subject, message.Body,
            message.Status.ToString(), message.CreatedAt, message.SentAt);
}
