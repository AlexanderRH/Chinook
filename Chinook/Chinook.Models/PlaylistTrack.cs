using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class PlaylistTrack
    {
        [Key]
        public int PlaylistTrackId { get; set; }
        public int PlaylistId { get; set; }
        public int TrackId { get; set; }
    }
}
