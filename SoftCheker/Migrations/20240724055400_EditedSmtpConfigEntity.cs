using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SoftCheker.Server.Migrations
{
    /// <inheritdoc />
    public partial class EditedSmtpConfigEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SmtpPassword",
                table: "SmtpConfigs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SmtpPassword",
                table: "SmtpConfigs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
