namespace SoftCheker.Server.Entities
{
    public class Cert
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime IssuedDate { get; set; }
        public DateTime ExpiredDate { get; set; }
    }
}
