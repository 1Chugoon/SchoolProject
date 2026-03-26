using LearningPlatform.Domain.Users;

namespace LearningPlatform.Application.Abstractions
{
    public interface IJwtTokenGenerator
    {
        string Generate(User user);
    }
}