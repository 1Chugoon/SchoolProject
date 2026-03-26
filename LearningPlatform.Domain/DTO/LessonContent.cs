
namespace LearningPlatform.Domain.DTO
{
    public sealed class LessonContent
    {
        public string Markdown { get; init; } = null!;

        public IReadOnlyCollection<FileEntry> Images { get; init; } = [];
    }
}
