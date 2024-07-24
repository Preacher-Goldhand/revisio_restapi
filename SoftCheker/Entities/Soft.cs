namespace SoftCheker.Server.Entities
{
    public class Soft
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CurrentVersion { get; set; }
        public DateTime BasicSupport { get; set; }
        public DateTime ExtendedSupport { get; set; }
        public string NextVersion { get; set; }
    }
}
