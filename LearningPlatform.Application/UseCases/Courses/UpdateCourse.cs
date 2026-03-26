
using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Courses
{
    public class UpdateCourse(ICourseRepository repository)
    {
        private readonly ICourseRepository _repository = repository;

        public async Task ExecuteAsync(Guid? userId,Guid courseId,string title,string description, decimal price, IEnumerable<string> whatLearn)
        {
            var course = await _repository.GetByIdAsync(courseId) ?? throw new NotFoundException();

            if (course?.AuthorId != userId || course == null)
                throw new ForbiddenException();

            course.Update(title,description,price,whatLearn);

            await _repository.SaveAsync(course);
        }
    }
}
