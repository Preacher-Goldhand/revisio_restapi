﻿namespace SoftCheker.Server.Entities
{
    public class Domain
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ExpiredDate { get; set; }
        public bool EmailCanceled { get; set; }
    }
}
