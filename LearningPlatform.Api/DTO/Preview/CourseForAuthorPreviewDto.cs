using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Api.DTO.Preview
{
    public record CourseForAuthorPreviewDto(
     Guid Id,
     string Title,
     float Rating,
     decimal Price,
     CourseStatus Status
 );
}
