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
    public class GenreControllerTest
    {
        private readonly GenreController _genreController;
        private readonly IUnitOfWork _unitMocked;

        public GenreControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _genreController = new GenreController(_unitMocked);
        }

        [Fact(DisplayName = "[GenreRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _genreController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Genre>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[GenreRepository] GetById")]
        public void Test_GetById()
        {
            var result = _genreController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[GenreRepository] Post")]
        public void Test_Post()
        {
            var genre = GetNewGenre();
            genre.GenreId = 0;
            var result = _genreController.Post(genre) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[GenreRepository] Put")]
        public void Test_Put()
        {
            var genre = GetNewGenre();
            genre.GenreId = 10;
            genre.Name = "New Genre";

            var result = _genreController.Put(genre) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[GenreRepository] Delete")]
        public void Test_Delete()
        {
            var genre = GetNewGenre();
            var resultCreate = _genreController.Post(genre) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _genreController.Delete(genre.GenreId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private Genre GetNewGenre()
        {
            return new Genre
            {
                GenreId = 100,
                Name = "New Genre"
            };
        }
    }
}
