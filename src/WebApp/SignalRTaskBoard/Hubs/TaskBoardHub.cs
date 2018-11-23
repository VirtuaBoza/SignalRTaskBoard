using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRTaskBoard.Hubs
{
    public class TaskBoardHub : Hub
    {
        public async Task JoinTaskBoard(int taskBoardId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, taskBoardId.ToString());
        }
    }
}
