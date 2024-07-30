using AutoMapper;
using SoftCheker.Server.Entities;
using SoftCheker.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace SoftCheker.Server.Services
{
    public interface IContractService
    {
        Task<IEnumerable<ContractDTO>> GetAllContractsAsync();
        Task<ContractDTO> GetContractByIdAsync(int id);
        Task<ContractDTO> CreateContractAsync(ContractDTO contractDto);
        Task<ContractDTO> UpdateContractAsync(int id, ContractDTO contractDto);
        Task DeleteContractAsync(int id);
        Task CancelEmailAsync(int id);
    }

    public class ContractService : IContractService
    {
        private readonly SoftChekerDbContext _context;
        private readonly IMapper _mapper;

        public ContractService(SoftChekerDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ContractDTO>> GetAllContractsAsync()
        {
            var contracts = await _context.Contracts.ToListAsync();
            return _mapper.Map<IEnumerable<ContractDTO>>(contracts);
        }

        public async Task<ContractDTO> GetContractByIdAsync(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            return _mapper.Map<ContractDTO>(contract);
        }

        public async Task<ContractDTO> CreateContractAsync(ContractDTO contractDto)
        {
            var contract = _mapper.Map<Contract>(contractDto);
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();
            return _mapper.Map<ContractDTO>(contract);
        }

        public async Task<ContractDTO> UpdateContractAsync(int id, ContractDTO contractDto)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return null;
            }

            _mapper.Map(contractDto, contract);
            _context.Contracts.Update(contract);
            await _context.SaveChangesAsync();
            return _mapper.Map<ContractDTO>(contract);
        }

        public async Task DeleteContractAsync(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);

            if (contract != null)
            {
                _context.Contracts.Remove(contract);
                await _context.SaveChangesAsync();
            }
        }
        public async Task CancelEmailAsync(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            contract.EmailCanceled = true;
            _context.Contracts.Update(contract);
            await _context.SaveChangesAsync();
        }
    }
}