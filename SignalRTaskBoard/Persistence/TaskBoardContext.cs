using Microsoft.EntityFrameworkCore;
using SignalRTaskBoard.Models;

namespace SignalRTaskBoard.Persistence
{
    public class TaskBoardContext : DbContext
    {
        public TaskBoardContext(DbContextOptions<TaskBoardContext> options) : base(options)
        {
        }

        public DbSet<WorkItem> WorkItems { get; set; }
    }
}
