using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Application.Abstractions
{
    public interface ILessonRepository
    {
        Task<Lesson?> GetByIdAsync(Guid id);
        Task AddAsync(Lesson lesson);
        Task<Lesson?> GetByIdAsync(Guid lessonId, Guid moduleId, CancellationToken ct);
        Task SaveChangesAsync(CancellationToken ct);
        Task SaveChangesAsync();
        Task DeleteAsync(Lesson lesson);
    }
}
