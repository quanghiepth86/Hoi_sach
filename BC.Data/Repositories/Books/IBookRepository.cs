﻿using BC.Data.Models;
using BC.Data.Requests;
using System.Collections.Generic;

namespace BC.Data.Repositories
{
    public interface IBookRepository: IBaseRepository<Book>
    {
        IList<BookModel> Search(BookRequest request);
    }
}
