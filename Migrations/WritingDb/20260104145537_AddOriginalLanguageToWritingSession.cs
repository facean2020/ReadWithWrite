using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReadWithWrite.Migrations.WritingDb
{
    /// <inheritdoc />
    public partial class AddOriginalLanguageToWritingSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "TopicId",
                table: "WritingSessions",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "OriginalLanguage",
                table: "WritingSessions",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalLanguage",
                table: "WritingSessions");

            migrationBuilder.AlterColumn<Guid>(
                name: "TopicId",
                table: "WritingSessions",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);
        }
    }
}
