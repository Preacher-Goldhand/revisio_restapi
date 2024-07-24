using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoftCheker.Server.Models;
using SoftCheker.Server.Services;

namespace SoftCheker.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SmtpConfigController : ControllerBase
    {
        private readonly ISmtpConfigService _smtpConfigService;

        public SmtpConfigController(ISmtpConfigService smtpConfigService)
        {
            _smtpConfigService = smtpConfigService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<SmtpConfigDTO>> GetConfig()
        {
            var config = await _smtpConfigService.GetConfigAsync();
            if (config == null)
            {
                return NotFound();
            }
            return Ok(config);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateConfig([FromBody] SmtpConfigDTO configDto)
        {
            if (configDto == null || string.IsNullOrEmpty(configDto.SmtpServer))
            {
                return NotFound();
            }
            await _smtpConfigService.UpdateConfigAsync(configDto);
            return Ok();
        }             
    }
}
