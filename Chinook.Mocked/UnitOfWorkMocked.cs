using AutoFixture;
using Chinook.Models;
using Chinook.Repositories.Chinook;
using Chinook.UnitOfWork;
using Moq;
using System.Collections.Generic;
using System.Linq;

namespace Chinook.Mocked
{
    public class UnitOfWorkMocked
    {
        private List<Album> _album;
        private List<Artist> _artist;
        private List<Customer> _customer;
        private List<Employee> _employee;
        private List<Genre> _genre;
        private List<Invoice> _invoice;
        private List<InvoiceLine> _invoiceLine;
        private List<MediaType> _mediaType;
        private List<Playlist> _playlist;
        private List<PlaylistTrack> _playlistTrack;
        private List<Track> _track;
        private List<User> _user;

        public UnitOfWorkMocked()
        {
            _album = Albums();
            _artist = Artists();
            _customer = Customers();
            _employee = Employees();
            _genre = Genres();
            _invoice = Invoices();
            _invoiceLine = InvoiceLines();
            _mediaType = MediaTypes();
            _playlist = Playlists();
            _playlistTrack = PlaylistTracks();
            _track = Tracks();
            _user = Users();
        }

        public IUnitOfWork GetInstance()
        {
            var mocked = new Mock<IUnitOfWork>();
            mocked.Setup(u => u.Album).Returns(AlbumRepositoryMocked());
            mocked.Setup(u => u.Artist).Returns(ArtistRepositoryMocked());
            mocked.Setup(u => u.Customer).Returns(CustomerRepositoryMocked());
            mocked.Setup(u => u.Employee).Returns(EmployeeRepositoryMocked());
            mocked.Setup(u => u.Genre).Returns(GenreRepositoryMocked());
            mocked.Setup(u => u.Invoice).Returns(InvoiceRepositoryMocked());
            mocked.Setup(u => u.InvoiceLine).Returns(InvoiceLineRepositoryMocked());
            mocked.Setup(u => u.MediaType).Returns(MediaTypeRepositoryMocked());
            mocked.Setup(u => u.Playlist).Returns(PlaylistRepositoryMocked());
            mocked.Setup(u => u.PlaylistTrack).Returns(PlaylistTrackRepositoryMocked());
            mocked.Setup(u => u.Track).Returns(TrackRepositoryMocked());
            mocked.Setup(u => u.User).Returns(UserRepositoryMocked());

            return mocked.Object;
        }

        private IAlbumRepository AlbumRepositoryMocked()
        {
            var albumMocked = new Mock<IAlbumRepository>();

            albumMocked.Setup(e => e.GetList())
                            .Returns(_album);

            albumMocked.Setup(e => e.Insert(It.IsAny<Album>()))
                            .Callback<Album>(e => _album.Add(e))
                            .Returns<Album>(e => e.AlbumId);

            albumMocked.Setup(e => e.Update(It.IsAny<Album>()))
                            .Callback<Album>(e =>
                                {
                                    _album.RemoveAll(ent => ent.AlbumId == e.AlbumId);
                                    _album.Add(e);
                                }
                            )
                            .Returns(true);

            albumMocked.Setup(e => e.Delete(It.IsAny<Album>()))
                            .Callback<Album>(e => _album.RemoveAll(ent => ent.AlbumId == e.AlbumId))
                            .Returns(true);

            albumMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _album.FirstOrDefault(ent => ent.AlbumId == id));

            return albumMocked.Object;
        }

        private IArtistRepository ArtistRepositoryMocked()
        {
            var artistMocked = new Mock<IArtistRepository>();

            artistMocked.Setup(e => e.GetList())
                            .Returns(_artist);

            artistMocked.Setup(e => e.Insert(It.IsAny<Artist>()))
                            .Callback<Artist>(e => _artist.Add(e))
                            .Returns<Artist>(e => e.ArtistId);

            artistMocked.Setup(e => e.Update(It.IsAny<Artist>()))
                            .Callback<Artist>(e =>
                                {
                                    _artist.RemoveAll(ent => ent.ArtistId == e.ArtistId);
                                    _artist.Add(e);
                                }
                            )
                            .Returns(true);

            artistMocked.Setup(e => e.Delete(It.IsAny<Artist>()))
                            .Callback<Artist>(e => _artist.RemoveAll(ent => ent.ArtistId == e.ArtistId))
                            .Returns(true);

            artistMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _artist.FirstOrDefault(ent => ent.ArtistId == id));

            return artistMocked.Object;
        }

        private ICustomerRepository CustomerRepositoryMocked()
        {
            var customerMocked = new Mock<ICustomerRepository>();

            customerMocked.Setup(e => e.GetList())
                            .Returns(_customer);

            customerMocked.Setup(e => e.Insert(It.IsAny<Customer>()))
                            .Callback<Customer>(e => _customer.Add(e))
                            .Returns<Customer>(e => e.CustomerId);

            customerMocked.Setup(e => e.Update(It.IsAny<Customer>()))
                            .Callback<Customer>(e =>
                                {
                                    _customer.RemoveAll(ent => ent.CustomerId == e.CustomerId);
                                    _customer.Add(e);
                                }
                            )
                            .Returns(true);

            customerMocked.Setup(e => e.Delete(It.IsAny<Customer>()))
                            .Callback<Customer>(e => _customer.RemoveAll(ent => ent.CustomerId == e.CustomerId))
                            .Returns(true);

            customerMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _customer.FirstOrDefault(ent => ent.CustomerId == id));

            return customerMocked.Object;
        }

        private IEmployeeRepository EmployeeRepositoryMocked()
        {
            var employeeMocked = new Mock<IEmployeeRepository>();

            employeeMocked.Setup(e => e.GetList())
                            .Returns(_employee);

            employeeMocked.Setup(e => e.Insert(It.IsAny<Employee>()))
                            .Callback<Employee>(e => _employee.Add(e))
                            .Returns<Employee>(e => e.EmployeeId);

            employeeMocked.Setup(e => e.Update(It.IsAny<Employee>()))
                            .Callback<Employee>(e =>
                                {
                                    _employee.RemoveAll(ent => ent.EmployeeId == e.EmployeeId);
                                    _employee.Add(e);
                                }
                            )
                            .Returns(true);

            employeeMocked.Setup(e => e.Delete(It.IsAny<Employee>()))
                            .Callback<Employee>(e => _employee.RemoveAll(ent => ent.EmployeeId == e.EmployeeId))
                            .Returns(true);

            employeeMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _employee.FirstOrDefault(ent => ent.EmployeeId == id));

            return employeeMocked.Object;
        }

        private IGenreRepository GenreRepositoryMocked()
        {
            var genreMocked = new Mock<IGenreRepository>();

            genreMocked.Setup(e => e.GetList())
                            .Returns(_genre);

            genreMocked.Setup(e => e.Insert(It.IsAny<Genre>()))
                            .Callback<Genre>(e => _genre.Add(e))
                            .Returns<Genre>(e => e.GenreId);

            genreMocked.Setup(e => e.Update(It.IsAny<Genre>()))
                            .Callback<Genre>(e =>
                                {
                                    _genre.RemoveAll(ent => ent.GenreId == e.GenreId);
                                    _genre.Add(e);
                                }
                            )
                            .Returns(true);

            genreMocked.Setup(e => e.Delete(It.IsAny<Genre>()))
                            .Callback<Genre>(e => _genre.RemoveAll(ent => ent.GenreId == e.GenreId))
                            .Returns(true);

            genreMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _genre.FirstOrDefault(ent => ent.GenreId == id));

            return genreMocked.Object;
        }

        private IInvoiceRepository InvoiceRepositoryMocked()
        {
            var invoiceMocked = new Mock<IInvoiceRepository>();

            invoiceMocked.Setup(e => e.GetList())
                            .Returns(_invoice);

            invoiceMocked.Setup(e => e.Insert(It.IsAny<Invoice>()))
                            .Callback<Invoice>(e => _invoice.Add(e))
                            .Returns<Invoice>(e => e.InvoiceId);

            invoiceMocked.Setup(e => e.Update(It.IsAny<Invoice>()))
                            .Callback<Invoice>(e =>
                                {
                                    _invoice.RemoveAll(ent => ent.InvoiceId == e.InvoiceId);
                                    _invoice.Add(e);
                                }
                            )
                            .Returns(true);

            invoiceMocked.Setup(e => e.Delete(It.IsAny<Invoice>()))
                            .Callback<Invoice>(e => _invoice.RemoveAll(ent => ent.InvoiceId == e.InvoiceId))
                            .Returns(true);

            invoiceMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _invoice.FirstOrDefault(ent => ent.InvoiceId == id));

            return invoiceMocked.Object;
        }

        private IInvoiceLineRepository InvoiceLineRepositoryMocked()
        {
            var invoiceLineMocked = new Mock<IInvoiceLineRepository>();

            invoiceLineMocked.Setup(e => e.GetList())
                            .Returns(_invoiceLine);

            invoiceLineMocked.Setup(e => e.Insert(It.IsAny<InvoiceLine>()))
                            .Callback<InvoiceLine>(e => _invoiceLine.Add(e))
                            .Returns<InvoiceLine>(e => e.InvoiceLineId);

            invoiceLineMocked.Setup(e => e.Update(It.IsAny<InvoiceLine>()))
                            .Callback<InvoiceLine>(e =>
                            {
                                _invoiceLine.RemoveAll(ent => ent.InvoiceLineId == e.InvoiceLineId);
                                _invoiceLine.Add(e);
                            }
                            )
                            .Returns(true);

            invoiceLineMocked.Setup(e => e.Delete(It.IsAny<InvoiceLine>()))
                            .Callback<InvoiceLine>(e => _invoiceLine.RemoveAll(ent => ent.InvoiceLineId == e.InvoiceLineId))
                            .Returns(true);

            invoiceLineMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _invoiceLine.FirstOrDefault(ent => ent.InvoiceLineId == id));

            return invoiceLineMocked.Object;
        }

        private IMediaTypeRepository MediaTypeRepositoryMocked()
        {
            var mediaTypeMocked = new Mock<IMediaTypeRepository>();

            mediaTypeMocked.Setup(e => e.GetList())
                            .Returns(_mediaType);

            mediaTypeMocked.Setup(e => e.Insert(It.IsAny<MediaType>()))
                            .Callback<MediaType>(e => _mediaType.Add(e))
                            .Returns<MediaType>(e => e.MediaTypeId);

            mediaTypeMocked.Setup(e => e.Update(It.IsAny<MediaType>()))
                            .Callback<MediaType>(e =>
                                {
                                    _mediaType.RemoveAll(ent => ent.MediaTypeId == e.MediaTypeId);
                                    _mediaType.Add(e);
                                }
                            )
                            .Returns(true);

            mediaTypeMocked.Setup(e => e.Delete(It.IsAny<MediaType>()))
                            .Callback<MediaType>(e => _mediaType.RemoveAll(ent => ent.MediaTypeId == e.MediaTypeId))
                            .Returns(true);

            mediaTypeMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _mediaType.FirstOrDefault(ent => ent.MediaTypeId == id));

            return mediaTypeMocked.Object;
        }

        private IPlaylistRepository PlaylistRepositoryMocked()
        {
            var playlistMocked = new Mock<IPlaylistRepository>();

            playlistMocked.Setup(e => e.GetList())
                            .Returns(_playlist);

            playlistMocked.Setup(e => e.Insert(It.IsAny<Playlist>()))
                            .Callback<Playlist>(e => _playlist.Add(e))
                            .Returns<Playlist>(e => e.PlaylistId);

            playlistMocked.Setup(e => e.Update(It.IsAny<Playlist>()))
                            .Callback<Playlist>(e =>
                            {
                                _playlist.RemoveAll(ent => ent.PlaylistId == e.PlaylistId);
                                _playlist.Add(e);
                            }
                            )
                            .Returns(true);

            playlistMocked.Setup(e => e.Delete(It.IsAny<Playlist>()))
                            .Callback<Playlist>(e => _playlist.RemoveAll(ent => ent.PlaylistId == e.PlaylistId))
                            .Returns(true);

            playlistMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _playlist.FirstOrDefault(ent => ent.PlaylistId == id));

            return playlistMocked.Object;
        }

        private IPlaylistTrackRepository PlaylistTrackRepositoryMocked()
        {
            var playlistTrackMocked = new Mock<IPlaylistTrackRepository>();

            playlistTrackMocked.Setup(e => e.GetList())
                            .Returns(_playlistTrack);

            playlistTrackMocked.Setup(e => e.Insert(It.IsAny<PlaylistTrack>()))
                            .Callback<PlaylistTrack>(e => _playlistTrack.Add(e))
                            .Returns<PlaylistTrack>(e => e.PlaylistTrackId);

            playlistTrackMocked.Setup(e => e.Update(It.IsAny<PlaylistTrack>()))
                            .Callback<PlaylistTrack>(e =>
                            {
                                _playlistTrack.RemoveAll(ent => ent.PlaylistTrackId == e.PlaylistTrackId);
                                _playlistTrack.Add(e);
                            }
                            )
                            .Returns(true);

            playlistTrackMocked.Setup(e => e.Delete(It.IsAny<PlaylistTrack>()))
                            .Callback<PlaylistTrack>(e => _playlistTrack.RemoveAll(ent => ent.PlaylistTrackId == e.PlaylistTrackId))
                            .Returns(true);

            playlistTrackMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _playlistTrack.FirstOrDefault(ent => ent.PlaylistTrackId == id));

            return playlistTrackMocked.Object;
        }

        private ITrackRepository TrackRepositoryMocked()
        {
            var trackMocked = new Mock<ITrackRepository>();

            trackMocked.Setup(e => e.GetList())
                            .Returns(_track);

            trackMocked.Setup(e => e.Insert(It.IsAny<Track>()))
                            .Callback<Track>(e => _track.Add(e))
                            .Returns<Track>(e => e.TrackId);

            trackMocked.Setup(e => e.Update(It.IsAny<Track>()))
                            .Callback<Track>(e =>
                            {
                                _track.RemoveAll(ent => ent.TrackId == e.TrackId);
                                _track.Add(e);
                            }
                            )
                            .Returns(true);

            trackMocked.Setup(e => e.Delete(It.IsAny<Track>()))
                            .Callback<Track>(e => _track.RemoveAll(ent => ent.TrackId == e.TrackId))
                            .Returns(true);

            trackMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _track.FirstOrDefault(ent => ent.TrackId == id));

            return trackMocked.Object;
        }

        private IUserRepository UserRepositoryMocked()
        {
            var userMocked = new Mock<IUserRepository>();

            userMocked.Setup(e => e.GetList())
                            .Returns(_user);

            userMocked.Setup(e => e.Insert(It.IsAny<User>()))
                            .Callback<User>(e => _user.Add(e))
                            .Returns<User>(e => e.Id);

            userMocked.Setup(e => e.Update(It.IsAny<User>()))
                            .Callback<User>(e =>
                            {
                                _user.RemoveAll(ent => ent.Id == e.Id);
                                _user.Add(e);
                            }
                            )
                            .Returns(true);

            userMocked.Setup(e => e.Delete(It.IsAny<User>()))
                            .Callback<User>(e => _user.RemoveAll(ent => ent.Id == e.Id))
                            .Returns(true);

            userMocked.Setup(e => e.GetById(It.IsAny<int>()))
                            .Returns((int id) => _user.FirstOrDefault(ent => ent.Id == id));

            return userMocked.Object;
        }

        private List<Album> Albums()
        {
            var fixture = new Fixture();
            var albums = fixture.CreateMany<Album>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                albums[i].AlbumId = i + 1;
            }

            return albums;
        }

        private List<Artist> Artists()
        {
            var fixture = new Fixture();
            var artists = fixture.CreateMany<Artist>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                artists[i].ArtistId = i + 1;
            }

            return artists;
        }

        private List<Customer> Customers()
        {
            var fixture = new Fixture();
            var customers = fixture.CreateMany<Customer>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                customers[i].CustomerId = i + 1;
            }

            return customers;
        }

        private List<Employee> Employees()
        {
            var fixture = new Fixture();
            var employees = fixture.CreateMany<Employee>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                employees[i].EmployeeId = i + 1;
            }

            return employees;
        }

        private List<Genre> Genres()
        {
            var fixture = new Fixture();
            var genres = fixture.CreateMany<Genre>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                genres[i].GenreId = i + 1;
            }

            return genres;
        }

        private List<Invoice> Invoices()
        {
            var fixture = new Fixture();
            var invoices = fixture.CreateMany<Invoice>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                invoices[i].InvoiceId = i + 1;
            }

            return invoices;
        }

        private List<InvoiceLine> InvoiceLines()
        {
            var fixture = new Fixture();
            var invoiceLines = fixture.CreateMany<InvoiceLine>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                invoiceLines[i].InvoiceLineId = i + 1;
            }

            return invoiceLines;
        }

        private List<MediaType> MediaTypes()
        {
            var fixture = new Fixture();
            var mediaTypes = fixture.CreateMany<MediaType>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                mediaTypes[i].MediaTypeId = i + 1;
            }

            return mediaTypes;
        }

        private List<Playlist> Playlists()
        {
            var fixture = new Fixture();
            var playlists = fixture.CreateMany<Playlist>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                playlists[i].PlaylistId = i + 1;
            }

            return playlists;
        }

        private List<PlaylistTrack> PlaylistTracks()
        {
            var fixture = new Fixture();
            var playlistTracks = fixture.CreateMany<PlaylistTrack>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                playlistTracks[i].PlaylistTrackId = i + 1;
            }

            return playlistTracks;
        }

        private List<Track> Tracks()
        {
            var fixture = new Fixture();
            var tracks = fixture.CreateMany<Track>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                tracks[i].TrackId = i + 1;
            }

            return tracks;
        }

        private List<User> Users()
        {
            var fixture = new Fixture();
            var users = fixture.CreateMany<User>(50).ToList();

            for (int i = 0; i < 50; i++)
            {
                users[i].Id = i + 1;
            }

            return users;
        }
    }
}
