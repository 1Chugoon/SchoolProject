using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Update01022026 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Description", "Email", "EmailConfirmed", "Name", "PasswordHash", "Role", "AvatarFileName" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), null, "admin", true, "Admin", "$2a$11$GVR3HXd0RiRD1ZuO7bGL2uJjqfstadMz4IXkp2qx1xrgHJ016QvJG", 2, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));
        }
    }
}
