using Chinook.Repositories.Chinook;

namespace Chinook.UnitOfWork
{
    public interface IUnitOfWork
    {
        IAlbumRepository Album { get; }
        IArtistRepository Artist { get; }
        ICustomerRepository Customer { get; }
        IEmployeeRepository Employee { get; }
        IGenreRepository Genre { get; }
        IInvoiceRepository Invoice { get; }
        IInvoiceLineRepository InvoiceLine { get; }
        IMediaTypeRepository MediaType { get; }
        IPlaylistRepository Playlist { get; }
        IPlaylistTrackRepository PlaylistTrack { get; }
        ITrackRepository Track { get; }
        IUserRepository User { get; }
    }
}
