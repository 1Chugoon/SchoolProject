using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;
using LearningPlatform.Domain.DTO;

namespace LearningPlatform.Application.UseCases.Lessons
{
    public class GetCourseLessons(ICourseRepository courseRepository)
    {
        private readonly ICourseRepository _courseRepository = courseRepository;

        public async Task<IReadOnlyList<LessonDto>> ExecuteAsync(Guid courseId)
        {

            var course = await _courseRepository.GetByIdWithLessonsAsync(courseId) ?? throw new NotFoundException();
            return await _courseRepository.GetCourseLessonsAsync(course);
        } 
    }
}
