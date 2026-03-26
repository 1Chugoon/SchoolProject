using LearningPlatform.Domain.Courses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningPlatform.Infrastructure.Persistence.Configurations
{
    public class CoursePurchaseConfiguration : IEntityTypeConfiguration<CoursePurchase>
    {
        public void Configure(EntityTypeBuilder<CoursePurchase> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasIndex(x => new { x.UserId, x.CourseId })
                .IsUnique();
        }
    }
}
