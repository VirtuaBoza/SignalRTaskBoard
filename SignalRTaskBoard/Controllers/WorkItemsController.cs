using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRTaskBoard.Models;
using SignalRTaskBoard.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRTaskBoard.Controllers
{
    [Route("api/[controller]")]
    public class WorkItemsController : Controller
    {
        private readonly TaskBoardContext context;

        public WorkItemsController(TaskBoardContext context)
        {
            this.context = context;
        }

        [HttpGet("{taskBoardId}")]
        public async Task<IEnumerable<WorkItem>> Get(int taskBoardId)
        {
            return await context.WorkItems
                .Where(w => w.TaskBoardId == taskBoardId)
                .ToListAsync();
        }

        [HttpPost("")]
        public async Task<WorkItem> Post([FromBody] WorkItem workItem)
        {
            context.WorkItems.Add(workItem);
            await context.SaveChangesAsync();
            return workItem;
        }

        [HttpPut("")]
        public async Task<IEnumerable<WorkItem>> Put([FromBody] WorkItem[] workItems)
        {
            context.WorkItems.UpdateRange(workItems);
            await context.SaveChangesAsync();
            return workItems;
        }

        [HttpPut("{id}")]
        public async Task<WorkItem> Put([FromBody] WorkItem workItem)
        {
            context.WorkItems.Update(workItem);
            await context.SaveChangesAsync();
            return workItem;
        }
    }
}
