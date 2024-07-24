using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCheker.Server.Entities;
using SoftCheker.Server.Services;

namespace SoftCheker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CsvController : ControllerBase
    {
        private readonly ICsvGeneratorService _csvGeneratorService;
        private readonly SoftChekerDbContext _dbContext;

        public CsvController(ICsvGeneratorService csvGeneratorService, SoftChekerDbContext dbContext)
        {
            _csvGeneratorService = csvGeneratorService;
            _dbContext = dbContext;
        }

        [HttpGet("generate-report")]
        [Authorize]
        public async Task<IActionResult> GenerateReportCsv()
        {
            var products = await _dbContext.Softs.ToListAsync();
            var domains = await _dbContext.Domains.ToListAsync();
            var contracts = await _dbContext.Contracts.ToListAsync();
            var certificates = await _dbContext.Certs.ToListAsync();

            var filePath = await _csvGeneratorService.GenerateReportCsvAsync(products, domains, contracts, certificates);

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);

            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Path.GetFileName(filePath));
        }
    }
}
