using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoftCheker.Server.Models;
using SoftCheker.Server.Services;

namespace SoftCheker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertController : ControllerBase
    {
        private readonly ICertService _certsService;

        public CertController(ICertService certsService)
        {
            _certsService = certsService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CertDTO>>> GetCerts()
        {
            var certs = await _certsService.GetAllCertsAsync();
            return Ok(certs);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<CertDTO>> GetCert(int id)
        {
            var cert = await _certsService.GetCertByIdAsync(id);
            if (cert == null)
            {
                return NotFound();
            }
            return Ok(cert);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CertDTO>> PostCert(CertDTO certDto)
        {
            var createdCert = await _certsService.CreateCertAsync(certDto);
            return CreatedAtAction(nameof(GetCert), new { id = createdCert.Id }, createdCert);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutCert(int id, CertDTO certDto)
        {
            var updatedCert = await _certsService.UpdateCertAsync(id, certDto);
            if (updatedCert == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCert(int id)
        {
            await _certsService.DeleteCertAsync(id);
            return Ok();
        }
    }
}
