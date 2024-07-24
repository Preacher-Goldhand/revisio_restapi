namespace SoftCheker.Server.Models
{
    public class SmtpConfigDTO
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public bool UseSsl { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string RecipientEmail { get; set; }
    }
}
