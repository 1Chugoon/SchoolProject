using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Infrastructure.Persistence.Repositories
{
    public class EmailTokenRepository : IEmailTokenRepository
    {
        private readonly AppDbContext _db;

        public EmailTokenRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(EmailConfirmationToken token, CancellationToken ct)
        {
            await _db.EmailConfirmationTokens.AddAsync(token, ct);
            await _db.SaveChangesAsync(ct);
        }

        public async Task DeleteByUserIdAsync(Guid userId, CancellationToken ct)
        {
            await _db.EmailConfirmationTokens
        .Where(x => x.UserId == userId)
        .ExecuteDeleteAsync(ct);
        }

        public async Task<EmailConfirmationToken?> GetValidTokenAsync(
            Guid userId,
            string tokenHash,
            CancellationToken ct)
        {
            return await _db.EmailConfirmationTokens
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.TokenHash == tokenHash &&
                    !x.Used &&
                    x.ExpiresAtUtc > DateTime.UtcNow,
                    ct);
        }
    }
}
