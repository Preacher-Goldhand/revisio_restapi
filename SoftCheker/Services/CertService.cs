using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SoftCheker.Server.Entities;
using SoftCheker.Server.Models;

namespace SoftCheker.Server.Services
{
    public interface ICertService
    {
        Task<IEnumerable<CertDTO>> GetAllCertsAsync();
        Task<CertDTO> GetCertByIdAsync(int id);
        Task<CertDTO> CreateCertAsync(CertDTO certDto);
        Task<CertDTO> UpdateCertAsync(int id, CertDTO certDto);
        Task DeleteCertAsync(int id);
        Task CancelEmailAsync(int id);
    }

    public class CertService : ICertService
    {
        private readonly SoftChekerDbContext _context;
        private readonly IMapper _mapper;

        public CertService(SoftChekerDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CertDTO>> GetAllCertsAsync()
        {
            var certs = await _context.Certs.ToListAsync();
            return _mapper.Map<IEnumerable<CertDTO>>(certs);
        }

        public async Task<CertDTO> GetCertByIdAsync(int id)
        {
            var cert = await _context.Certs.FindAsync(id);
            return _mapper.Map<CertDTO>(cert);
        }

        public async Task<CertDTO> CreateCertAsync(CertDTO certDto)
        {
            var cert = _mapper.Map<Cert>(certDto);
            _context.Certs.Add(cert);
            await _context.SaveChangesAsync();
            return _mapper.Map<CertDTO>(cert);
        }

        public async Task<CertDTO> UpdateCertAsync(int id, CertDTO certDto)
        {
            var cert = await _context.Certs.FindAsync(id);
            if (cert == null)
            {
                return null;
            }

            _mapper.Map(certDto, cert);
            _context.Certs.Update(cert);
            await _context.SaveChangesAsync();
            return _mapper.Map<CertDTO>(cert);
        }

        public async Task DeleteCertAsync(int id)
        {
            var cert = await _context.Certs.FindAsync(id);
            if (cert != null)
            {
                _context.Certs.Remove(cert);
                await _context.SaveChangesAsync();
            }
        }

        public async Task CancelEmailAsync(int id)
        {
            var cert = await _context.Certs.FindAsync(id);
            cert.EmailCanceled = true;
            _context.Certs.Update(cert);
            await _context.SaveChangesAsync();
        }
    }
}