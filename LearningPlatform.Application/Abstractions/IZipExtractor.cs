using LearningPlatform.Domain.DTO;

namespace LearningPlatform.Application.Abstractions
{
    public interface IZipExtractor
    {
        Task<LessonContent> ExtractAsync(Stream zipStream, CancellationToken ct);
    }
}