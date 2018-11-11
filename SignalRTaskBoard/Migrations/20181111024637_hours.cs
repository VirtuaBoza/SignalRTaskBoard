using Microsoft.EntityFrameworkCore.Migrations;

namespace SignalRTaskBoard.Migrations
{
    public partial class hours : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "EstimatedHours",
                table: "WorkItems",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "HoursCompleted",
                table: "WorkItems",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "HoursRemaining",
                table: "WorkItems",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
