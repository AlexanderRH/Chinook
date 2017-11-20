using Chinook.Repositories.Chinook;
using Chinook.UnitOfWork;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class ChinookUnitOfWork : IUnitOfWork
    {
        public IAlbumRepository Album { get; private set; }
        public IArtistRepository Artist { get; private set; }
        public ICustomerRepository Customer { get; private set; }
        public IEmployeeRepository Employee { get; private set; }
        public IGenreRepository Genre { get; private set; }
        public IInvoiceRepository Invoice { get; private set; }
        public IInvoiceLineRepository InvoiceLine { get; private set; }
        public IMediaTypeRepository MediaType { get; private set; }
        public IPlaylistRepository Playlist { get; private set; }
        public IPlaylistTrackRepository PlaylistTrack { get; private set; }
        public ITrackRepository Track { get; private set; }
        public IUserRepository User { get; private set; }

        public ChinookUnitOfWork(string connectionString)
        {
            Album = new AlbumRepository(connectionString);
            Artist = new ArtistRepository(connectionString);
            Customer = new CustomerRepository(connectionString);
            Employee = new EmployeeRepository(connectionString);
            Genre = new GenreRepository(connectionString);
            Invoice = new InvoiceRepository(connectionString);
            InvoiceLine = new InvoiceLineRepository(connectionString);
            MediaType = new MediaTypeRepository(connectionString);
            Playlist = new PlaylistRepository(connectionString);
            PlaylistTrack = new PlaylistTrackRepository(connectionString);
            Track = new TrackRepository(connectionString);
            User = new UserRepository(connectionString);
        }
    }
}
