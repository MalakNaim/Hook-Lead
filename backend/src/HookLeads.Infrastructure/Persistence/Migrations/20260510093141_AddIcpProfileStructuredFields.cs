using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HookLeads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIcpProfileStructuredFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BudgetMax",
                table: "IcpProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BudgetMin",
                table: "IcpProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "BuyingTriggers",
                table: "IcpProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CompanySizeMax",
                table: "IcpProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CompanySizeMin",
                table: "IcpProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "DecisionMaker",
                table: "IcpProfiles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Industries",
                table: "IcpProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "JobTitles",
                table: "IcpProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Locations",
                table: "IcpProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PainPoints",
                table: "IcpProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BudgetMax",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "BudgetMin",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "BuyingTriggers",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "CompanySizeMax",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "CompanySizeMin",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "DecisionMaker",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "Industries",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "JobTitles",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "Locations",
                table: "IcpProfiles");

            migrationBuilder.DropColumn(
                name: "PainPoints",
                table: "IcpProfiles");
        }
    }
}
