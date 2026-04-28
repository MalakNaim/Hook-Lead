using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HookLeads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIcpManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IcpProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WorkspaceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IcpProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IcpProfiles_Workspaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "Workspaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IcpCriteria",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IcpProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CriterionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Weight = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IcpCriteria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IcpCriteria_IcpProfiles_IcpProfileId",
                        column: x => x.IcpProfileId,
                        principalTable: "IcpProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IcpCriteria_IcpProfileId",
                table: "IcpCriteria",
                column: "IcpProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_IcpProfiles_WorkspaceId",
                table: "IcpProfiles",
                column: "WorkspaceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IcpCriteria");

            migrationBuilder.DropTable(
                name: "IcpProfiles");
        }
    }
}
