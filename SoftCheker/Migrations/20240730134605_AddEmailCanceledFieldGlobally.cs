using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SoftCheker.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailCanceledFieldGlobally : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailCanceled",
                table: "Softs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EmailCanceled",
                table: "Domains",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EmailCanceled",
                table: "Contracts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailCanceled",
                table: "Softs");

            migrationBuilder.DropColumn(
                name: "EmailCanceled",
                table: "Domains");

            migrationBuilder.DropColumn(
                name: "EmailCanceled",
                table: "Contracts");
        }
    }
}
