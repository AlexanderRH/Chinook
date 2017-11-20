using Chinook.Models;
using Chinook.Repositories.Chinook;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(string connectionString) : base(connectionString)
        {
        }

        public User ValidaterUser(string email, string password)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@email", email);
                parameters.Add("@password", password);

                return connection.QueryFirstOrDefault<User>(
                        "dbo.ValidateUser",
                        parameters,
                        commandType: System.Data.CommandType.StoredProcedure
                    );
            }
        }

        public int Count()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return connection.ExecuteScalar<int>("SELECT Count(Id) FROM dbo.[User]");
            }
        }

        public IEnumerable<User> PagedList(int startRow, int endRow)
        {
            if (startRow >= endRow) return new List<User>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@startRow", startRow);
                parameters.Add("@endRow", endRow);
                return connection.Query<User>(
                    "dbo.UserPagedList",
                    parameters,
                    commandType: System.Data.CommandType.StoredProcedure
                    );
            }
        }
    }
}
