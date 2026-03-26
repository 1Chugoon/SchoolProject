using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Api.DTO.Preview
{
    public record CourseDetailsDto(
    Guid Id,
    string Title,
    string Description,
    float Rating,
    decimal Price,
    AuthorDto Author,
    IReadOnlyList<string> Tags,
    IReadOnlyList<Module> Modules,
    IReadOnlyList<string> WhatLearn
);
}
