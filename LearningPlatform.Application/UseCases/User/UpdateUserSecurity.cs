using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.User
{
    public class UpdateUserSecurity(IUserRepository userRepository, IPasswordHasher hasher)
    {
        private readonly IPasswordHasher _hasher = hasher;
        private readonly IUserRepository _userRepository = userRepository;
        public async Task ExecuteAsync(Guid userId, string? oldPassword,string? newPassword, string? email)
        {
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new NotFoundException();

            if (!string.IsNullOrEmpty(newPassword) && !string.IsNullOrEmpty(oldPassword))
            {
                if (!_hasher.Verify(oldPassword, user.PasswordHash))
                    throw new InvalidCredentials();

                user.UpdatePasswordHash(_hasher.Generate(newPassword));
            }
            if (email != null)
                user.UpdateEmail(email);

            await _userRepository.SaveAsync(user);
        }
    }
}
