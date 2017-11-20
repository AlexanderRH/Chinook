using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class Playlist
    {
        [Key]
        public int PlaylistId { get; set; }
        public string Name { get; set; }
    }
}
