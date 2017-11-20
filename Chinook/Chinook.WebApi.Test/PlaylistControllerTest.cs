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
    public class PlaylistControllerTest
    {
        private readonly PlaylistController _playlistController;
        private readonly IUnitOfWork _unitMocked;

        public PlaylistControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _playlistController = new PlaylistController(_unitMocked);
        }

        [Fact(DisplayName = "[PlaylistRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _playlistController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Playlist>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[PlaylistRepository] GetById")]
        public void Test_GetById()
        {
            var result = _playlistController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[PlaylistRepository] Post")]
        public void Test_Post()
        {
            var playlist = GetNewPlaylist();
            playlist.PlaylistId = 0;
            var result = _playlistController.Post(playlist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[PlaylistRepository] Put")]
        public void Test_Put()
        {
            var playlist = GetNewPlaylist();
            playlist.PlaylistId = 10;
            playlist.Name = "New Playlist";

            var result = _playlistController.Put(playlist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[PlaylistRepository] Delete")]
        public void Test_Delete()
        {
            var playlist = GetNewPlaylist();
            var resultCreate = _playlistController.Post(playlist) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _playlistController.Delete(playlist.PlaylistId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Playlist GetNewPlaylist()
        {
            return new Playlist
            {
                PlaylistId = 100,
                Name = "New Playlist"
            };
        }
    }
}
