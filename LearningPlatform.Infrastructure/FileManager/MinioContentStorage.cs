using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.DTO;
using Minio;
using Minio.DataModel.Args;
using System.IO;
using System.Text;


namespace LearningPlatform.Infrastructure.FileManager
{
    public sealed class MinioContentStorage(IMinioClient client) : IContentStorage
    {
        private readonly IMinioClient _client = client;
        private readonly string _bucket = "files";

        public async Task SaveAsync(
            string folder,
            LessonContent content,
            CancellationToken ct)
        {
            // ===== Markdown =====
            var mdBytes = Encoding.UTF8.GetBytes(content.Markdown);

            await PutAsync(
                $"{folder}/lesson.md",
                new MemoryStream(mdBytes),
                "text/markdown",
                ct);

            // ===== Images =====
            foreach (var img in content.Images)
            {
                var contentType = GetContentType(img.Name);

                await PutAsync(
                    $"{folder}/images/{img.Name}",
                    img.Stream,
                    contentType,
                    ct);
            }
        }

        private async Task PutAsync(
            string key,
            Stream stream,
            string contentType,
            CancellationToken ct)
        {
            stream.Position = 0;

            await _client.PutObjectAsync(
                new PutObjectArgs()
                    .WithBucket(_bucket)
                    .WithObject(key)
                    .WithStreamData(stream)
                    .WithObjectSize(stream.Length)
                    .WithContentType(contentType),
                ct);
        }

        private static string GetContentType(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();

            return ext switch
            {
                ".png" => "image/png",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }

        public async Task<Stream> GetFileAsync(string path, CancellationToken ct)
        {
            var ms = new MemoryStream();

            await _client.GetObjectAsync(new GetObjectArgs()
                .WithBucket(_bucket)
                .WithObject(path)
                .WithCallbackStream(stream => stream.CopyTo(ms)), ct);

            ms.Position = 0;
            return ms;
        }

        public async Task SaveFileAsync(string key, Stream stream, string contentType, CancellationToken ct)
        {
            await PutAsync(key, stream, contentType, ct);
        }
    }
}
