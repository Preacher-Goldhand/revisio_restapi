namespace SoftCheker.Server.Entities
{
    public class SmtpConfig
    {
        public int Id { get; set; }
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public bool UseSsl { get; set; }
        public string SmtpUsername { get; set; }
        //public string SmtpPassword { get; set; }
        public string RecipientEmail { get; set; }
    }
}
