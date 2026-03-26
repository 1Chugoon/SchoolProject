using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Courses;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Infrastructure.Persistence.Repositories
{
    public class TagRepository (AppDbContext db) : ITagRepository
    {
        private readonly AppDbContext _db = db;
        public async Task<Tag?> GetByIdAsync(Guid id)
        {
            return await _db.Tags.
                FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
