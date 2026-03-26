using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Courses;
using LearningPlatform.Domain.DTO;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace LearningPlatform.Infrastructure.Persistence.Repositories
{
    public class CourseRepository(AppDbContext db) : ICourseRepository
    {
        private readonly AppDbContext _db = db;

        public Task<Course?> GetByIdAsync(Guid id)
        {
            return _db.Courses
                .Include(x => x.Author)
                .Include(x => x.Modules)
                    .ThenInclude(x => x.Lessons)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddAsync(Course course)
        {
            await _db.Courses.AddAsync(course);
            await _db.SaveChangesAsync();
        }
        public async Task SaveAsync(Course course)
        {
            _db.Courses.Update(course);
            await _db.SaveChangesAsync();
        }

        public async Task<IReadOnlyList<Course>> GetVisibleAsync(Guid? userId)
        {
            var query = _db.Courses
                .Include(c => c.Author)
                .Include(c => c.CourseTags)
                    .ThenInclude(ct => ct.Tag)
                .AsQueryable();

            query = query.Where(c =>
                c.Status == CourseStatus.Published ||
                (userId != null && c.AuthorId == userId));

            return await query
                .AsNoTracking()
                .ToListAsync();
        }

        public Task<Course?> GetByIdWithTagsAsync(Guid Id)
        {
            return _db.Courses
            .Include(c => c.CourseTags)
            .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<IReadOnlyList<LessonDto>> GetCourseLessonsAsync(Course course)
        {
            return course.Modules
               .SelectMany(m => m.Lessons)
               .OrderBy(l => l.Order)
               .Select(l => new LessonDto(l.Id, l.Title, l.Order))
               .ToList();
        }

        public Task<Course?> GetByIdWithLessonsAsync(Guid Id)
        {
            return _db.Courses
            .Include(c => c.Modules)
            .ThenInclude(m => m.Lessons)
            .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Course?> GetbyGetByModuleIdAsync(Guid moduleId, Guid? userId)
        {
            var query = _db.Courses
         .Include(c => c.Author)
         .Include(c => c.CourseTags).ThenInclude(ct => ct.Tag)
         .Include(c => c.Modules).ThenInclude(m => m.Lessons)
         .AsQueryable();

            query = query.Where(c =>
                c.Status == CourseStatus.Published ||
                (userId != null && c.AuthorId == userId));

            return await query.FirstOrDefaultAsync(c => c.Modules.Any(m => m.Id == moduleId));
        }

        public async Task<IReadOnlyList<Course>> GetCoursesByAuthor(Guid userId)
        {
            return await _db.Courses
                .Include(c => c.Author)
                .Where(c => c.AuthorId == userId)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
