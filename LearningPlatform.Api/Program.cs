using LearningPlatform.Api.Auth;
using LearningPlatform.Api.DTO.Preview;
using LearningPlatform.Api.DTO.Requests;
using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;
using LearningPlatform.Application.Services;
using LearningPlatform.Application.UseCases.Courses;
using LearningPlatform.Application.UseCases.Lessons;
using LearningPlatform.Application.UseCases.Modules;
using LearningPlatform.Application.UseCases.User;
using LearningPlatform.Domain.Users;
using LearningPlatform.Infrastructure.Email;
using LearningPlatform.Infrastructure.FileManager;
using LearningPlatform.Infrastructure.Hasher;
using LearningPlatform.Infrastructure.JWT;
using LearningPlatform.Infrastructure.Persistence;
using LearningPlatform.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Minio;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

static string GetContentType(string fileName)
{
    var ext = System.IO.Path.GetExtension(fileName).ToLowerInvariant();
    return ext switch
    {
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        ".webp" => "image/webp",
        _ => "application/octet-stream"
    };
}


var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var config = builder.Configuration;
var env = builder.Environment;

// --- Basic middleware / api tools
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

#region Json options
services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(opts =>
{
    opts.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    opts.SerializerOptions.PropertyNameCaseInsensitive = true;
    opts.SerializerOptions.PropertyNamingPolicy = null;
    opts.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
#endregion

// --- DbContext
services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default"),
        o => o.EnableRetryOnFailure()
    ));

#region Repositories / infra
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<ICourseRepository, CourseRepository>();
services.AddScoped<ILessonRepository, LessonRepository>();
services.AddScoped<ICoursePurchaseRepository, CoursePurchaseRepository>();
services.AddScoped<ITagRepository, TagRepository>();
services.AddScoped<IModuleRepository, ModuleRepository>();
services.AddScoped<IContentStorage, MinioContentStorage>();
services.AddScoped<IZipExtractor, ZipExtractor>();
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<ITokenService, TokenService>();
services.AddScoped<IEmailTokenRepository, EmailTokenRepository>();
services.AddScoped<IEmailSender, EmailSender>();




services.AddSingleton<IPasswordHasher, PasswordHasher>();
services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
#endregion

#region usecases and services
services.AddScoped<LoginUser>();
services.AddScoped<RegisterUser>();
services.AddScoped<CreateCourse>();
services.AddScoped<GetCourseById>();
services.AddScoped<PublishCourse>();
services.AddScoped<UpdateCourse>();
services.AddScoped<UpdateCourseTags>();
services.AddScoped<GetCourseLessons>();
services.AddScoped<CreateLesson>();
services.AddScoped<CreateModule>();
services.AddScoped<UploadLesson>();
services.AddScoped<GetLessonContent>();
services.AddScoped<DeleteModule>();
services.AddScoped<DeleteLesson>();
services.AddScoped<UpdateLesson>();
services.AddScoped<UpdateModule>();
services.AddScoped<ConfirmEmail>();
services.AddScoped<UpdateUser>();
services.AddScoped<UpdateUserSecurity>();

services.AddScoped<CoursePurchaseService>();
#endregion 

#region MinIO client registration configurable via appsettings
var minioEndpoint = config["Minio:Endpoint"] ?? "localhost:9000";
var minioAccessKey = config["Minio:AccessKey"] ?? "admin";
var minioSecretKey = config["Minio:SecretKey"] ?? "admin123";
var minioUseSsl = bool.TryParse(config["Minio:UseSsl"], out var sslVal) && sslVal;

services.AddSingleton<IMinioClient>(_ =>
    new MinioClient()
        .WithEndpoint(minioEndpoint)
        .WithCredentials(minioAccessKey, minioSecretKey)
        .WithSSL(minioUseSsl)
        .Build());
#endregion

#region CORS from configuration or sensible defaults
var frontendOrigin = config["Frontend:Origin"] ?? "http://localhost:3000";
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(frontendOrigin)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
#endregion

#region Authentication / JWT
var jwtKey = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured");
var jwtIssuer = config["Jwt:Issuer"] ?? config["Jwt:Audience"];
var jwtAudience = config["Jwt:Audience"] ?? config["Jwt:Issuer"];

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.TryGetValue("access_token", out var cookieToken) && !string.IsNullOrWhiteSpace(cookieToken))
                {
                    context.Token = cookieToken;
                    return Task.CompletedTask;
                }

                // fallback to Authorization header
                return Task.CompletedTask;
            }
        };
    });

services.AddAuthorization(options =>
{
    options.AddPolicy("AuthorOnly", policy =>
        policy.RequireRole(Role.Author.ToString(), Role.Admin.ToString()));

    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole(Role.Admin.ToString()));
});
#endregion

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// --- Global middleware

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();


app.UseSwagger();
app.UseSwaggerUI();


//app.UseHttpsRedirection();

#region Centralized exception -> status code mapping + ProblemDetails-like response
app.UseExceptionHandler(errApp =>
{
    errApp.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerPathFeature>();
        var ex = feature?.Error;
        context.Response.ContentType = MediaTypeNames.Application.Json;

        (int status, string title) = ex switch
        {
            CourseAlreadyPurchase _ => (StatusCodes.Status409Conflict, "Course already purchased"),
            ForbiddenException _ => (StatusCodes.Status403Forbidden, "Forbidden"),
            NotFoundException _ => (StatusCodes.Status404NotFound, "Not found"),
            EmailAlreadyExists _ => (StatusCodes.Status409Conflict, "Email already exists"),
            InvalidCredentials _ => (StatusCodes.Status401Unauthorized, "Invalid credentials"),
            BadRequestException _ => (StatusCodes.Status400BadRequest, "Bad request"),
            _ => (StatusCodes.Status500InternalServerError, "Server error")
        };

        context.Response.StatusCode = status;

        var payload = new
        {
            error = title,
            message = ex?.Message
        };

        await context.Response.WriteAsJsonAsync(payload);
    });
});
#endregion

#region Route groups for clarity
var authGroup = app.MapGroup("/auth").RequireCors("AllowFrontend");
var usersGroup = app.MapGroup("/users").RequireCors("AllowFrontend");
var coursesGroup = app.MapGroup("/courses").RequireCors("AllowFrontend");
var modulesGroup = app.MapGroup("/modules").RequireCors("AllowFrontend");
#endregion

#region Auth endpoints
authGroup.MapPost("/login", async (
    LoginRequest req,
    LoginUser useCase,
    HttpResponse response) =>
{
    var token = await useCase.ExecuteAsync(req.Email, req.Password);

    response.Cookies.Append("access_token", token, new CookieOptions
    {
        HttpOnly = true,
        Secure = false,
        SameSite = SameSiteMode.Strict
    });
    return Results.Ok(new { token });
});

authGroup.MapPost("/register", async (
    RegisterRequest req,
    RegisterUser useCase,
    CancellationToken ct) =>
{
    var id = await useCase.ExecuteAsync(req.Email, req.Password, req.Name,ct, frontendOrigin);
    return Results.Created();
});


authGroup.MapPost("/confirm-email",
    async (ConfirmEmailRequest request,
           ConfirmEmail handler,
           CancellationToken ct) =>
    {
        await handler.ExecuteAsync(request.UserId, request.Token, ct);
        return Results.Ok("Email confirmed");
    });
#endregion

#region User endpoints

#region Logout
usersGroup.MapPost("/logout", (HttpResponse response) =>
{
    response.Cookies.Delete("access_token",new CookieOptions
    {
        Path = "/"
    });
    return Results.Ok();
});
#endregion

#region Получение аватара юзера
usersGroup.MapGet("/{id:guid}/avatar", async (
    Guid id,
    IUserRepository users,
    IContentStorage storage,
    CancellationToken ct) =>
{
    var userEntity = await users.GetByIdAsync(id);
    if (userEntity == null || string.IsNullOrWhiteSpace(userEntity.AvatarFileName))
        return Results.NotFound();

    var path = $"users/{id}/{userEntity.AvatarFileName}";
    var stream = await storage.GetFileAsync(path, ct);
    if (stream == null) return Results.NotFound();

    return Results.Stream(stream, GetContentType(userEntity.AvatarFileName));
});
#endregion

#region Юзер получает себя 
app.MapGet("/me", [Authorize] async (
    ClaimsPrincipal user,
    IUserRepository users) =>
{
    var userId = user.GetUserId();
    var me = await users.GetByIdAsync(userId);
    if (me == null) return Results.NotFound();

    return Results.Ok(new
    {
        me.Id,
        me.Name,
        Role = me.Role.ToString()
    });
});
#endregion

#region Получение данных о юзере
usersGroup.MapGet("/{id:guid}", async (Guid id, IUserRepository users) =>
{
    var us = await users.GetByIdAsync(id);
    if (us == null) return Results.NotFound();

    return Results.Ok(new
    {
        us.Id,
        us.Name,
        Role = us.Role.ToString()
    });
});
#endregion

#region Получение курсов юзера
usersGroup.MapGet("/{id:guid}/courses", async (Guid id, ICoursePurchaseRepository purchases) =>
{
    var courses = await purchases.GetUserCoursesAsync(id);
    return Results.Ok(courses);
});
#endregion

#region Загрузка аватара юзера
usersGroup.MapPost("/{id:guid}/avatar", [Authorize] async (
    Guid id,
    IFormFile file,
    ClaimsPrincipal user,
    IUserRepository users,
    IContentStorage storage,
    CancellationToken ct) =>
{
    if (file == null || file.Length == 0)
        return Results.BadRequest("File is required");

    var httpUserId = user.GetUserId();

    // only owner or admin
    if (httpUserId != id && !user.IsInRole(Role.Admin.ToString()))
        return Results.Forbid();

    var userEntity = await users.GetByIdAsync(id);
    if (userEntity == null) return Results.NotFound();

    var ext = System.IO.Path.GetExtension(file.FileName);
    var fileName = $"avatar{ext}";
    var key = $"users/{id}/{fileName}";
    var contentType = file.ContentType ?? GetContentType(fileName);

    await using var stream = file.OpenReadStream();
    await storage.SaveFileAsync(key, stream, contentType, ct);

    userEntity.SetAvatar(fileName);
    await users.SaveAsync(userEntity);

    var url = $"/users/{id}/avatar";
    return Results.Created(url, new { url });
}).DisableAntiforgery();
#endregion

#region Получение курсов по автору 
usersGroup.MapGet("/{id:guid}/created-courses", async (
    Guid id,
    ICourseRepository courses) =>
{
    var coursesList = await courses.GetCoursesByAuthor(id);
    var result = coursesList.Select(c => new CourseForAuthorPreviewDto(
        c.Id,
        c.Title,
        c.Rating,
        c.Price,
        c.Status
    ));

    return Results.Ok(result);
});
#endregion

#region
usersGroup.MapPut("/{id:guid}", [Authorize] async (
    Guid id,
    UpdateUserDto dto,
    ClaimsPrincipal user,
    UpdateUser usecase) =>
{
    var httpUserId = user.GetUserId();
    if (httpUserId != id && !user.IsInRole(Role.Admin.ToString()))
        return Results.Forbid();

    await usecase.ExecuteAsync(id, dto.Name, dto.Description);
    return Results.Ok();
});
#endregion

#region
usersGroup.MapPut("/{id:guid}/security", [Authorize] async (
    Guid id,
    UpdateSecurityRequest req,
    ClaimsPrincipal user,
    UpdateUserSecurity usecase) =>
{
    var httpUserId = user.GetUserId();
    if (httpUserId != id && !user.IsInRole(Role.Admin.ToString()))
        return Results.Forbid();
    await usecase.ExecuteAsync(id, req.OldPassword, req.NewPassword, null);
    return Results.Ok();
});
#endregion

#endregion

#region Course endpoints

#region создание курса
coursesGroup.MapPost("/", [Authorize(Policy = "AuthorOnly")] async (
    CreateCourseRequest req,
    ClaimsPrincipal user,
    CreateCourse useCase) =>
{
    var authorId = user.GetUserId();
    var id = await useCase.ExecuteAsync(req.Title, req.Price, authorId);
    return Results.Created($"/courses/{id}", new { id });
});
#endregion

#region Получение всех курсов
coursesGroup.MapGet("/", async (
    ClaimsPrincipal user,
    ICourseRepository courses) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    var list = await courses.GetVisibleAsync(userId);

    var result = list.Select(c => new CoursePreviewDto(
        c.Id,
        c.Title,
        c.Rating,
        c.Price,
        new AuthorDto(c.AuthorId, c.Author.Name)
    ));

    return Results.Ok(result);
});
#endregion

#region Получение курса по Id
coursesGroup.MapGet("/{id:guid}", async (
    Guid id,
    ClaimsPrincipal user,
    GetCourseById useCase) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    var course = await useCase.ExecuteAsync(id, userId);
    if (course == null) return Results.NotFound();

    var dto = new CourseDetailsDto(
        course.Id,
        course.Title,
        course.Description ?? "",
        course.Rating,
        course.Price,
        new AuthorDto(course.AuthorId, course.Author.Name),
        course.CourseTags.Select(t => t.Tag.Name).ToList(),
        course.Modules.ToList(),
        course.WhatLearn.ToArray()
    );

    return Results.Ok(dto);
});
#endregion

#region Публикация курса
coursesGroup.MapPost("/{id:guid}/publish", [Authorize(Policy = "AuthorOnly")] async (
    Guid id,
    ClaimsPrincipal user,
    PublishCourse useCase) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    await useCase.ExecuteAsync(id, userId);
    return Results.Ok();
});
#endregion

#region Изменение курса
coursesGroup.MapPut("/{courseId:guid}", [Authorize(Policy = "AuthorOnly")] async (
    Guid courseId,
    ClaimsPrincipal user,
    UpdateCourseDto dto,
    UpdateCourse useCase) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    await useCase.ExecuteAsync(userId, courseId, dto.Title, dto.Description, dto.Price, dto.WhatLearn);
    return Results.Ok();
});
#endregion

#region Покупка курса
coursesGroup.MapPost("/{courseId:guid}/purchase", [Authorize] async (
    ClaimsPrincipal user,
    CoursePurchaseService service,
    Guid courseId) =>
{
    var userId = user.GetUserId();
    await service.PurchaseAsync(userId, courseId);
    return Results.Ok();
});
#endregion

#region Изменение тегов курса
coursesGroup.MapPut("/{courseId:guid}/tags", [Authorize(Policy = "AuthorOnly")] async (
    Guid courseId,
    UpdateCourseTagsDto dto,
    ClaimsPrincipal user,
    UpdateCourseTags useCase) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    await useCase.ExecuteAsync(userId, courseId, dto.TagId);
    return Results.Ok();
});
#endregion 

#region Удаление модуля 
coursesGroup.MapDelete("/modules/{moduleId:guid}", [Authorize(Policy = "AuthorOnly")] async (
    Guid moduleId,
    DeleteModule useCase,
    ClaimsPrincipal user) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    await useCase.ExecuteAsync(moduleId, userId);
    return Results.Ok();
});
#endregion

#region Обновление модуля
coursesGroup.MapPut("/modules/{moduleId:guid}", [Authorize(Policy = "AuthorOnly")] async (
    Guid moduleId,
    UpdateModule useCase,
    UpdateModuleDto dto, 
    ClaimsPrincipal user) =>
    {
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    await useCase.ExecuteAsync(moduleId, userId, dto.Title, dto.Order);
    return Results.Ok();
});
#endregion

#region Создание модулей курса
coursesGroup.MapPost("/{courseId:guid}/modules", [Authorize(Policy = "AuthorOnly")] async (
    Guid courseId,
    CreateModule usecase,
    CreateModuleRequest req) =>
{
    var title = string.IsNullOrWhiteSpace(req.Title) ? " " : req.Title;
    await usecase.ExecuteAsync(courseId, req.Title);
    return Results.Ok();
});
#endregion

# region Удаление урока
coursesGroup.MapDelete("/modules/{moduleId:guid}/lessons/{lessonId:guid}", [Authorize(Policy = "AuthorOnly")] async (
    Guid moduleId,
    Guid lessonId,
    DeleteLesson useCase,
    ClaimsPrincipal user) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    await useCase.ExecuteAsync(moduleId, lessonId, userId);
    return Results.Ok();
});
#endregion 

#region Создание уроков 
coursesGroup.MapPost("/{courseId:guid}/lessons", [Authorize(Policy = "AuthorOnly")] async (
    Guid courseId,
    CreateLesson useCase,
    CreateLessonDto dto) =>
{
    await useCase.ExecuteAsync(courseId, dto.Title, dto.ModuleId);
    return Results.Ok();
});
#endregion

#region Обновление уроков
coursesGroup.MapPut("/modules/{moduleId:guid}/lessons/{lessonId:guid}", [Authorize(Policy = "AuthorOnly")] async (
    Guid moduleId,
    Guid lessonId,
    UpdateLessonDto dto,
    UpdateLesson useCase,
    ClaimsPrincipal user) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;
    await useCase.ExecuteAsync( moduleId, lessonId, userId, dto.Title,dto.Order);
    return Results.Ok();
});

#endregion

#region Получение уроков
coursesGroup.MapGet("/{courseId:guid}/lessons", async (
    Guid courseId,
    GetCourseLessons useCase) =>
{
    var req = await useCase.ExecuteAsync(courseId);
    return Results.Ok(req);
});
#endregion

#region Endpoint: получить курс по id модуля
// GET /modules/{moduleId}/course
modulesGroup.MapGet("/{moduleId:guid}/course", async (
    Guid moduleId,
    ClaimsPrincipal user,
    ICourseRepository courses) =>
{
    Guid? userId = user.Identity?.IsAuthenticated == true ? user.GetUserId() : null;


    var course = await courses.GetbyGetByModuleIdAsync(moduleId, userId);
    if (course == null) return Results.NotFound();

    var dto = new CourseDetailsDto(
        course.Id,
        course.Title,
        course.Description ?? "",
        course.Rating,
        course.Price,
        new AuthorDto(course.AuthorId, course.Author.Name),
        course.CourseTags.Select(t => t.Tag.Name).ToList(),
        course.Modules.ToList(),
        course.WhatLearn.ToArray()
    );

    return Results.Ok(dto);
});
#endregion

#region Endpoint: получить изображение курса
coursesGroup.MapGet("/{id:guid}/image", async (
    Guid id,
    ICourseRepository courses,
    IContentStorage storage,
    CancellationToken ct) =>
{
    var course = await courses.GetByIdAsync(id);
    if (course == null || string.IsNullOrWhiteSpace(course.ImagePath))
        return Results.NotFound();

    var path = $"courses/{id}/{course.ImagePath}";
    var stream = await storage.GetFileAsync(path, ct);
    if (stream == null) return Results.NotFound();

    return Results.Stream(stream, GetContentType(course.ImagePath));
});
#endregion

#region Загрузка изображения курса
coursesGroup.MapPost("/{id:guid}/image", [Authorize(Policy = "AuthorOnly")] async (
    Guid id,
    IFormFile file,
    ClaimsPrincipal user,
    ICourseRepository courses,
    IContentStorage storage,
    CancellationToken ct) =>
{
    if (file == null || file.Length == 0)
        return Results.BadRequest("File is required");

    var httpUserId = user.GetUserId();

    var course = await courses.GetByIdAsync(id);
    if (course == null) return Results.NotFound();

    // Дополнительная защита: только автор курса или админ
    if (course.AuthorId != httpUserId && !user.IsInRole(Role.Admin.ToString()))
        return Results.Forbid();

    var ext = System.IO.Path.GetExtension(file.FileName);
    var fileName = $"{Guid.NewGuid()}{ext}";
    var key = $"courses/{id}/{fileName}";
    var contentType = file.ContentType ?? GetContentType(fileName);

    await using var stream = file.OpenReadStream();
    await storage.SaveFileAsync(key, stream, contentType, ct);

    course.UpdateImage(fileName);
    await courses.SaveAsync(course);

    var url = $"/courses/{id}/image";
    return Results.Created(url, new { url });
}).DisableAntiforgery();
#endregion

#endregion

#region Lesson / Module file endpoints
app.MapPut("/modules/{moduleId:guid}/lessons/{lessonId:guid}/upload", [Authorize] async (
    Guid moduleId,
    Guid lessonId,
    IFormFile? file,
    CancellationToken ct,
    UploadLesson usecase) =>
{
    if (file == null || file.Length == 0) return Results.BadRequest("File is required");

    await using var stream = file.OpenReadStream();
    await usecase.ExecuteAsync(lessonId, moduleId, stream, ct);

    return Results.Ok();
})
.DisableAntiforgery();

app.MapGet("/modules/{moduleId:guid}/lessons/{lessonId:guid}/content", async (
    Guid moduleId,
    Guid lessonId,
    GetLessonContent useCase,
    CancellationToken ct) =>
{
    var result = await useCase.ExecuteAsync(lessonId, moduleId, ct);
    if (result == null) return Results.NotFound();

    return Results.Stream(result.Content, result.ContentType);
})
.DisableAntiforgery();

app.MapGet("/modules/{moduleId:guid}/lessons/{lessonId:guid}/files/{**path}", async (
    Guid lessonId,
    string path,
    IContentStorage storage,
    CancellationToken ct) =>
{
    if (string.IsNullOrEmpty(path)) return Results.BadRequest();

    var stream = await storage.GetFileAsync($"lessons/{lessonId}/{path}", ct);
    if (stream == null) return Results.NotFound();

    return Results.Stream(stream);
})
.DisableAntiforgery();
#endregion


// --- Run
app.Run();