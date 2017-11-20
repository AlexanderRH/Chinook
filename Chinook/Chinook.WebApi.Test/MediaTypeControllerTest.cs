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
    public class MediaTypeControllerTest
    {
        private readonly MediaTypeController _mediaTypeController;
        private readonly IUnitOfWork _unitMocked;

        public MediaTypeControllerTest()
        {
            var unitMocked = new UnitOfWorkMocked();
            _unitMocked = unitMocked.GetInstance();
            _mediaTypeController = new MediaTypeController(_unitMocked);
        }

        [Fact(DisplayName = "[MediaTypeRepository] GelAll")]
        public void Test_GetAll()
        {
            var result = _mediaTypeController.GetList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<MediaType>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[MediaTypeRepository] GetById")]
        public void Test_GetById()
        {
            var result = _mediaTypeController.GetById(10) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[MediaTypeRepository] Post")]
        public void Test_Post()
        {
            var mediaType = GetNewMediaType();
            mediaType.MediaTypeId = 0;
            var result = _mediaTypeController.Post(mediaType) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[MediaTypeRepository] Put")]
        public void Test_Put()
        {
            var mediaType = GetNewMediaType();
            mediaType.MediaTypeId = 10;
            mediaType.Name = "New MediaType";

            var result = _mediaTypeController.Put(mediaType) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        [Fact(DisplayName = "[MediaTypeRepository] Delete")]
        public void Test_Delete()
        {
            var mediaType = GetNewMediaType();
            var resultCreate = _mediaTypeController.Post(mediaType) as OkObjectResult;
            resultCreate.Should().NotBeNull();
            resultCreate.Value.Should().NotBeNull();

            var result = _mediaTypeController.Delete(mediaType.MediaTypeId) as OkObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
        }

        private MediaType GetNewMediaType()
        {
            return new MediaType
            {
                MediaTypeId = 100,
                Name = "New MediaType"
            };
        }
    }
}
