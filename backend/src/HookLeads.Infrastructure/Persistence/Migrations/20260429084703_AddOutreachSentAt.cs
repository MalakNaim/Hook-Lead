using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HookLeads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOutreachSentAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SentAt",
                table: "OutreachMessages",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SentAt",
                table: "OutreachMessages");
        }
    }
}
