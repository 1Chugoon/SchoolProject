
using LearningPlatform.Domain.DTO;

namespace LearningPlatform.Application.Abstractions
{
    public interface IContentStorage
    {
        /*Task<string> SaveLessonAsync(
            Guid courseId,
            Guid lessonId,
            Stream markdown,
            Stream zipImages
    );*/

        //Task<Stream> GetMarkdownAsync(string path);

        Task SaveAsync(string folder, LessonContent content, CancellationToken ct);

        Task<Stream> GetFileAsync(string path, CancellationToken ct);

        Task SaveFileAsync(string key, Stream stream, string contentType, CancellationToken ct);
    }
}
