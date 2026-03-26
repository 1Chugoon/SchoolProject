

using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.Courses
{
    public class UpdateCourseTags(ICourseRepository repository, ITagRepository repository1)
    {
        private readonly ICourseRepository _courseRepository = repository;
        private readonly ITagRepository _tagRepository = repository1;

        public async Task ExecuteAsync(Guid? userId, Guid courseId, Guid tagId)
        {
            var course = await _courseRepository.GetByIdWithTagsAsync(courseId) ?? throw new NotFoundException();

            if (course?.AuthorId != userId || course == null)
                throw new ForbiddenException();

            if (await _tagRepository.GetByIdAsync(tagId) != null)
            {
                course.AddTag(tagId);
                await _courseRepository.SaveAsync(course);
            }
            else
            {
                throw new NotFoundException();
            }

        } 
    }
}
