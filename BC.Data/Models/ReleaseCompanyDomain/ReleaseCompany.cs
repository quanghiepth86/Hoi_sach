﻿namespace BC.Data.Models
{
    public class ReleaseCompany: BaseModel
    {
        public string Name { get; set; }

        public string Logo { get; set; }

        public Country Country { get; set; }
    }
}
