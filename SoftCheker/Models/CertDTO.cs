namespace SoftCheker.Server.Models
{
    public class CertDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ExpiredDate { get; set; }
        public DateTime IssuedDate { get; set; }
    }
}