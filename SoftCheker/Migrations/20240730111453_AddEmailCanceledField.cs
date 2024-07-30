using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SoftCheker.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailCanceledField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailCanceled",
                table: "Certs",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailCanceled",
                table: "Certs");
        }
    }
}
