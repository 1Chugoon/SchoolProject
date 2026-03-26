using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Courses
{
    public class PublishCourse(ICourseRepository repository)
    {
        private readonly ICourseRepository _repository = repository;

        public async Task ExecuteAsync(Guid courseId, Guid? userId)
        {
            var course = await _repository.GetByIdAsync(courseId);

            if (course?.AuthorId != userId || course == null)
                throw new ForbiddenException();

            course.Publish();
            await _repository.SaveAsync(course);
        }
    }
}
