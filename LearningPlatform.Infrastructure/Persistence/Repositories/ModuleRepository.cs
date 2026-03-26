using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Courses;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Infrastructure.Persistence.Repositories
{
    public class ModuleRepository(AppDbContext db) : IModuleRepository
    {
        private readonly AppDbContext _db = db;

        public async Task AddAsync(Module module)
        {
            await _db.Modules.AddAsync(module);
            await _db.SaveChangesAsync();
        }

        public Task DeleteAsync(Module module)
        {
            _db.Modules.Remove(module);
            return Task.CompletedTask;
        }
        public Task SaveChangesAsync()
        {
            return _db.SaveChangesAsync();
        }
        public Task<Module?> GetByIdAsync(Guid moduleId)
        {
            return _db.Modules
                .Include(m => m.Course)
                .Include(m => m.Lessons)
                .FirstOrDefaultAsync(m => m.Id == moduleId);
        }
    }
}
