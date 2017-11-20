using Chinook.WebApi.Controllers;
using System.Collections.Generic;
using Chinook.UnitOfWork;
using Chinook.Mocked;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;
using Xunit;
using FluentAssertions;

namespace Chinook.WebApi.Test
{
    public class AlbumControllerTest
    {
        private readonly AlbumController _albumController;
        private readonly IUnitOfWork _unitMocked;

        public AlbumControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _albumController = new AlbumController(_unitMocked);
        }

        [Fact(DisplayName = "[AlbumRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _albumController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Album>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[AlbumRepository] GetById")]
        public void Test_GetById()
        {
            var result = _albumController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[AlbumRepository] Post")]
        public void Test_Post()
        {
            var album = GetNewAlbum();
            album.AlbumId = 0;
            var result = _albumController.Post(album) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[AlbumRepository] Put")]
        public void Test_Put()
        {
            var album = GetNewAlbum();
            album.AlbumId = 10;
            album.Title = "New Title Album";

            var result = _albumController.Put(album) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[AlbumRepository] Delete")]
        public void Test_Delete()
        {
            var album = GetNewAlbum();
            var resultCreate = _albumController.Post(album) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _albumController.Delete(album.AlbumId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Album GetNewAlbum()
        {
            return new Album
            {
                AlbumId = 100,
                Title = "New Album",
                ArtistId = 1
            };
        }
    }
}
