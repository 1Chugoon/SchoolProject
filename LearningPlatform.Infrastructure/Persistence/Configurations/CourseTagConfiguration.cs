using LearningPlatform.Domain.Courses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace LearningPlatform.Infrastructure.Persistence.Configurations
{
    public class CourseTagConfiguration : IEntityTypeConfiguration<CourseTag>
    {
        public void Configure(EntityTypeBuilder<CourseTag> builder)
        {
            builder.HasKey(x => new { x.CourseId, x.TagId });
            builder
                .HasOne(ct => ct.Tag)
                .WithMany()
                .HasForeignKey(ct => ct.TagId);
        }
    }
}
