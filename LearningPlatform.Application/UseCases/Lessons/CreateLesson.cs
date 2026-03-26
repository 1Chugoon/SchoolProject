using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Lessons
{
    public class CreateLesson(ILessonRepository repository, ICourseRepository repository1)
    {
        private readonly ILessonRepository _lessonRepository = repository;
        private readonly ICourseRepository _courseRepository = repository1;

        public async Task ExecuteAsync(Guid courseId, string title,Guid moduleId)
        {
            var course = await _courseRepository.GetByIdAsync(courseId) ?? throw new NotFoundException();
            var module = course.Modules.FirstOrDefault(m => m.Id == moduleId) ?? throw new NotFoundException();
            var lesson = module.AddLesson(
                new Guid(),
                title ?? ""
                );
            await _lessonRepository.AddAsync(lesson);
        }
    }
}
