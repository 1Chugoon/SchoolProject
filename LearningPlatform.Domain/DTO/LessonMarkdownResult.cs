
namespace LearningPlatform.Domain.DTO
{
    public sealed class LessonMarkdownResult
    {
        public Stream Content { get; init; } = null!;
        public string ContentType { get; init; } = "text/markdown";
    }
}
