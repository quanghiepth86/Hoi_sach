﻿namespace BC.Data.Models
{
    public class PostLike: BaseModel
    {
        public Member Member { get; set; }

        public Post Post { get; set; }
    }
}
