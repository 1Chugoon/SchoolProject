using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCourse0 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Courses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CourseTags_TagId",
                table: "CourseTags",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseTags_Courses_CourseId",
                table: "CourseTags",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseTags_Tags_TagId",
                table: "CourseTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseTags_Courses_CourseId",
                table: "CourseTags");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseTags_Tags_TagId",
                table: "CourseTags");

            migrationBuilder.DropIndex(
                name: "IX_CourseTags_TagId",
                table: "CourseTags");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Courses");
        }
    }
}
