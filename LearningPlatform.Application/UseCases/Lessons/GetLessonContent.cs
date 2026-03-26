using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;
using LearningPlatform.Domain.DTO;

namespace LearningPlatform.Application.UseCases.Lessons
{
    public class GetLessonContent(
        ILessonRepository lessonRepository,
        IContentStorage storage)
    {
        private readonly ILessonRepository _lessonRepository = lessonRepository;
        private readonly IContentStorage _storage = storage;

        public async Task<LessonMarkdownResult> ExecuteAsync(Guid lessonId, Guid moduleId,CancellationToken ct)
        {
            var lesson = await _lessonRepository
                .GetByIdAsync(lessonId, moduleId, ct)
                ?? throw new NotFoundException("Lesson not found");

            if (!lesson.HasMaterials)
                throw new NotFoundException("Lesson has no materials");

            var stream = await _storage.GetFileAsync(
                lesson.MarkdownPath!,
                ct);

            return new LessonMarkdownResult
            {
                Content = stream
            };
        }
    }
}
