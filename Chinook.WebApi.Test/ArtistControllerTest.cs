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
    public class ArtistControllerTest
    {
        private readonly ArtistController _artistController;
        private readonly IUnitOfWork _unitMocked;

        public ArtistControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _artistController = new ArtistController(_unitMocked);
        }

        [Fact(DisplayName = "[ArtistRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _artistController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Artist>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[ArtistRepository] GetById")]
        public void Test_GetById()
        {
            var result = _artistController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[ArtistRepository] Post")]
        public void Test_Post()
        {
            var artist = GetNewArtist();
            artist.ArtistId = 0;
            var result = _artistController.Post(artist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[ArtistRepository] Put")]
        public void Test_Put()
        {
            var artist = GetNewArtist();
            artist.ArtistId = 10;
            artist.Name = "New Artist";

            var result = _artistController.Put(artist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[ArtistRepository] Delete")]
        public void Test_Delete()
        {
            var artist = GetNewArtist();
            var resultCreate = _artistController.Post(artist) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _artistController.Delete(artist.ArtistId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Artist GetNewArtist()
        {
            return new Artist
            {
                ArtistId = 100,
                Name = "New Artist"
            };
        }
    }
}
