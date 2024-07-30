using AutoMapper;
using SoftCheker.Server.Entities;
using SoftCheker.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace SoftCheker.Server.Services
{
    public interface IDomainService
    {
        Task<IEnumerable<DomainDTO>> GetAllDomainsAsync();
        Task<DomainDTO> GetDomainByIdAsync(int id);
        Task<DomainDTO> CreateDomainAsync(DomainDTO domainDto);
        Task<DomainDTO> UpdateDomainAsync(int id, DomainDTO domainDto);
        Task DeleteDomainAsync(int id);
        Task CancelEmailAsync(int id);
    }


    public class DomainService : IDomainService
        {
            private readonly SoftChekerDbContext _context;
            private readonly IMapper _mapper;

            public DomainService(SoftChekerDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<IEnumerable<DomainDTO>> GetAllDomainsAsync()
            {
                var domains = await _context.Domains.ToListAsync();
                return _mapper.Map<IEnumerable<DomainDTO>>(domains);
            }

            public async Task<DomainDTO> GetDomainByIdAsync(int id)
            {
                var domain = await _context.Domains.FindAsync(id);
                return _mapper.Map<DomainDTO>(domain);
            }

            public async Task<DomainDTO> CreateDomainAsync(DomainDTO domainDto)
            {
                var domain = _mapper.Map<Domain>(domainDto);
                _context.Domains.Add(domain);
                await _context.SaveChangesAsync();
                return _mapper.Map<DomainDTO>(domain);
            }

            public async Task<DomainDTO> UpdateDomainAsync(int id, DomainDTO domainDto)
            {
                var domain = await _context.Domains.FindAsync(id);
                if (domain == null)
                {
                    return null;
                }

                _mapper.Map(domainDto, domain);
                _context.Domains.Update(domain);
                await _context.SaveChangesAsync();
                return _mapper.Map<DomainDTO>(domain);
            }

            public async Task DeleteDomainAsync(int id)
            {
                var domain = await _context.Domains.FindAsync(id);
                if (domain != null)
                {
                    _context.Domains.Remove(domain);
                    await _context.SaveChangesAsync();
                }
            }
            public async Task CancelEmailAsync(int id)
            {
                var domain = await _context.Domains.FindAsync(id);
                domain.EmailCanceled = true;
                _context.Domains.Update(domain);
                await _context.SaveChangesAsync();
            }
    }
}