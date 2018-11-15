using Microsoft.EntityFrameworkCore.Migrations;

namespace SignalRTaskBoard.Migrations
{
    public partial class trimworkitemmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedHours",
                table: "WorkItems");

            migrationBuilder.DropColumn(
                name: "HoursCompleted",
                table: "WorkItems");

            migrationBuilder.DropColumn(
                name: "HoursRemaining",
                table: "WorkItems");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "EstimatedHours",
                table: "WorkItems",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "HoursCompleted",
                table: "WorkItems",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "HoursRemaining",
                table: "WorkItems",
                nullable: true);
        }
    }
}
