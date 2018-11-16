using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRTaskBoard.Models;
using SignalRTaskBoard.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRTaskBoard.Controllers
{
    [Route("api")]
    public class WorkItemsController : Controller
    {
        private readonly TaskBoardContext context;

        public WorkItemsController(TaskBoardContext context)
        {
            this.context = context;
        }

        [HttpGet("taskboards/{taskBoardId}/[controller]")]
        public async Task<IEnumerable<WorkItem>> GetTasks(int taskBoardId)
        {
            return await context.WorkItems
                .Where(w => w.TaskBoardId == taskBoardId)
                .ToListAsync();
        }

        [HttpPut("taskboards/{taskBoardId}/[controller]")]
        public async Task<IActionResult> UpdateTasks(int taskBoardId, [FromBody] WorkItem[] workItems)
        {
            context.WorkItems.UpdateRange(workItems);
            try
            {
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest("Failed to save tasks.");
            }
        }

        [HttpPost("[controller]/{id}")]
        public async Task<IActionResult> UpdateTask([FromBody] WorkItem workItem)
        {
            var existingWorkItem = await context.WorkItems.AsNoTracking()
                .SingleOrDefaultAsync(i => i.Id == workItem.Id);

            if (existingWorkItem == null)
            {
                workItem.IndexInColumn = context.WorkItems
                    .Count(i => i.ColumnId == workItem.ColumnId);

                context.WorkItems.Add(workItem);
            }
            else
            {
                context.WorkItems.Update(workItem);
            }

            try
            {
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest("Failed to save task.");
            }
        }

        [HttpDelete("[controller]/{id}")]
        public async Task<IActionResult> DeleteTask(string id)
        {
            var existingWorkItem = await context.WorkItems.AsNoTracking()
                .SingleOrDefaultAsync(i => i.Id == id);

            if (existingWorkItem == null) return Ok();

            context.WorkItems.Remove(existingWorkItem);
            try
            {
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest("Failed to delete task.");
            }
        }
    }
}
