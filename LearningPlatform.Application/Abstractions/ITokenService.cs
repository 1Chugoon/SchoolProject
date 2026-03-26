namespace LearningPlatform.Application.Abstractions
{
    public interface ITokenService
    {
        string GenerateToken();
        string HashToken(string token);
    }
}
