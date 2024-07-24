namespace SoftCheker.Server.Models
{
    public class SoftDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CurrentVersion { get; set; }
        public DateTime EOLBasicSupport { get; set; }
        public DateTime EOLExtendedSupport { get; set; }
        public string EOLNextVersion { get; set; }
    }
}
