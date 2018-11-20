namespace SignalRTaskBoard.Models
{
    public class WorkItem
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public int ColumnId { get; set; }
        public int IndexInColumn { get; set; }
        public int TaskBoardId { get; set; }
    }
}
