using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPhaseToPersonRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OffsetFromStartDate",
                table: "TaskTemplates");

            migrationBuilder.AddColumn<int>(
                name: "Phase",
                table: "PersonRecords",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Phase",
                table: "PersonRecords");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "OffsetFromStartDate",
                table: "TaskTemplates",
                type: "time",
                nullable: true);
        }
    }
}
