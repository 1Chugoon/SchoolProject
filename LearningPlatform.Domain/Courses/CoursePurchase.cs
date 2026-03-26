using LearningPlatform.Domain.Users;
using System.Text.Json.Serialization;

namespace LearningPlatform.Domain.Courses
{
    public class CoursePurchase
    {
        public Guid Id { get; private set; }

        public Guid UserId { get; private set; }
        public Guid CourseId { get; private set; }

        [JsonIgnore]
        public Course Course { get; private set; } = null!;
        [JsonIgnore]
        public User User { get; private set; } = null!;

        public DateTime PurchasedAt { get; private set; }

        private CoursePurchase() { }

        public CoursePurchase(Guid id, Guid userId, Guid courseId)
        {
            Id = id;
            UserId = userId;
            CourseId = courseId;
            PurchasedAt = DateTime.UtcNow;
        }
    }
}
