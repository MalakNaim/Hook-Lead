namespace HookLeads.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(Guid userId, Guid workspaceId, string email, string role);
    string GenerateRefreshToken();
    string HashToken(string token);
    DateTime GetRefreshTokenExpiry();
}
