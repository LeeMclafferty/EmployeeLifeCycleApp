using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePersonRecordsDepartmentTeam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "PersonRecords");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "PersonRecords",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "PersonRecords",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PersonRecords_DepartmentId",
                table: "PersonRecords",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonRecords_TeamId",
                table: "PersonRecords",
                column: "TeamId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonRecords_Departments_DepartmentId",
                table: "PersonRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonRecords_Teams_TeamId",
                table: "PersonRecords");

            migrationBuilder.DropIndex(
                name: "IX_PersonRecords_DepartmentId",
                table: "PersonRecords");

            migrationBuilder.DropIndex(
                name: "IX_PersonRecords_TeamId",
                table: "PersonRecords");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "PersonRecords");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "PersonRecords");

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "PersonRecords",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
