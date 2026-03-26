using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;
using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Application.UseCases.Modules
{
    public class UpdateModule
    {
        private readonly  ICourseRepository _repository;
        private readonly IModuleRepository _moduleRepository;
        public UpdateModule(ICourseRepository repo, IModuleRepository moduleRepository)
        {
            _repository = repo;
            _moduleRepository = moduleRepository;
        }
        public async Task ExecuteAsync(Guid moduleId, Guid? authorId, string title, int? newPosition)
        {
            var module = await _moduleRepository.GetByIdAsync(moduleId) ?? throw new NotFoundException();

            var course = await _repository.GetByIdAsync(module.CourseId) ?? throw new NotFoundException();

            if (module.Course.AuthorId != authorId) throw new ForbiddenException();
            try 
            {
                module.UpdateTitle(title);

                if (newPosition.HasValue) course.MoveModule(moduleId, newPosition.Value);

                await _repository.SaveAsync(course);
            }
            catch (ArgumentOutOfRangeException)
            {
                throw new BadRequestException("Invalid position");
            }
            
        }
    }
}
