using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPersonRecordRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonRecords_Departments_DepartmentId",
                table: "PersonRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonRecords_Teams_TeamId",
                table: "PersonRecords");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonRecords_Departments_DepartmentId",
                table: "PersonRecords",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PersonRecords_Teams_TeamId",
                table: "PersonRecords",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonRecords_Departments_DepartmentId",
                table: "PersonRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonRecords_Teams_TeamId",
                table: "PersonRecords");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonRecords_Departments_DepartmentId",
                table: "PersonRecords",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonRecords_Teams_TeamId",
                table: "PersonRecords",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }
    }
}
