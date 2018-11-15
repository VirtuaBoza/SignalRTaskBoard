using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRTaskBoard.Models;
using SignalRTaskBoard.Persistence;
using System;
using System.Threading.Tasks;

namespace SignalRTaskBoard.Controllers
{
    [Route("api/[controller]")]
    public class TaskBoardsController : Controller
    {
        private readonly TaskBoardContext context;

        public TaskBoardsController(TaskBoardContext context)
        {
            this.context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int? id)
        {
            if (!id.HasValue) return BadRequest();

            var taskboard = await context.TaskBoards
                .Include(t => t.WorkItems)
                .SingleOrDefaultAsync(t => t.Id == id.Value);

            if (taskboard == null)
            {
                return BadRequest();
            }

            return Ok(taskboard);

        }

        [HttpPost("")]
        public async Task<IActionResult> Post()
        {
            var taskBoard = new TaskBoard();
            context.TaskBoards.Add(taskBoard);
            try
            {
                await context.SaveChangesAsync();
                return Ok(taskBoard);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest("Unable to create taskboard.");
            }
        }
    }
}
