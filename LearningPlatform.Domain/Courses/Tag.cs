namespace LearningPlatform.Domain.Courses
{
    public class Tag
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = null!;

        private Tag() { }

        public Tag(Guid id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
