using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;


namespace LearningPlatform.Application.UseCases.Modules
{
    public class CreateModule(ICourseRepository repository, IModuleRepository repository1)
    {
        private readonly ICourseRepository _courseRepository = repository;
        private readonly IModuleRepository _moduleRepository = repository1;
        public async Task ExecuteAsync(Guid courseId, string title)
        {
            var course = await _courseRepository.GetByIdAsync(courseId) ?? throw new NotFoundException();
            
            var module = course.AddModule(
                new Guid(),
                title ?? ""
                );
            await _moduleRepository.AddAsync(module);
        }
    }
}
