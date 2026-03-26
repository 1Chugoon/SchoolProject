using System.Text.Json.Serialization;

namespace LearningPlatform.Domain.Courses
{
    public class Lesson
    {
        public Guid Id { get; private set; }

        public Guid ModuleId { get; private set; }
        [JsonIgnore]
        public Module Module { get; private set; } = null!;

        public string Title { get; private set; } = null!;
        public int Order { get; private set; }

        public string? StorageFolder { get; private set; }

        public string? MarkdownPath { get; private set; }
        public string? ImagesPath { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public bool HasMaterials => StorageFolder != null;

        private Lesson() { }

        internal Lesson(Guid id, Guid moduleId, string title, int order)
        {
            Id = id;
            ModuleId = moduleId;
            Title = title;
            Order = order;
            CreatedAt = DateTime.UtcNow;
        }
        public void AttachMaterials(string folder)
        {
            if (HasMaterials)
                throw new InvalidOperationException("Materials already attached");

            StorageFolder = folder;
            MarkdownPath = $"{folder}/lesson.md";
            ImagesPath = $"{folder}/images";
        }
        public void UpdateTitle(string title)
        {
            Title = title;
        }
        internal void SetOrder(int order)
        {
            Order = order;
        }
    }
}
