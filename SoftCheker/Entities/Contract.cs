namespace SoftCheker.Server.Entities
{
    public class Contract
    {
        public int Id { get; set; }
        public string ContractNumber { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime RenewDate { get; set; }
        public decimal GrossPrice { get; set; }
        public bool EmailCanceled { get; set; }
    }
}
