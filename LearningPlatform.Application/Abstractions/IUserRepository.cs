using LearningPlatform.Domain.Users;

namespace LearningPlatform.Application.Abstractions
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByIdAsync(Guid id, CancellationToken ct);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByEmailAsync(string email, CancellationToken ct);
        Task<User?> AddAsync(User user);
        Task AddAsync(User user, CancellationToken ct);
        Task SaveAsync(User user);
    }
}
