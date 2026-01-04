using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReadWithWrite.Migrations
{
    /// <inheritdoc />
    public partial class AddWritingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WritingSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TopicId = table.Column<Guid>(type: "TEXT", nullable: false),
                    OriginalText = table.Column<string>(type: "TEXT", nullable: false),
                    RevisedText = table.Column<string>(type: "TEXT", nullable: true),
                    Feedback = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WritingSessions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WritingTopics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WritingTopics", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WritingTopics_Date",
                table: "WritingTopics",
                column: "Date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WritingSessions");

            migrationBuilder.DropTable(
                name: "WritingTopics");
        }
    }
}
