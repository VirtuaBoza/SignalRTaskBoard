namespace SignalRTaskBoard.Models
{
    public class WorkItem
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int ColumnId { get; set; }
        public int IndexInColumn { get; set; }
        public float? EstimatedHours { get; set; }
        public float? HoursRemaining { get; set; }
        public float? HoursCompleted { get; set; }
        public int TaskBoardId { get; set; }
    }
}
