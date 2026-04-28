namespace HookLeads.Application.Features.Auth.ResetPassword;

public record ResetPasswordCommand(string Token, string NewPassword, string ConfirmPassword);
