using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoftCheker.Server.Models;
using SoftCheker.Server.Services;

namespace SoftCheker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        private readonly IContractService _contractService;

        public ContractController(IContractService contractService)
        {
            _contractService = contractService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ContractDTO>>> GetContracts()
        {
            var contracts = await _contractService.GetAllContractsAsync();
            return Ok(contracts);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ContractDTO>> GetContract(int id)
        {
            var contract = await _contractService.GetContractByIdAsync(id);
            if (contract == null)
            {
                return NotFound();
            }
            return Ok(contract);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ContractDTO>> PostContract(ContractDTO contractDto)
        {
            var createdContract = await _contractService.CreateContractAsync(contractDto);
            return CreatedAtAction(nameof(GetContract), new { id = createdContract.Id }, createdContract);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutContract(int id, ContractDTO contractDto)
        {
            var updatedContract = await _contractService.UpdateContractAsync(id, contractDto);
            if (updatedContract == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteContract(int id)
        {
            await _contractService.DeleteContractAsync(id);
            return Ok();
        }
    }
}
