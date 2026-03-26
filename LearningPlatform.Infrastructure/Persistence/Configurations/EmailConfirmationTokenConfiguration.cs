using LearningPlatform.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearningPlatform.Infrastructure.Persistence.Configurations
{
    public class EmailConfirmationTokenConfiguration
        : IEntityTypeConfiguration<EmailConfirmationToken>
    {
        public void Configure(EntityTypeBuilder<EmailConfirmationToken> builder)
        {
            builder.ToTable("EmailConfirmationTokens");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.TokenHash)
                .IsRequired()
                .HasMaxLength(512);

            builder.Property(x => x.ExpiresAtUtc)
                .IsRequired();

            builder.Property(x => x.Used)
                .IsRequired();

            builder.HasIndex(x => new { x.UserId, x.TokenHash })
                .IsUnique();

            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
