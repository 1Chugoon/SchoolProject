using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Courses;
using LearningPlatform.Domain.DTO;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Infrastructure.Persistence.Repositories
{
    public class CoursePurchaseRepository(AppDbContext db) : ICoursePurchaseRepository
    {
        private readonly AppDbContext _db = db;

        public Task<bool> HasAccessAsync(Guid userId, Guid courseId)
        {
            return _db.CoursePurchases
                .AnyAsync(x => x.UserId == userId && x.CourseId == courseId);
        }

        public async Task AddAsync(CoursePurchase purchase)
        {
            await _db.CoursePurchases.AddAsync(purchase);
            await _db.SaveChangesAsync();
        }

        public async Task<IReadOnlyCollection<UserCourseDto>> GetUserCoursesAsync(Guid userId)
        {
            return await _db.CoursePurchases
                .Where(p => p.UserId == userId)
                .Select(p => new UserCourseDto
                (
                    p.Course.Id,
                    p.Course.Title,
                    p.PurchasedAt
                ))
                .ToListAsync();
             
        }
    }
}
