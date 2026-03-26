using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Application.UseCases.Courses
{
    public class CreateCourse(ICourseRepository courses)
    {
        private readonly ICourseRepository _courses = courses;

        public async Task<Guid> ExecuteAsync(
            string title,
            decimal price,
            Guid authorId)
        {
            var course = new Course(
                Guid.NewGuid(),
                title,
                price,
                authorId);

            await _courses.AddAsync(course);
            return course.Id;
        }
    }
}
