
using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Lessons
{
    public class UploadLesson(
        ILessonRepository lessonRepository,
        IContentStorage contentStorage,
        IZipExtractor zip)
    {
        private readonly ILessonRepository _lessonRepository = lessonRepository;
        private readonly IContentStorage _contentStorage = contentStorage;
        private readonly IZipExtractor _zipExtractor = zip;


        public async Task ExecuteAsync(
            Guid lessonId, 
            Guid moduleId, 
            Stream zipStream,
            CancellationToken ct)
        {
            var lesson = await _lessonRepository.GetByIdAsync(lessonId,moduleId,ct)
                     ?? throw new NotFoundException("Lesson not found");

            var content = await _zipExtractor.ExtractAsync(zipStream, ct);

            var folder = $"lessons/{lessonId}";
            await _contentStorage.SaveAsync(folder, content, ct);

            lesson.AttachMaterials(folder);

            await _lessonRepository.SaveChangesAsync(ct);
        }
    }
}
