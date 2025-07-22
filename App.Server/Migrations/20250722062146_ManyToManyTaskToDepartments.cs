using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Server.Migrations
{
    /// <inheritdoc />
    public partial class ManyToManyTaskToDepartments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_TaskTemplates_TaskTemplateId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_TaskTemplateId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "TaskTemplateId",
                table: "Departments");

            migrationBuilder.CreateTable(
                name: "TaskTemplateApplicableDepartments",
                columns: table => new
                {
                    ApplicableDepartmentsId = table.Column<int>(type: "int", nullable: false),
                    TaskTemplateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskTemplateApplicableDepartments", x => new { x.ApplicableDepartmentsId, x.TaskTemplateId });
                    table.ForeignKey(
                        name: "FK_TaskTemplateApplicableDepartments_Departments_ApplicableDepartmentsId",
                        column: x => x.ApplicableDepartmentsId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskTemplateApplicableDepartments_TaskTemplates_TaskTemplateId",
                        column: x => x.TaskTemplateId,
                        principalTable: "TaskTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskTemplateApplicableDepartments_TaskTemplateId",
                table: "TaskTemplateApplicableDepartments",
                column: "TaskTemplateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskTemplateApplicableDepartments");

            migrationBuilder.AddColumn<int>(
                name: "TaskTemplateId",
                table: "Departments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_TaskTemplateId",
                table: "Departments",
                column: "TaskTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_TaskTemplates_TaskTemplateId",
                table: "Departments",
                column: "TaskTemplateId",
                principalTable: "TaskTemplates",
                principalColumn: "Id");
        }
    }
}
