using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Modules
{
    public class DeleteModule(IModuleRepository repository)
    {
        private readonly IModuleRepository _repository = repository;
        public async Task ExecuteAsync(Guid moduleId, Guid? userId)
        {
            
            var module = await _repository.GetByIdAsync(moduleId) ?? throw new NotFoundException();

            if (module.Course.AuthorId != userId){
                throw new ForbiddenException();
            }

            await _repository.DeleteAsync(module);
            await _repository.SaveChangesAsync();
        }
    }
}
