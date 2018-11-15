using Microsoft.EntityFrameworkCore;
using SignalRTaskBoard.Models;

namespace SignalRTaskBoard.Persistence
{
    public class TaskBoardContext : DbContext
    {
        public TaskBoardContext(DbContextOptions<TaskBoardContext> options) : base(options)
        {
        }

        public DbSet<TaskBoard> TaskBoards { get; set; }
        public DbSet<WorkItem> WorkItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WorkItem>()
                .Property(w => w.Id)
                .ValueGeneratedNever();
        }
    }
}
