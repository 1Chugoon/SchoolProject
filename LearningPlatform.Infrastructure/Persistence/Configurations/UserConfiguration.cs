using LearningPlatform.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningPlatform.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Role)
                .HasConversion<int>();

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder
                .Property<string?>("_avatarFileName")
                .HasColumnName("AvatarFileName")
                .HasMaxLength(300)
                .IsRequired(false);

            builder.Property(x => x.EmailConfirmed)
            .IsRequired();
        }
    }
}
