using LearningPlatform.Domain.Courses;
using LearningPlatform.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Course> Courses => Set<Course>();
        public DbSet<Lesson> Lessons => Set<Lesson>();
        public DbSet<CoursePurchase> CoursePurchases => Set<CoursePurchase>();
        public DbSet<CourseRating> CourseRatings => Set<CourseRating>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<CourseTag> CourseTags => Set<CourseTag>();
        public DbSet<CourseTopic> CourseTopics => Set<CourseTopic>();
        public DbSet<Module> Modules => Set<Module>();
        public DbSet<EmailConfirmationToken> EmailConfirmationTokens => Set<EmailConfirmationToken>();

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly);

            modelBuilder.Entity<User>().HasData(
                new User(
                    Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    "admin",
                    "$2a$11$GVR3HXd0RiRD1ZuO7bGL2uJjqfstadMz4IXkp2qx1xrgHJ016QvJG",
                    "Admin",
                    Role.Author,
                    true
                    ));
        }
    }
}
