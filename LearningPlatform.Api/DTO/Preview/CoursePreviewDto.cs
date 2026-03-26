namespace LearningPlatform.Api.DTO.Preview
{
    public record CoursePreviewDto(
     Guid Id,
     string Title,
     float Rating,
     decimal Price,
     AuthorDto Author
 );
}
