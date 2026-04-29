using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HookLeads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLeadScoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IcpScore",
                table: "Leads",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ScoreBreakdown",
                table: "Leads",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IcpScore",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "ScoreBreakdown",
                table: "Leads");
        }
    }
}
