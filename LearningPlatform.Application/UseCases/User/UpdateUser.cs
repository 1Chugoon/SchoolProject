using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.User
{
    public class UpdateUser(IUserRepository userRepository)
    {
        private readonly IUserRepository _userRepository = userRepository;

        public async Task ExecuteAsync(Guid userId, string? name, string? description)
        {
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new NotFoundException();
            user.UpdateName(string.IsNullOrWhiteSpace(name) ? user.Name : name);
            user.UpdateDescription(string.IsNullOrWhiteSpace(description) ? user.Description : description);
            await _userRepository.SaveAsync(user);
        }
    }
}
