using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class PlaylistTrack
    {
        [Key]
        public int PlaylistId { get; set; }
        public int TrackId { get; set; }
    }
}
