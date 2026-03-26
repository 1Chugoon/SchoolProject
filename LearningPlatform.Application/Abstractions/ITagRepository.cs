using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Application.Abstractions
{
    public interface ITagRepository
    {
        Task<Tag?> GetByIdAsync(Guid id);
    }
}
