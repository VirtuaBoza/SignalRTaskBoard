using Microsoft.EntityFrameworkCore.Migrations;

namespace SignalRTaskBoard.Migrations
{
    public partial class nullablehours : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "HoursRemaining",
                table: "WorkItems",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<float>(
                name: "HoursCompleted",
                table: "WorkItems",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<float>(
                name: "EstimatedHours",
                table: "WorkItems",
                nullable: true,
                oldClrType: typeof(float));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "HoursRemaining",
                table: "WorkItems",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "HoursCompleted",
                table: "WorkItems",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "EstimatedHours",
                table: "WorkItems",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);
        }
    }
}
