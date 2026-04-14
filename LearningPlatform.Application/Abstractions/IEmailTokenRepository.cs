using LearningPlatform.Domain.Users;
namespace LearningPlatform.Application.Abstractions
{
    public interface IEmailTokenRepository
    {
        Task AddAsync(EmailConfirmationToken token, CancellationToken ct);
        Task<EmailConfirmationToken?> GetValidTokenAsync(
            Guid userId,
            string tokenHash,
            CancellationToken ct);
        Task DeleteByUserIdAsync(Guid userId, CancellationToken ct);
    }
}
