using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SoftCheker.Server.Entities;
using SoftCheker.Server.Models;

namespace SoftCheker.Server.Services
{
    public interface ISoftService
    {
        Task<IEnumerable<SoftDTO>> GetAllAsync();
        Task<SoftDTO> GetByIdAsync(int id);
        Task<SoftDTO> CreateAsync(SoftDTO soft);
        Task UpdateAsync(int id, SoftDTO soft);
        Task DeleteAsync(int id);
    }

    public class SoftService : ISoftService
    {
        private readonly SoftChekerDbContext _context;
        private readonly IMapper _mapper;

        public SoftService(SoftChekerDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SoftDTO>> GetAllAsync()
        {
            var softs = await _context.Softs.ToListAsync();
            return _mapper.Map<IEnumerable<SoftDTO>>(softs);
        }

        public async Task<SoftDTO> GetByIdAsync(int id)
        {
            var soft = await _context.Softs.FindAsync(id);
            return _mapper.Map<SoftDTO>(soft);
        }

        public async Task<SoftDTO> CreateAsync(SoftDTO softDto)
        {
            var soft = _mapper.Map<Soft>(softDto);
            _context.Softs.Add(soft);
            await _context.SaveChangesAsync();
            return _mapper.Map<SoftDTO>(soft);
        }

        public async Task UpdateAsync(int id, SoftDTO softDto)
        {
            var soft = await _context.Softs.FindAsync(id);
            soft.Name = softDto.Name;
            soft.Description = softDto.Description;
            soft.CurrentVersion = softDto.CurrentVersion;
            soft.BasicSupport = softDto.EOLBasicSupport;
            soft.ExtendedSupport = softDto.EOLExtendedSupport;
            soft.NextVersion = softDto.EOLNextVersion;

            _context.Entry(soft).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }


        public async Task DeleteAsync(int id)
        {
            var soft = await _context.Softs.FindAsync(id);  
            _context.Softs.Remove(soft);
            await _context.SaveChangesAsync();
        }
    }
}
