using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Courses;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Infrastructure.Persistence.Repositories
{
    public class LessonRepository(AppDbContext db) : ILessonRepository
    {
        private readonly AppDbContext _db = db;

        public async Task AddAsync(Lesson lesson)
        {
            await _db.Lessons.AddAsync(lesson);
            await _db.SaveChangesAsync();
        }

        public Task DeleteAsync(Lesson lesson)
        {
            _db.Lessons.Remove(lesson);
            return Task.CompletedTask;
        }

        public Task<Lesson?> GetByIdAsync(Guid id)
        {
            return _db.Lessons
                .Include(x => x.Module)
                .ThenInclude(x => x.Course)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<Lesson?> GetByIdAsync(Guid lessonId, Guid moduleId, CancellationToken ct)
        {
            return _db.Lessons
                .FirstOrDefaultAsync(x => x.Id == lessonId && x.ModuleId == moduleId, ct);
        }

        public async Task SaveChangesAsync(CancellationToken ct)
        {
            await _db.SaveChangesAsync(ct);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
