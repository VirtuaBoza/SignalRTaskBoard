using System.Collections.Generic;

namespace SignalRTaskBoard.Models
{
    public class TaskBoard
    {
        public int Id { get; set; }
        public List<WorkItem> WorkItems { get; set; }
    }
}
