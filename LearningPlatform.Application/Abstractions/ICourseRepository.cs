using LearningPlatform.Domain.Courses;
using LearningPlatform.Domain.DTO;

namespace LearningPlatform.Application.Abstractions
{
    public interface ICourseRepository
    {
        Task<Course?> GetByIdAsync(Guid id);
        Task AddAsync(Course course);
        Task SaveAsync(Course course);
        Task<IReadOnlyList<Course>> GetVisibleAsync(Guid? userId);

        Task<Course?> GetByIdWithTagsAsync(Guid Id);
        Task<Course?> GetByIdWithLessonsAsync(Guid Id);

        Task<IReadOnlyList<LessonDto>> GetCourseLessonsAsync(Course course);

        Task<Course?> GetbyGetByModuleIdAsync(Guid moduleId, Guid? userId);

        Task<IReadOnlyList<Course>> GetCoursesByAuthor(Guid userId);

    }
}
