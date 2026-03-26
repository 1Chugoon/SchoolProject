using LearningPlatform.Domain.Courses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningPlatform.Infrastructure.Persistence.Configurations
{
    public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
    {
        public void Configure(EntityTypeBuilder<Lesson> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.Order)
                .IsRequired();

            builder.HasIndex(l => new { l.ModuleId, l.Order })
            .IsUnique();

            builder.Property(x => x.CreatedAt)
            .IsRequired();

            builder.Property(x => x.StorageFolder)
            .HasMaxLength(500)
            .IsRequired(false);

            builder.Property(x => x.MarkdownPath)
                .HasMaxLength(500)
                .IsRequired(false);

            builder.Property(x => x.ImagesPath)
                .HasMaxLength(500)
                .IsRequired(false);

            builder.Ignore(x => x.HasMaterials);
        }
    }
}
