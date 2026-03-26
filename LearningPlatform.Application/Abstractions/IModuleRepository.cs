using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Application.Abstractions
{
    public interface IModuleRepository
    {
        Task AddAsync(Module module);
        Task DeleteAsync(Module module);
        Task<Module?> GetByIdAsync(Guid moduleId);
        Task SaveChangesAsync();
    }
}
