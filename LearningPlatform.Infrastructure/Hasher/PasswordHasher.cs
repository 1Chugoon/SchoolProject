using LearningPlatform.Application.Abstractions;

namespace LearningPlatform.Infrastructure.Hasher
{
    public class PasswordHasher : IPasswordHasher
    {
        public bool Verify(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
        public string Generate(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
