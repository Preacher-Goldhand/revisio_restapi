using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace SoftCheker.Server.Entities
{
    public class SoftChekerDbContext : IdentityDbContext<IdentityUser>
    {
        public SoftChekerDbContext(DbContextOptions<SoftChekerDbContext> options) : base(options)
        { }

        public DbSet<Soft> Softs { get; set; }
        public DbSet<SmtpConfig> SmtpConfigs { get; set; }
        public DbSet<Domain> Domains { get; set; }
        public DbSet<Cert> Certs { get; set; }
        public DbSet<Contract> Contracts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                Env.Load();

                var databasePassword = Env.GetString("DATABASE_PASSWORD");
                if (string.IsNullOrEmpty(databasePassword))
                {
                    throw new InvalidOperationException("DATABASE_PASSWORD environment variable is not set.");
                }

                var configuration = new ConfigurationBuilder()
                    .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
                    .AddJsonFile("appsettings.json", optional: false)
                    .Build();

                var baseConnectionString = configuration.GetConnectionString("SoftChekerDb");

                var connectionString = baseConnectionString.Replace("{DATABASE_PASSWORD}", databasePassword);

                optionsBuilder.UseNpgsql(connectionString);
            }
        }
    }
}
