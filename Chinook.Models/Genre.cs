using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class Genre
    {
        [Key]
        public int GenreId { get; set; }
        public string Name { get; set; }
    }
}
