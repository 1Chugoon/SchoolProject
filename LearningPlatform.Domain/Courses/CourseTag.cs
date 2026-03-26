namespace LearningPlatform.Domain.Courses
{
    public class CourseTag
    {
        public Guid CourseId { get; private set; }
        public Guid TagId { get; private set; }

        public Tag Tag { get; private set; } = null!;

        private CourseTag() { }

        public CourseTag(Guid courseId, Guid tagId)
        {
            CourseId = courseId;
            TagId = tagId;
        }
    }
}
