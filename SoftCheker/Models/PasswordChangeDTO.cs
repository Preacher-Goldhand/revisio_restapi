namespace SoftCheker.Server.Models
{
    public class PasswordChangeDTO
    {
        public string UserName { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
