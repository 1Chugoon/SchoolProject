using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Infrastructure.Persistence.Repositories
{
    public class UserRepository(AppDbContext db) : IUserRepository 
    {
        private readonly AppDbContext _db = db;

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<User?> AddAsync(User user)
        {
            if (user == null)
                return null;

            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task SaveAsync(User user)
        {
            if (user == null) return;
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct)
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.Email == email,ct);
        }

        public async Task AddAsync(User user, CancellationToken ct)
        {
            await _db.Users.AddAsync(user, ct);
            await _db.SaveChangesAsync(ct);
        }

        public async Task<User?> GetByIdAsync(Guid id, CancellationToken ct)
        {
           return await _db.Users.FirstOrDefaultAsync(x => x.Id == id,ct);
        }

        public async Task DeleteAsync(Guid id, CancellationToken ct)
        {
            var user = await _db.Users
        .FirstOrDefaultAsync(x => x.Id == id, ct);

            if (user == null)
                return;

            _db.Users.Remove(user);
            await _db.SaveChangesAsync(ct);
        }
    }
}
