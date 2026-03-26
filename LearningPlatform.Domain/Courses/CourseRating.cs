namespace LearningPlatform.Domain.Courses
{
    public class CourseRating
    {
        public Guid Id { get; private set; }

        public Guid CourseId { get; private set; }
        public Guid UserId { get; private set; }

        public int Value { get; private set; }

        private CourseRating() { }

        public CourseRating(Guid id, Guid courseId, Guid userId, int value)
        {
            if (value < 1 || value > 5)
                throw new ArgumentOutOfRangeException(nameof(value));

            Id = id;
            CourseId = courseId;
            UserId = userId;
            Value = value;
        }
    }
}
