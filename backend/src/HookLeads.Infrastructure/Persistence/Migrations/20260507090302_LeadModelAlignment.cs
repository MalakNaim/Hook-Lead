using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HookLeads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class LeadModelAlignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActivitySignalsScore",
                table: "Leads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Classification",
                table: "Leads",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanySizeMatchScore",
                table: "Leads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CompanyWebsite",
                table: "Leads",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailVerificationStatus",
                table: "Leads",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EnrichmentStatus",
                table: "Leads",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "HandoffAt",
                table: "Leads",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HandoffStatus",
                table: "Leads",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HandoffTarget",
                table: "Leads",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "IcpProfileId",
                table: "Leads",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IndustryMatchScore",
                table: "Leads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "JobTitleMatchScore",
                table: "Leads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MatchedCriteria",
                table: "Leads",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MismatchReasons",
                table: "Leads",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PainMatchScore",
                table: "Leads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Leads",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QualificationNotes",
                table: "Leads",
                type: "nvarchar(max)",
                maxLength: 5000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QualificationStatus",
                table: "Leads",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WhatsApp",
                table: "Leads",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActivitySignalsScore",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Classification",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "CompanySizeMatchScore",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "CompanyWebsite",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "EmailVerificationStatus",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "EnrichmentStatus",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "HandoffAt",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "HandoffStatus",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "HandoffTarget",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "IcpProfileId",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "IndustryMatchScore",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "JobTitleMatchScore",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "MatchedCriteria",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "MismatchReasons",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "PainMatchScore",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "QualificationNotes",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "QualificationStatus",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "WhatsApp",
                table: "Leads");
        }
    }
}
