using Microsoft.AspNetCore.Mvc;
using SoftCheker.Server.Models;
using SoftCheker.Server.Services;

namespace SoftCheker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SoftController : ControllerBase
    {
        private readonly ISoftService _softService;

        public SoftController(ISoftService softService)
        {
            _softService = softService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SoftDTO>>> GetAll()
        {
            var softs = await _softService.GetAllAsync();
            return Ok(softs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SoftDTO>> GetById(int id)
        {
            var soft = await _softService.GetByIdAsync(id);
            if (soft == null)
            {
                return NotFound();
            }

            return Ok(soft);
        }

        [HttpPost]
        public async Task<ActionResult<SoftDTO>> Create(SoftDTO softDto)
        {
            var createdSoft = await _softService.CreateAsync(softDto);
            return CreatedAtAction(nameof(GetById), new { id = createdSoft.Id }, createdSoft);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SoftDTO softDto)
        {
            await _softService.UpdateAsync(id, softDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _softService.DeleteAsync(id);
            return Ok();
        }
    }
}
