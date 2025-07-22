using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTaskTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwningDepartmentId",
                table: "TaskTemplates",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskTemplates_OwningDepartmentId",
                table: "TaskTemplates",
                column: "OwningDepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskTemplates_Departments_OwningDepartmentId",
                table: "TaskTemplates",
                column: "OwningDepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskTemplates_Departments_OwningDepartmentId",
                table: "TaskTemplates");

            migrationBuilder.DropIndex(
                name: "IX_TaskTemplates_OwningDepartmentId",
                table: "TaskTemplates");

            migrationBuilder.DropColumn(
                name: "OwningDepartmentId",
                table: "TaskTemplates");
        }
    }
}
