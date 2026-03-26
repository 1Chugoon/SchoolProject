

using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Lessons
{
    public class DeleteLesson
    {
        private readonly ILessonRepository _repository;
        public DeleteLesson(ILessonRepository repository)
        {
            _repository = repository;
        }

        public async Task ExecuteAsync(Guid moduleId, Guid lessonId, Guid? userId)
        {
            var lesson = await _repository.GetByIdAsync(lessonId) ?? throw new NotFoundException();

            if (lesson.Module.Course.AuthorId != userId) throw new ForbiddenException();
            if (lesson.ModuleId != moduleId) throw new NotFoundException();

            await _repository.DeleteAsync(lesson);
            await _repository.SaveChangesAsync();
        }
    }
}
