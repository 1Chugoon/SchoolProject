namespace LearningPlatform.Domain.Courses
{
    public class CourseTopic
    {
        public Guid Id { get; private set; }

        public Guid CourseId { get; private set; }
        public string Name { get; private set; } = null!;

        private CourseTopic() { }

        public CourseTopic(Guid id, Guid courseId, string name)
        {
            Id = id;
            CourseId = courseId;
            Name = name;
        }
    }
}
