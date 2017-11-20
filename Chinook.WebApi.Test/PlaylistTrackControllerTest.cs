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
    public class PlaylistTrackControllerTest
    {
        private readonly PlaylistTrackController _playlistTrackController;
        private readonly IUnitOfWork _unitMocked;

        public PlaylistTrackControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _playlistTrackController = new PlaylistTrackController(_unitMocked);
        }

        [Fact(DisplayName = "[PlaylistTrackRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _playlistTrackController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<PlaylistTrack>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[PlaylistTrackRepository] GetById")]
        public void Test_GetById()
        {
            var result = _playlistTrackController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[PlaylistTrackRepository] Post")]
        public void Test_Post()
        {
            var playlistTrack = GetNewPlaylistTrack();
            playlistTrack.PlaylistTrackId = 0;
            var result = _playlistTrackController.Post(playlistTrack) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[PlaylistTrackRepository] Put")]
        public void Test_Put()
        {
            var playlistTrack = GetNewPlaylistTrack();
            playlistTrack.PlaylistTrackId = 10;
            playlistTrack.PlaylistId = 2;

            var result = _playlistTrackController.Put(playlistTrack) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[PlaylistTrackRepository] Delete")]
        public void Test_Delete()
        {
            var playlistTrack = GetNewPlaylistTrack();
            var resultCreate = _playlistTrackController.Post(playlistTrack) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _playlistTrackController.Delete(playlistTrack.PlaylistTrackId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private PlaylistTrack GetNewPlaylistTrack()
        {
            return new PlaylistTrack
            {
                PlaylistTrackId = 100,
                PlaylistId = 1,
                TrackId = 1
            };
        }
    }
}

