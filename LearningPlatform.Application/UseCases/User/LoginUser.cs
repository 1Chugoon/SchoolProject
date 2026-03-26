using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.User
{
    public class LoginUser(
        IUserRepository users,
        IPasswordHasher hasher,
        IJwtTokenGenerator jwt)
    {
        private readonly IUserRepository _users = users;
        private readonly IPasswordHasher _hasher = hasher;
        private readonly IJwtTokenGenerator _jwt = jwt;

        public async Task<string> ExecuteAsync(string email, string password)
        {
            var user = await _users.GetByEmailAsync(email)
                ?? throw new InvalidCredentials("Invalid credentials");

            if (!_hasher.Verify(password, user.PasswordHash))
                throw new InvalidCredentials("Invalid credentials");

            if(!user.EmailConfirmed)
                throw new NotFoundException("Email not confirmed");

            return _jwt.Generate(user);
            
        }
    }
}
