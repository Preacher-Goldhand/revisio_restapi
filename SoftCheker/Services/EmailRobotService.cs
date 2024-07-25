using SoftCheker.Server.Entities;

namespace SoftCheker.Server.Services
{
    public class EmailRobotService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EmailRobotService> _logger;

        public EmailRobotService(IServiceProvider serviceProvider, ILogger<EmailRobotService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Email Background Service is starting.");

            stoppingToken.Register(() =>
                _logger.LogInformation("Email Background Service is stopping."));

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Email Background Service is running.");

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<SoftChekerDbContext>();
                        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                        var currentDate = DateTime.Now;
                        var currentYear = currentDate.Year;
                        var currentMonth = currentDate.Month;

                        var nextMonth = (currentMonth % 12) + 1;
                        var targetYear = (nextMonth == 1) ? currentYear + 1 : currentYear;

                        await CheckAndSendSupportEmailsAsync(dbContext, emailService, targetYear, nextMonth);
                        await CheckAndSendDomainExpirationEmailsAsync(dbContext, emailService, targetYear, nextMonth);
                        await CheckAndSendContractExpirationEmailsAsync(dbContext, emailService, targetYear, nextMonth);
                        await CheckAndSendCertificateExpirationEmailsAsync(dbContext, emailService, targetYear, nextMonth);

                        _logger.LogInformation("Entities checked.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while sending warning emails.");
                    Console.WriteLine($"An error occurred: {ex.Message}");
                }

                _logger.LogInformation("Waiting ...");
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }

            _logger.LogInformation("Email Background Service has stopped.");
        }

        private async Task CheckAndSendSupportEmailsAsync(
            SoftChekerDbContext dbContext,
            IEmailService emailService,
            int targetYear,
            int nextMonth)
        {
            _logger.LogInformation("Checking for products...");

            var products = dbContext.Softs
                .Where(p =>
                    (p.BasicSupport.Year == targetYear && p.BasicSupport.Month == nextMonth) ||
                    (p.ExtendedSupport.Year == targetYear && p.ExtendedSupport.Month == nextMonth))
                .ToList();

            _logger.LogInformation($"Found {products.Count} products nearing end of support.");

            foreach (var product in products)
            {
                var subject = $"Ostrzeżenie: Wsparcie dla produktu {product.Name} wkrótce się kończy";
                var bodyText = $"Wsparcie dla produktu {product.Name} wkrótce się kończy.\n" +
                               $"Data zakończenia podstawowego wsparcia: {product.BasicSupport:yyyy-MM-dd}\n" +
                               $"Data zakończenia rozszerzonego wsparcia: {product.ExtendedSupport:yyyy-MM-dd}";
                var bodyHtml = $"<p>Wsparcie dla produktu <b>{product.Name}</b> wkrótce się kończy.</p>" +
                               $"<p>Data zakończenia podstawowego wsparcia: {product.BasicSupport:yyyy-MM-dd}</p>" +
                               $"<p>Data zakończenia rozszerzonego wsparcia: {product.ExtendedSupport:yyyy-MM-dd}</p>";

                await SendWarningEmailAsync(emailService, subject, bodyText, bodyHtml);
            }
        }

        private async Task CheckAndSendDomainExpirationEmailsAsync(
            SoftChekerDbContext dbContext,
            IEmailService emailService,
            int targetYear,
            int nextMonth)
        {
            _logger.LogInformation("Checking for domains...");

            var domains = dbContext.Domains
                .Where(d =>
                    d.ExpiredDate.Year == targetYear && d.ExpiredDate.Month == nextMonth)
                .ToList();

            _logger.LogInformation($"Found {domains.Count} domains nearing expiration.");

            foreach (var domain in domains)
            {
                var subject = $"Ostrzeżenie: Wygasająca domena {domain.Name}";
                var bodyText = $"Domena {domain.Name} wkrótce wygasa.\n" +
                               $"Data wygaśnięcia: {domain.ExpiredDate:yyyy-MM-dd}";
                var bodyHtml = $"<p>Domena <b>{domain.Name}</b> wkrótce wygasa.</p>" +
                               $"<p>Data wygaśnięcia: {domain.ExpiredDate:yyyy-MM-dd}</p>";

                await SendWarningEmailAsync(emailService, subject, bodyText, bodyHtml);
            }
        }

        private async Task CheckAndSendContractExpirationEmailsAsync(
            SoftChekerDbContext dbContext,
            IEmailService emailService,
            int targetYear,
            int nextMonth)
        {
            _logger.LogInformation("Checking for contracts...");

            var contracts = dbContext.Contracts
                .Where(c =>
                    c.EndDate.Year == targetYear && c.EndDate.Month == nextMonth)
                .ToList();

            _logger.LogInformation($"Found {contracts.Count} contracts nearing end.");

            foreach (var contract in contracts)
            {
                var subject = $"Ostrzeżenie: Kontrakt {contract.ContractNumber} wkrótce wygasa";
                var bodyText = $"Kontrakt {contract.ContractNumber} wkrótce wygasa.\n" +
                               $"Data zakończenia: {contract.EndDate:yyyy-MM-dd}";
                var bodyHtml = $"<p>Kontrakt <b>{contract.ContractNumber}</b> wkrótce wygasa.</p>" +
                               $"<p>Data zakończenia: {contract.EndDate:yyyy-MM-dd}</p>";

                await SendWarningEmailAsync(emailService, subject, bodyText, bodyHtml);
            }
        }

        private async Task CheckAndSendCertificateExpirationEmailsAsync(
            SoftChekerDbContext dbContext,
            IEmailService emailService,
            int targetYear,
            int nextMonth)
        {
            _logger.LogInformation("Checking for certificates...");

            var certs = dbContext.Certs
                .Where(c =>
                    c.ExpiredDate.Year == targetYear && c.ExpiredDate.Month == nextMonth)
                .ToList();

            _logger.LogInformation($"Found {certs.Count} certificates nearing expiration.");

            foreach (var cert in certs)
            {
                var subject = $"Ostrzeżenie: Certyfikat {cert.Name} wkrótce wygasa";
                var bodyText = $"Certyfikat {cert.Name} wkrótce wygasa.\n" +
                               $"Data wygaśnięcia: {cert.ExpiredDate:yyyy-MM-dd}";
                var bodyHtml = $"<p>Certyfikat <b>{cert.Name}</b> wkrótce wygasa.</p>" +
                               $"<p>Data wygaśnięcia: {cert.ExpiredDate:yyyy-MM-dd}</p>";

                await SendWarningEmailAsync(emailService, subject, bodyText, bodyHtml);
            }
        }

        private async Task SendWarningEmailAsync(
            IEmailService emailService,
            string subject,
            string bodyText,
            string bodyHtml)
        {
            try
            {
                await emailService.SendWarningEmailAsync(subject, bodyText, bodyHtml);
                Console.WriteLine($"Email sent: {subject}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email: {subject}");
                Console.WriteLine($"Failed to send email: {subject}");
            }
        }
    }
}
