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

        [HttpGet("taskboards/{taskBoardId}/workitems")]
        public async Task<IEnumerable<WorkItem>> GetTasks(int taskBoardId)
        {
            return await context.WorkItems
                .Where(w => w.TaskBoardId == taskBoardId)
                .ToListAsync();
        }

        [HttpPost("taskboards/{taskBoardId}/workitems")]
        public async Task<IActionResult> CreateNewTask(int taskBoardId)
        {
            var workItem = new WorkItem
            {
                TaskBoardId = taskBoardId,
                IndexInColumn = context.WorkItems
                    .Count(i => i.TaskBoardId == taskBoardId && i.ColumnId == 0),
            };
            context.WorkItems.Add(workItem);
            try
            {
                await context.SaveChangesAsync();
                return Ok(workItem);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest("Failed to create new task.");
            }
        }

        [HttpPut("[controller]")]
        public async Task<IActionResult> UpdateTasks([FromBody] WorkItem[] workItems)
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
            workItem.IndexInColumn = context.WorkItems
                .Count(i => i.ColumnId == workItem.ColumnId);

            var existingWorkItem = await context.WorkItems.AsNoTracking()
                .SingleOrDefaultAsync(i => i.Id == workItem.Id);

            if (existingWorkItem == null)
            {
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
