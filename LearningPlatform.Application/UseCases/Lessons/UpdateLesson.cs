
using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Lessons
{
    public class UpdateLesson
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IModuleRepository _repository;
        public UpdateLesson(IModuleRepository repo, ILessonRepository lessonRepository)
        {
            _repository = repo;
            _lessonRepository = lessonRepository;
        }

        public async Task ExecuteAsync(Guid moduleId, Guid lessonId, Guid? authorId, string title, int? newPosition)
        {
            var lesson = await _lessonRepository.GetByIdAsync(lessonId) ?? throw new NotFoundException();
            var module = await _repository.GetByIdAsync(lesson.ModuleId) ?? throw new NotFoundException();

            if (lesson.Module.Course.AuthorId != authorId) throw new ForbiddenException();
            if (lesson.ModuleId != moduleId) throw new NotFoundException();
            try
            {

                lesson.UpdateTitle(title);

                if (newPosition.HasValue) module.MoveLesson(lessonId, newPosition.Value);

                await _repository.SaveChangesAsync();
            }
            catch (ArgumentOutOfRangeException)
            {
                throw new BadRequestException("Invalid position");

            }
        }
    }
}
