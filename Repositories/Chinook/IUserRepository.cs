using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IUserRepository : IRepository<User>
    {
        User ValidaterUser(string email, string password);

        IEnumerable<User> PagedList(int startRow, int endRow);

        int Count();
    }
}
