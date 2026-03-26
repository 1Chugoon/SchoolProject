using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;
using LearningPlatform.Domain.Courses;


namespace LearningPlatform.Application.UseCases.Courses
{
    public class GetCourseById(ICourseRepository repository)
    {
        private readonly ICourseRepository _repository = repository;
        public async Task<Course> ExecuteAsync(Guid courseId, Guid? userId)
        {
            var course = await _repository.GetByIdAsync(courseId)
                ?? throw new NotFoundException();

            if (course.Status == CourseStatus.Draft &&
                course.AuthorId != userId)
                throw new ForbiddenException();

            return course;
        }
    }
}
