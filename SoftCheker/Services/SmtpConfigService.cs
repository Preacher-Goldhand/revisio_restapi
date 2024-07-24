using DotNetEnv;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SoftCheker.Server.Entities;
using SoftCheker.Server.Models;

namespace SoftCheker.Server.Services
{
    public interface ISmtpConfigService
    {
        Task<SmtpConfigDTO> GetConfigAsync();
        Task UpdateConfigAsync(SmtpConfigDTO configDto);
    }

    public class SmtpConfigService : ISmtpConfigService
    {
        private readonly SoftChekerDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _envFilePath = Path.Combine(Directory.GetCurrentDirectory(), ".env");

        public SmtpConfigService(SoftChekerDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            Env.Load(); 
        }

        public async Task<SmtpConfigDTO> GetConfigAsync()
        {
            var config = await _context.SmtpConfigs.FirstOrDefaultAsync();
            return _mapper.Map<SmtpConfigDTO>(config);
        }

        public async Task UpdateConfigAsync(SmtpConfigDTO configDto)
        {
            var config = await _context.SmtpConfigs.FirstOrDefaultAsync();

            if (config == null)
            {
                config = _mapper.Map<SmtpConfig>(configDto);
                _context.SmtpConfigs.Add(config);
            }
            else
            {
                config.SmtpServer = configDto.SmtpServer;
                config.SmtpPort = configDto.SmtpPort;
                config.SmtpUsername = configDto.SmtpUsername;
                config.RecipientEmail = configDto.RecipientEmail;
                _context.SmtpConfigs.Update(config);
            }

            await _context.SaveChangesAsync();

            UpdateEnvFile("SMTP_PASSWORD", configDto.SmtpPassword);
        }

        private void UpdateEnvFile(string key, string value)
        {
            var lines = File.ReadAllLines(_envFilePath);
            var keyExists = false;

            using (var writer = new StreamWriter(_envFilePath, false))
            {
                foreach (var line in lines)
                {
                    if (line.StartsWith(key))
                    {
                        writer.WriteLine($"{key}={value}");
                        keyExists = true;
                    }
                    else
                    {
                        writer.WriteLine(line);
                    }
                }

                if (!keyExists)
                {
                    writer.WriteLine($"{key}={value}");
                }
            }
        }
    }
}
