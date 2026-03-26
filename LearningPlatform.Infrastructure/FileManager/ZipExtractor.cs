

using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.DTO;
using System.IO.Compression;
using System.Text;

namespace LearningPlatform.Infrastructure.FileManager
{
    public class ZipExtractor : IZipExtractor
    {
        public async Task<LessonContent> ExtractAsync(
    Stream zipStream,
    CancellationToken ct)
        {
            using var archive = new ZipArchive(zipStream, ZipArchiveMode.Read, leaveOpen: true);

            string? markdown = null;

            var images = new List<FileEntry>();

            foreach (var entry in archive.Entries)
            {
                ct.ThrowIfCancellationRequested();

                if (entry.Length == 0)
                    continue;

                var ext = Path.GetExtension(entry.Name).ToLowerInvariant();

                // ===== Markdown =====
                if (ext == ".md")
                {
                    await using var s = entry.Open();
                    using var reader = new StreamReader(s, Encoding.UTF8);

                    markdown = await reader.ReadToEndAsync(ct);
                }
                // ===== Images =====
                else if (ext is ".png" or ".jpg" or ".jpeg" or ".webp" or ".gif")
                {
                    var ms = new MemoryStream();

                    await using var s = entry.Open();
                    await s.CopyToAsync(ms, ct);

                    ms.Position = 0;

                    images.Add(new FileEntry
                    {
                        Name = entry.Name,
                        Stream = ms
                    });
                }
            }

            if (markdown is null)
                throw new InvalidOperationException("Markdown file not found in zip");

            return new LessonContent
            {
                Markdown = markdown,
                Images = images
            };
        }
    }
}
