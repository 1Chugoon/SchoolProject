using LearningPlatform.Domain.Courses;
using LearningPlatform.Domain.DTO;

namespace LearningPlatform.Application.Abstractions
{
    public interface ICoursePurchaseRepository
    {
        Task<bool> HasAccessAsync(Guid userId, Guid courseId);
        Task AddAsync(CoursePurchase purchase);
        Task<IReadOnlyCollection<UserCourseDto>> GetUserCoursesAsync(Guid userId);
    }
}
