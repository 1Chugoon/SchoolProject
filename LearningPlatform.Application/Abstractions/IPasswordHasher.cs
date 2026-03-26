namespace LearningPlatform.Application.Abstractions
{
    public interface IPasswordHasher
    {
        bool Verify(string password, string passwordHash);
        string Generate(string password);
    }
}