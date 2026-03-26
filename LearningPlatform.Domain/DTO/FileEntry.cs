

namespace LearningPlatform.Domain.DTO
{
    public sealed class FileEntry
    {
        public string Name { get; init; } = null!;
        public Stream Stream { get; init; } = null!;
    }
}
