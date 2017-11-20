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
    public class TrackControllerTest
    {
        private readonly TrackController _trackController;
        private readonly IUnitOfWork _unitMocked;

        public TrackControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _trackController = new TrackController(_unitMocked);
        }

        [Fact(DisplayName = "[TrackRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _trackController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Track>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[TrackRepository] GetById")]
        public void Test_GetById()
        {
            var result = _trackController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[TrackRepository] Post")]
        public void Test_Post()
        {
            var track = GetNewTrack();
            track.TrackId = 0;
            var result = _trackController.Post(track) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[TrackRepository] Put")]
        public void Test_Put()
        {
            var track = GetNewTrack();
            track.TrackId = 10;
            track.Name = "New Track";

            var result = _trackController.Put(track) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[TrackRepository] Delete")]
        public void Test_Delete()
        {
            var track = GetNewTrack();
            var resultCreate = _trackController.Post(track) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _trackController.Delete(track.TrackId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Track GetNewTrack()
        {
            return new Track
            {
                TrackId = 100,
                Name = "New Track",
                AlbumId = 1,
                MediaTypeId = 1,
                GenreId = 1,
                Composer = "Composer",
                Milliseconds = 10,
                Bytes = 20,
                UnitPrice = 30
            };
        }
    }
}

