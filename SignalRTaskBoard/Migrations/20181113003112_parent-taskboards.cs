using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SignalRTaskBoard.Migrations
{
    public partial class parenttaskboards : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TaskBoardId",
                table: "WorkItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TaskBoards",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskBoards", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkItems_TaskBoardId",
                table: "WorkItems",
                column: "TaskBoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkItems_TaskBoards_TaskBoardId",
                table: "WorkItems",
                column: "TaskBoardId",
                principalTable: "TaskBoards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkItems_TaskBoards_TaskBoardId",
                table: "WorkItems");

            migrationBuilder.DropTable(
                name: "TaskBoards");

            migrationBuilder.DropIndex(
                name: "IX_WorkItems_TaskBoardId",
                table: "WorkItems");

            migrationBuilder.DropColumn(
                name: "TaskBoardId",
                table: "WorkItems");
        }
    }
}
