using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoftCheker.Server.Models;
using SoftCheker.Server.Services;

namespace SoftCheker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomainController : ControllerBase
    {
        private readonly IDomainService _domainService;

        public DomainController(IDomainService domainService)
        {
            _domainService = domainService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<DomainDTO>>> GetDomains()
        {
            var domains = await _domainService.GetAllDomainsAsync();
            return Ok(domains);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<DomainDTO>> GetDomain(int id)
        {
            var domain = await _domainService.GetDomainByIdAsync(id);
            if (domain == null)
            {
                return NotFound();
            }
            return Ok(domain);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<DomainDTO>> PostDomain(DomainDTO domainDto)
        {
            var createdDomain = await _domainService.CreateDomainAsync(domainDto);
            return CreatedAtAction(nameof(GetDomain), new { id = createdDomain.Id }, createdDomain);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutDomain(int id, DomainDTO domainDto)
        {
            var updatedDomain = await _domainService.UpdateDomainAsync(id, domainDto);
            if (updatedDomain == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteDomain(int id)
        {
            await _domainService.DeleteDomainAsync(id);
            return Ok();
        }

        [HttpPost("cancel-email/{id}")]
        public async Task<IActionResult> CancelEmail(int id)
        {

            await _domainService.CancelEmailAsync(id);
            return Ok();

        }
    }
}
