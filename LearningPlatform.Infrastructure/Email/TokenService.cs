using LearningPlatform.Application.Abstractions;
using System.Security.Cryptography;
using System.Text;

namespace LearningPlatform.Infrastructure.Email
{
    public class TokenService : ITokenService
    {
        public string GenerateToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(bytes);
        }

        public string HashToken(string token)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(bytes);
        }
    }
}
